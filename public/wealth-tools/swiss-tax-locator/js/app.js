/* SwissTax Locator — main orchestration */

(function init() {
  const { buildTaxIndex, matchGemeinde, findBySfoId, computeStats, rankInCanton, rankNational, parseCantonFromState } = SwissTaxMatcher;
  const { resolveAddress, autocompleteAddress, parseNominatimResult } = SwissTaxGeocode;
  const { loadRegistry, addEntry, removeEntry, groupByGemeinde, downloadCsv } = SwissTaxRegistry;
  const { renderCompareTable, highlightCells } = SwissTaxCompare;
  const { showToast, animateCount, formatChf, setSearchStatus } = SwissTaxUI;

  const taxIndex = buildTaxIndex(TAX_DATA);
  const stats = computeStats(TAX_DATA);
  let registry = loadRegistry();
  let selectedRow = null;
  let pendingMatch = null;
  let compareSelected = new Set();
  let mapMain = null;
  let mapModal = null;
  let suggestIdx = -1;
  let debounceTimer = null;

  const $ = (id) => document.getElementById(id);

  function renderStatsBar() {
    $('stat-cheapest').textContent = `${stats.minRow.commune} (${stats.minRow.canton}) · ${stats.minRow.total_pct.toFixed(2)}%`;
    $('stat-expensive').textContent = `${stats.maxRow.commune} (${stats.maxRow.canton}) · ${stats.maxRow.total_pct.toFixed(2)}%`;
    $('stat-avg').textContent = `${stats.nationalAvg.toFixed(2)}%`;
    $('stat-count').textContent = String(TAX_DATA.length);
    renderCantonTable();
  }

  function renderCantonTable() {
    const tbody = $('canton-table-body');
    if (!tbody) return;
    tbody.innerHTML = stats.cantonAvgs.map((c) => `
      <tr data-canton="${c.canton}">
        <td><strong>${c.canton}</strong></td>
        <td class="mono">${c.avg.toFixed(2)}%</td>
        <td class="mono">${c.count}</td>
      </tr>
    `).join('');
  }

  let cantonSort = { key: 'avg', dir: 1 };
  $('canton-table')?.addEventListener('click', (ev) => {
    const th = ev.target.closest('th');
    if (!th) return;
    const key = th.dataset.sort;
    if (!key) return;
    if (cantonSort.key === key) cantonSort.dir *= -1;
    else { cantonSort.key = key; cantonSort.dir = 1; }
    const sorted = [...stats.cantonAvgs].sort((a, b) => {
      const va = key === 'canton' ? a.canton : a[key];
      const vb = key === 'canton' ? b.canton : b[key];
      return va < vb ? -cantonSort.dir : va > vb ? cantonSort.dir : 0;
    });
    $('canton-table-body').innerHTML = sorted.map((c) => `
      <tr><td><strong>${c.canton}</strong></td>
      <td class="mono">${c.avg.toFixed(2)}%</td>
      <td class="mono">${c.count}</td></tr>
    `).join('');
  });

  function showTaxCard(row, opts = {}) {
    selectedRow = row;
    pendingMatch = null;
    $('confidence-banner')?.classList.remove('open');
    $('tax-card-empty').style.display = 'none';
    const card = $('tax-card');
    card.classList.add('visible');

    $('tc-name').textContent = row.commune;
    $('tc-canton').textContent = row.canton;

    const heroPct = $('tc-pct');
    const heroChf = $('tc-chf');
    animateCount(heroPct, row.total_pct, 700, 2, '%');
    animateCount(heroChf, row.total_chf, 700, 0, '');
    heroChf.textContent = '';
    setTimeout(() => { heroChf.textContent = formatChf(row.total_chf); }, 720);

    const { rank, total, cantonAvg } = rankInCanton(row, TAX_DATA);
    const natRank = rankNational(row, TAX_DATA);
    const vsCanton = ((row.total_pct - cantonAvg) / cantonAvg) * 100;
    const vsNat = ((row.total_pct - stats.nationalAvg) / stats.nationalAvg) * 100;

    $('tc-benchmarks').innerHTML = `
      <p>Rank <strong>${rank}</strong> of <strong>${total}</strong> in canton ${row.canton}</p>
      <p>Rank <strong>#${natRank}</strong> of ${TAX_DATA.length} nationally</p>
      <p class="${vsCanton <= 0 ? 'pos' : 'neg'}">${Math.abs(vsCanton).toFixed(1)}% ${vsCanton <= 0 ? 'below' : 'above'} cantonal average</p>
      <p class="${vsNat <= 0 ? 'pos' : 'neg'}">${Math.abs(vsNat).toFixed(1)}% ${vsNat <= 0 ? 'below' : 'above'} national average</p>
    `;

    const t = (row.total_pct - stats.minPct) / (stats.maxPct - stats.minPct || 1);
    $('tc-marker').style.left = `${Math.max(2, Math.min(98, t * 100))}%`;

    $('bd-federal').textContent = formatChf(row.federal);
    $('bd-cantonal').textContent = formatChf(row.cantonal);
    $('bd-communal').textContent = formatChf(row.communal);
    $('bd-church').textContent = formatChf(row.church);
    $('bd-personal').textContent = formatChf(row.personal);

    mapMain?.highlightSfo(row.sfo_id);
    mapModal?.highlightSfo(row.sfo_id);

    if (opts.fillSearch !== false) {
      $('address-search').value = `${row.commune}, ${row.canton}`;
    }
  }

  function showConfidence(match, gemeindeName) {
    pendingMatch = match;
    const banner = $('confidence-banner');
    banner.classList.add('open');
    banner.innerHTML = `
      Matched to <strong>${match.row.commune}</strong> (${match.row.canton}) — confidence ${(match.confidence * 100).toFixed(0)}%. Are you sure?
      <div class="actions">
        <button type="button" class="btn btn-primary" id="btn-confirm-match">✓ Yes</button>
        <button type="button" class="btn" id="btn-manual-match">Search manually</button>
      </div>
    `;
    $('btn-confirm-match').onclick = () => {
      showTaxCard(match.row);
      banner.classList.remove('open');
    };
    $('btn-manual-match').onclick = () => openManualSelect(gemeindeName);
  }

  function openManualSelect(filter = '') {
    const wrap = $('manual-fallback');
    wrap.classList.add('open');
    const sel = $('manual-gemeinde');
    const norm = filter ? SwissTaxMatcher.normalizeName(filter) : '';
    const opts = TAX_DATA
      .filter((r) => !norm || SwissTaxMatcher.normalizeName(r.commune).includes(norm) || SwissTaxMatcher.levenshtein(norm, SwissTaxMatcher.normalizeName(r.commune)) <= 4)
      .sort((a, b) => a.commune.localeCompare(b.commune))
      .slice(0, 200);
    sel.innerHTML = opts.map((r) =>
      `<option value="${r.sfo_id}">${r.commune} (${r.canton}) — ${r.total_pct.toFixed(2)}%</option>`
    ).join('');
  }

  function resolveAndShow(parsed, addressLabel) {
    const cantonHint = parseCantonFromState(parsed.canton);
    const match = matchGemeinde(parsed.gemeinde, cantonHint, taxIndex);

    if (!match.row) {
      setSearchStatus('err');
      showToast(`Tax data not available for ${parsed.gemeinde}. Try manual selection.`);
      openManualSelect(parsed.gemeinde);
      return;
    }

    if (match.confidence < 0.88 && match.method !== 'exact') {
      setSearchStatus('ok');
      showConfidence(match, parsed.gemeinde);
      return;
    }

    setSearchStatus('ok');
    showTaxCard(match.row);

    if (addressLabel) {
      const result = addEntry(registry, {
        address: addressLabel,
        gemeinde: match.row.commune,
        canton: match.row.canton,
        canton_id: match.row.canton_id,
        sfo_id: match.row.sfo_id,
        total_pct: match.row.total_pct,
        total_chf: match.row.total_chf,
        federal: match.row.federal,
        cantonal: match.row.cantonal,
        communal: match.row.communal,
        church: match.row.church,
        personal: match.row.personal,
        lat: parsed.lat,
        lon: parsed.lon,
      });
      if (result.ok) {
        registry = loadRegistry();
        renderRegistry(true);
      } else if (result.reason === 'duplicate') {
        showToast('Already in registry');
      }
    }
  }

  async function onSearchSubmit() {
    const q = $('address-search').value.trim();
    if (!q) return;
    hideSuggestions();
    setSearchStatus('loading');
    $('manual-fallback').classList.remove('open');

    try {
      const parsed = await resolveAddress(q);
      resolveAndShow(parsed, parsed.displayName || q);
    } catch (e) {
      setSearchStatus('err');
      if (e.code === 'NOT_FOUND') {
        showToast(e.message);
      } else {
        showToast(e.message || 'Lookup failed');
      }
      openManualSelect(q);
    }
  }

  function renderRegistry(flashNew = false) {
    const el = $('registry-list');
    const groups = groupByGemeinde(registry.entries);
    if (!groups.length) {
      el.innerHTML = '<p class="registry-empty">Resolved addresses appear here, grouped by Gemeinde.</p>';
      return;
    }

    el.innerHTML = groups.map((g) => {
      const key = `${g.sfo_id}`;
      const checked = compareSelected.has(key) ? 'checked' : '';
      const collapsed = g._collapsed ? 'collapsed' : '';
      return `
        <div class="gemeinde-group ${flashNew ? 'flash' : ''}" data-key="${key}">
          <div class="group-head" data-action="toggle">
            <input type="checkbox" data-compare="${key}" ${checked} aria-label="Compare ${g.gemeinde}" />
            <span class="group-title">📍 ${g.gemeinde} (${g.canton})</span>
            <span class="group-meta">${g.total_pct.toFixed(1)}% · ${formatChf(g.total_chf)}</span>
            <button type="button" class="group-toggle" data-action="collapse">▼</button>
          </div>
          <div class="group-addresses ${collapsed}">
            ${g.entries.map((e) => `
              <div class="addr-row" data-id="${e.id}" data-sfo="${e.sfo_id}">
                <span>└ ${e.address}</span>
                <button type="button" class="del" data-delete="${e.id}" aria-label="Remove">×</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    el.querySelectorAll('[data-compare]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const key = cb.dataset.compare;
        if (cb.checked) {
          if (compareSelected.size >= 4) {
            cb.checked = false;
            showToast('Maximum 4 Gemeinden for comparison');
            return;
          }
          compareSelected.add(key);
        } else {
          compareSelected.delete(key);
        }
        $('btn-compare').disabled = compareSelected.size < 2;
      });
    });

    el.querySelectorAll('.addr-row').forEach((row) => {
      row.addEventListener('click', (ev) => {
        if (ev.target.closest('[data-delete]')) return;
        const sfo = Number(row.dataset.sfo);
        const taxRow = findBySfoId(sfo, taxIndex);
        if (taxRow) showTaxCard(taxRow);
      });
    });

    el.querySelectorAll('[data-delete]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        removeEntry(registry, btn.dataset.delete);
        registry = loadRegistry();
        renderRegistry();
      });
    });

    el.querySelectorAll('[data-action="collapse"]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const addrs = btn.closest('.gemeinde-group').querySelector('.group-addresses');
        addrs.classList.toggle('collapsed');
        btn.textContent = addrs.classList.contains('collapsed') ? '▶' : '▼';
      });
    });
  }

  function localSuggestions(q) {
    const lq = q.toLowerCase();
    return registry.entries
      .filter((e) => e.address.toLowerCase().includes(lq))
      .slice(0, 5)
      .map((e) => ({ label: e.address, type: 'registry', entry: e }));
  }

  function showSuggestions(items) {
    const ul = $('suggestions');
    if (!items.length) {
      ul.classList.remove('open');
      return;
    }
    ul.innerHTML = items.map((it, i) => `
      <li data-idx="${i}" class="${i === suggestIdx ? 'active' : ''}">
        ${it.label}
        <div class="src">${it.type === 'registry' ? 'Saved address' : 'OpenStreetMap'}</div>
      </li>
    `).join('');
    ul.classList.add('open');
    ul._items = items;
  }

  function hideSuggestions() {
    $('suggestions').classList.remove('open');
    suggestIdx = -1;
  }

  async function onInputChange() {
    const q = $('address-search').value.trim();
    clearTimeout(debounceTimer);
    if (q.length < 3) {
      showSuggestions(localSuggestions(q));
      return;
    }
    const local = localSuggestions(q);
    showSuggestions(local);
    debounceTimer = setTimeout(async () => {
      try {
        const results = await autocompleteAddress(q);
        const remote = results.map((r) => ({
          label: r.display_name,
          type: 'nominatim',
          raw: r,
        }));
        showSuggestions([...local, ...remote].slice(0, 10));
      } catch {
        showSuggestions(local);
      }
    }, 300);
  }

  function selectSuggestion(item) {
    hideSuggestions();
    if (item.type === 'registry') {
      $('address-search').value = item.entry.address;
      const row = findBySfoId(item.entry.sfo_id, taxIndex);
      if (row) showTaxCard(row);
      return;
    }
    if (item.type === 'nominatim') {
      $('address-search').value = item.label;
      onSearchSubmit();
    }
  }

  function openCompare() {
    const groups = groupByGemeinde(registry.entries)
      .filter((g) => compareSelected.has(String(g.sfo_id)));
    const table = renderCompareTable(groups, TAX_DATA, rankNational);
    if (!table) {
      showToast('Select 2–4 Gemeinden to compare');
      return;
    }
    const overlay = $('compare-overlay');
    const host = $('compare-table-host');
    let html = '<table class="compare-table"><thead><tr><th>Field</th>';
    table.cols.forEach((c) => { html += `<th>${c.gemeinde}</th>`; });
    html += '</tr></thead><tbody>';
    table.rows.forEach((row) => {
      html += `<tr><td>${row.label}</td>`;
      row.values.forEach((v) => {
        const fmt = row.def ? row.def.fmt(v) : v;
        html += `<td class="mono">${fmt}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    host.innerHTML = html;
    highlightCells(host.querySelector('table'), table.rows);
    overlay.classList.add('open');
  }

  function onMapSelect(row) {
    showTaxCard(row, { fillSearch: true });
  }

  async function boot() {
    renderStatsBar();
    renderRegistry();

    mapMain = new SwissTaxMap('map-container', taxIndex, onMapSelect);
    await mapMain.init();

    $('address-search').addEventListener('keydown', (ev) => {
      const ul = $('suggestions');
      const items = ul._items || [];
      if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        suggestIdx = Math.min(items.length - 1, suggestIdx + 1);
        showSuggestions(items);
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        suggestIdx = Math.max(0, suggestIdx - 1);
        showSuggestions(items);
      } else if (ev.key === 'Enter') {
        ev.preventDefault();
        if (suggestIdx >= 0 && items[suggestIdx]) selectSuggestion(items[suggestIdx]);
        else onSearchSubmit();
      } else if (ev.key === 'Escape') hideSuggestions();
    });

    $('address-search').addEventListener('input', onInputChange);
    $('suggestions').addEventListener('click', (ev) => {
      const li = ev.target.closest('li');
      if (!li || !li.parentElement._items) return;
      selectSuggestion(li.parentElement._items[Number(li.dataset.idx)]);
    });

    $('btn-search').addEventListener('click', onSearchSubmit);
    $('btn-export').addEventListener('click', () => downloadCsv(registry.entries));
    $('btn-compare').addEventListener('click', openCompare);
    $('btn-close-compare').addEventListener('click', () => $('compare-overlay').classList.remove('open'));
    $('compare-overlay').addEventListener('click', (ev) => {
      if (ev.target.id === 'compare-overlay') $('compare-overlay').classList.remove('open');
    });

    $('manual-gemeinde')?.addEventListener('change', () => {
      const row = findBySfoId(Number($('manual-gemeinde').value), taxIndex);
      if (row) {
        setSearchStatus('ok');
        showTaxCard(row);
      }
    });

    $('btn-map-expand')?.addEventListener('click', async () => {
      $('map-modal').classList.add('open');
      if (!mapModal) {
        mapModal = new SwissTaxMap('map-modal-container', taxIndex, (row) => {
          onMapSelect(row);
          $('map-modal').classList.remove('open');
        });
        await mapModal.init();
      }
      if (selectedRow) mapModal.highlightSfo(selectedRow.sfo_id);
    });
    $('btn-map-close')?.addEventListener('click', () => $('map-modal').classList.remove('open'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
