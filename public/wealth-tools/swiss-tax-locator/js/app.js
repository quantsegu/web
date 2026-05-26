/* SwissTax Locator — main orchestration */

(function init() {
  const { buildTaxIndex, matchGemeinde, findBySfoId, computeStats, rankInCanton, rankNational, parseCantonFromState } = SwissTaxMatcher;
  const { resolveAddress, autocompleteAddress, parseNominatimResult } = SwissTaxGeocode;
  const {
    loadRegistry, addEntry, removeEntry, groupByGemeinde, filterEntries,
    getCapacity, downloadCsv, downloadJson, importFromFile, MAX_LOCATIONS,
  } = SwissTaxRegistry;
  const { getFortuneBase, getTaxProfile } = SwissTaxProfile;
  const { renderCompareTable, highlightCells } = SwissTaxCompare;
  const { showToast, animateCount, formatChf, setSearchStatus } = SwissTaxUI;

  const taxIndex = buildTaxIndex(TAX_DATA);
  const stats = computeStats(TAX_DATA);
  let registry = loadRegistry();
  let selectedRow = null;
  let pendingMatch = null;
  let pendingAddressLabel = null;
  let lastParsedGeo = null;
  let compareSelected = new Set();
  let mapMain = null;
  let mapModal = null;
  let suggestIdx = -1;
  let debounceTimer = null;
  let registryFilterQuery = '';

  const $ = (id) => document.getElementById(id);

  function updateRegistryMeta() {
    const cap = getCapacity(registry);
    const countEl = $('registry-count');
    const fillEl = $('registry-capacity-fill');
    if (countEl) {
      countEl.textContent = `${cap.count} / ${cap.max}`;
      countEl.classList.toggle('near-limit', cap.count >= cap.max * 0.9);
    }
    if (fillEl) {
      const pct = cap.max ? (cap.count / cap.max) * 100 : 0;
      fillEl.style.width = `${pct}%`;
      fillEl.classList.toggle('near-limit', cap.atLimit);
    }
  }

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

    const fortuneBase = getFortuneBase();
    const profile = getTaxProfile(row, fortuneBase);
    const wealthEl = $('tc-wealth-chf');
    const wealthPctEl = $('tc-wealth-pct');
    const corpEl = $('tc-corp-pct');
    if (profile.wealth_chf != null) {
      wealthEl.textContent = formatChf(profile.wealth_chf);
      wealthPctEl.textContent = `${profile.wealth_pct.toFixed(3)}% on CHF ${fortuneBase.toLocaleString('de-CH')} taxable wealth`;
    } else {
      wealthEl.textContent = '—';
      wealthPctEl.textContent = 'Estimate unavailable for this Gemeinde';
    }
    if (profile.corp_pct != null) {
      corpEl.textContent = `~${profile.corp_pct.toFixed(1)}%`;
    } else {
      corpEl.textContent = '—';
    }

    const saveBtn = $('btn-save-location');
    if (saveBtn) {
      saveBtn.classList.remove('saved');
      saveBtn.textContent = 'Save to registry';
      saveBtn.disabled = false;
    }

    mapMain?.highlightSfo(row.sfo_id);
    mapModal?.highlightSfo(row.sfo_id);

    if (opts.fillSearch !== false) {
      $('address-search').value = `${row.commune}, ${row.canton}`;
    }
  }

  function buildRegistryPayload(row, address, parsed) {
    const fortuneBase = getFortuneBase();
    const profile = getTaxProfile(row, fortuneBase);
    return {
      address: address || `${row.commune}, ${row.canton}`,
      gemeinde: row.commune,
      canton: row.canton,
      canton_id: row.canton_id,
      sfo_id: row.sfo_id,
      total_pct: row.total_pct,
      total_chf: row.total_chf,
      federal: row.federal,
      cantonal: row.cantonal,
      communal: row.communal,
      church: row.church,
      personal: row.personal,
      wealth_chf: profile.wealth_chf,
      wealth_pct: profile.wealth_pct,
      corp_pct: profile.corp_pct,
      fortune_base: fortuneBase,
      lat: parsed?.lat ?? null,
      lon: parsed?.lon ?? null,
    };
  }

  function saveToRegistry(row, address, parsed, opts = {}) {
    const result = addEntry(registry, buildRegistryPayload(row, address, parsed));
    if (result.ok) {
      registry = loadRegistry();
      renderRegistry(true);
      updateRegistryMeta();
      if (!opts.silent) {
        showToast('Location saved');
        const btn = $('btn-save-location');
        if (btn) {
          btn.classList.add('saved');
          btn.textContent = 'Saved ✓';
        }
      }
      return true;
    }
    if (!opts.silent) {
      if (result.reason === 'duplicate') showToast('Already in registry');
      else if (result.reason === 'limit') showToast(`Location limit reached (${MAX_LOCATIONS})`);
      else if (result.reason === 'quota') showToast('Storage full — export a backup first');
      else showToast('Could not save location');
    }
    return false;
  }

  function showConfidence(match, gemeindeName) {
    pendingMatch = match;
    const banner = $('confidence-banner');
    banner.classList.add('open');
    banner.innerHTML = `
      Matched to <strong>${match.row.commune}</strong> (${match.row.canton}) — confidence ${(match.confidence * 100).toFixed(0)}%. Confirm match?
      <div class="actions">
        <button type="button" class="btn btn-primary" id="btn-confirm-match">✓ Confirm & show taxes</button>
        <button type="button" class="btn" id="btn-manual-match">Search manually</button>
      </div>
    `;
    $('btn-confirm-match').onclick = () => {
      showTaxCard(match.row);
      banner.classList.remove('open');
      if (pendingAddressLabel) {
        saveToRegistry(match.row, pendingAddressLabel, lastParsedGeo);
        pendingAddressLabel = null;
      }
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

  function resolveAndShow(parsed, addressLabel, opts = {}) {
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

    if (addressLabel && opts.autoSave !== false) {
      saveToRegistry(match.row, addressLabel, parsed);
    }
  }

  async function onSearchSubmit() {
    const q = $('address-search').value.trim();
    if (!q) return;
    hideSuggestions();
    setSearchStatus('loading');
    $('manual-fallback').classList.remove('open');

    pendingAddressLabel = q;
    try {
      const parsed = await resolveAddress(q);
      lastParsedGeo = parsed;
      resolveAndShow(parsed, parsed.displayName || q, { autoSave: false });
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
    updateRegistryMeta();
    const filtered = filterEntries(registry.entries, registryFilterQuery);
    const groups = groupByGemeinde(filtered);
    const autoCollapse = registry.entries.length > 15;

    if (!registry.entries.length) {
      el.innerHTML = '<p class="registry-empty">Resolved addresses appear here, grouped by Gemeinde. Up to 200 locations — export or import backups anytime.</p>';
      return;
    }
    if (!groups.length) {
      el.innerHTML = '<p class="registry-filter-empty">No locations match your filter.</p>';
      return;
    }

    el.innerHTML = groups.map((g) => {
      const key = `${g.sfo_id}`;
      const checked = compareSelected.has(key) ? 'checked' : '';
      const collapsed = autoCollapse ? 'collapsed' : (g._collapsed ? 'collapsed' : '');
      return `
        <div class="gemeinde-group ${flashNew ? 'flash' : ''}" data-key="${key}">
          <div class="group-head" data-action="toggle">
            <input type="checkbox" data-compare="${key}" ${checked} aria-label="Compare ${g.gemeinde}" />
            <span class="group-title">📍 ${g.gemeinde} (${g.canton}) <span class="group-count">${g.entries.length}</span></span>
            <span class="group-meta">${g.total_pct.toFixed(1)}% · ${g.entries[0].wealth_chf != null ? formatChf(g.entries[0].wealth_chf) + ' wealth' : formatChf(g.total_chf)}</span>
            <button type="button" class="group-toggle" data-action="collapse">${autoCollapse ? '▶' : '▼'}</button>
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
        updateRegistryMeta();
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
      .filter((e) => {
        const hay = `${e.address} ${e.gemeinde} ${e.canton}`.toLowerCase();
        return hay.includes(lq);
      })
      .slice(0, 12)
      .map((e) => ({ label: e.address, type: 'registry', entry: e }));
  }

  function handleImportFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const replace = registry.entries.length > 0
        && window.confirm(
          `Import ${file.name}?\n\nOK = Replace all ${registry.entries.length} saved locations with file contents.\nCancel = Merge (keep existing, add new, skip duplicates).`,
        );
      const mode = replace ? 'replace' : 'merge';
      const result = importFromFile(registry, String(reader.result || ''), file.name, mode);
      registry = loadRegistry();
      renderRegistry();
      updateRegistryMeta();
      if (!result.ok) {
        showToast(result.errors?.[0] || result.parseErrors?.[0] || 'Import failed');
        return;
      }
      const parts = [`${result.added} added`];
      if (result.duplicates) parts.push(`${result.duplicates} duplicates skipped`);
      if (result.skippedLimit) parts.push(`${result.skippedLimit} over ${MAX_LOCATIONS} limit`);
      showToast(`Import complete: ${parts.join(', ')}`);
    };
    reader.onerror = () => showToast('Could not read file');
    reader.readAsText(file);
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
    lastParsedGeo = null;
    pendingAddressLabel = $('address-search').value.trim() || `${row.commune}, ${row.canton}`;
  }

  function saveGemeindeFromManual() {
    const sfo = Number($('manual-gemeinde')?.value);
    if (!sfo) {
      openManualSelect();
      showToast('Select a Gemeinde first');
      return;
    }
    const row = findBySfoId(sfo, taxIndex);
    if (!row) return;
    const addr = $('address-search').value.trim() || `${row.commune}, ${row.canton}`;
    showTaxCard(row);
    saveToRegistry(row, addr, lastParsedGeo);
  }

  async function boot() {
    renderStatsBar();
    renderRegistry();

    try {
      mapMain = new SwissTaxMap('map-container', taxIndex, onMapSelect);
      await mapMain.init();
    } catch (err) {
      console.error('Map failed to load:', err);
      const mapEl = $('map-container');
      if (mapEl) {
        mapEl.innerHTML = '<p style="padding:24px;color:#5c5a56;font-size:0.85rem;">Map unavailable — search and tax lookup still work.</p>';
      }
    }

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
    $('btn-save-location')?.addEventListener('click', () => {
      if (!selectedRow) {
        showToast('Look up or select a Gemeinde first');
        return;
      }
      const addr = $('address-search').value.trim() || pendingAddressLabel || `${selectedRow.commune}, ${selectedRow.canton}`;
      saveToRegistry(selectedRow, addr, lastParsedGeo);
    });
    $('btn-save-gemeinde')?.addEventListener('click', saveGemeindeFromManual);
    $('fortune-amount')?.addEventListener('change', () => {
      if (selectedRow) showTaxCard(selectedRow, { fillSearch: false });
    });
    $('fortune-amount')?.addEventListener('input', () => {
      if (selectedRow) showTaxCard(selectedRow, { fillSearch: false });
    });
    $('btn-export-csv')?.addEventListener('click', () => {
      if (!registry.entries.length) {
        showToast('No locations to export');
        return;
      }
      downloadCsv(registry.entries);
      showToast(`Exported ${registry.entries.length} locations (CSV)`);
    });
    $('btn-export-json')?.addEventListener('click', () => {
      if (!registry.entries.length) {
        showToast('No locations to export');
        return;
      }
      downloadJson(registry);
      showToast(`Backup saved (${registry.entries.length} locations)`);
    });
    $('btn-import')?.addEventListener('click', () => $('import-file')?.click());
    $('import-file')?.addEventListener('change', (ev) => {
      const file = ev.target.files?.[0];
      handleImportFile(file);
      ev.target.value = '';
    });
    $('registry-filter')?.addEventListener('input', (ev) => {
      registryFilterQuery = ev.target.value;
      renderRegistry();
    });
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
        pendingAddressLabel = $('address-search').value.trim() || `${row.commune}, ${row.canton}`;
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
