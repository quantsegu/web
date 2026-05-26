/* localStorage registry — up to 200 locations, JSON/CSV import & export */

const STORAGE_KEY = 'swissTaxRegistry';
const MAX_LOCATIONS = 200;
const SCHEMA_VERSION = 2;

function loadRegistry() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyRegistry();
    const data = JSON.parse(raw);
    const entries = Array.isArray(data.entries) ? data.entries : [];
    const migrated = entries.map(normalizeEntry).filter(Boolean).slice(0, MAX_LOCATIONS);
    return {
      version: SCHEMA_VERSION,
      max_locations: MAX_LOCATIONS,
      updated_at: data.updated_at || new Date().toISOString(),
      entries: migrated,
    };
  } catch {
    return emptyRegistry();
  }
}

function emptyRegistry() {
  return {
    version: SCHEMA_VERSION,
    max_locations: MAX_LOCATIONS,
    updated_at: new Date().toISOString(),
    entries: [],
  };
}

function saveRegistry(data) {
  const payload = {
    version: SCHEMA_VERSION,
    max_locations: MAX_LOCATIONS,
    updated_at: new Date().toISOString(),
    entries: data.entries.slice(0, MAX_LOCATIONS),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return { ok: true };
  } catch (err) {
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      return { ok: false, reason: 'quota' };
    }
    throw err;
  }
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function normalizeAddressKey(addr) {
  return String(addr).toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeEntry(raw) {
  if (!raw || !raw.address) return null;
  const address = String(raw.address).trim();
  if (!address) return null;
  return {
    id: raw.id || uuid(),
    address,
    gemeinde: String(raw.gemeinde || raw.commune || '').trim(),
    canton: String(raw.canton || '').trim().toUpperCase().slice(0, 2),
    canton_id: Number(raw.canton_id) || 0,
    sfo_id: Number(raw.sfo_id) || 0,
    total_pct: Number(raw.total_pct) || 0,
    total_chf: Number(raw.total_chf) || 0,
    federal: Number(raw.federal) || 0,
    cantonal: Number(raw.cantonal) || 0,
    communal: Number(raw.communal) || 0,
    church: Number(raw.church) || 0,
    personal: Number(raw.personal) || 0,
    lat: raw.lat != null && raw.lat !== '' ? Number(raw.lat) : null,
    lon: raw.lon != null && raw.lon !== '' ? Number(raw.lon) : null,
    added_at: raw.added_at || new Date().toISOString(),
    note: raw.note ? String(raw.note).trim() : '',
  };
}

function getCapacity(registry) {
  const count = registry.entries.length;
  return {
    count,
    max: MAX_LOCATIONS,
    remaining: Math.max(0, MAX_LOCATIONS - count),
    atLimit: count >= MAX_LOCATIONS,
  };
}

function isDuplicate(entries, address) {
  const key = normalizeAddressKey(address);
  return entries.some((e) => normalizeAddressKey(e.address) === key);
}

function addEntry(registry, entry) {
  if (registry.entries.length >= MAX_LOCATIONS) {
    return { ok: false, reason: 'limit' };
  }
  if (isDuplicate(registry.entries, entry.address)) {
    return { ok: false, reason: 'duplicate' };
  }
  const full = normalizeEntry({ ...entry, added_at: new Date().toISOString() });
  if (!full) return { ok: false, reason: 'invalid' };
  registry.entries.push(full);
  const saved = saveRegistry(registry);
  if (!saved.ok) {
    registry.entries.pop();
    return { ok: false, reason: saved.reason || 'quota' };
  }
  return { ok: true, entry: full };
}

function removeEntry(registry, id) {
  registry.entries = registry.entries.filter((e) => e.id !== id);
  return saveRegistry(registry);
}

function clearAllEntries(registry) {
  registry.entries = [];
  return saveRegistry(registry);
}

function groupByGemeinde(entries) {
  const groups = new Map();
  for (const e of entries) {
    const key = `${e.sfo_id}|${e.gemeinde}|${e.canton}`;
    if (!groups.has(key)) {
      groups.set(key, {
        gemeinde: e.gemeinde,
        canton: e.canton,
        sfo_id: e.sfo_id,
        total_pct: e.total_pct,
        total_chf: e.total_chf,
        entries: [],
      });
    }
    groups.get(key).entries.push(e);
  }
  return [...groups.values()].sort((a, b) => a.gemeinde.localeCompare(b.gemeinde));
}

function filterEntries(entries, query) {
  const q = String(query || '').toLowerCase().trim();
  if (!q) return entries;
  return entries.filter((e) => {
    const hay = [
      e.address,
      e.gemeinde,
      e.canton,
      e.note,
    ].join(' ').toLowerCase();
    return hay.includes(q);
  });
}

function exportCsv(entries) {
  const header = 'Address,Gemeinde,Canton,Tax %,Tax CHF,Federal,Cantonal,Communal,Church,Personal,Lat,Lon,Note,Added';
  const rows = entries.map((e) => [
    `"${String(e.address).replace(/"/g, '""')}"`,
    `"${String(e.gemeinde).replace(/"/g, '""')}"`,
    e.canton,
    e.total_pct,
    e.total_chf,
    e.federal,
    e.cantonal,
    e.communal,
    e.church,
    e.personal,
    e.lat ?? '',
    e.lon ?? '',
    `"${String(e.note || '').replace(/"/g, '""')}"`,
    e.added_at,
  ].join(','));
  return [header, ...rows].join('\n');
}

function exportJson(registry) {
  return JSON.stringify({
    version: SCHEMA_VERSION,
    app: 'SwissTaxLocator',
    exported_at: new Date().toISOString(),
    max_locations: MAX_LOCATIONS,
    entry_count: registry.entries.length,
    entries: registry.entries,
  }, null, 2);
}

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadCsv(entries, filename = 'swiss-tax-locations.csv') {
  downloadBlob(exportCsv(entries), filename, 'text/csv;charset=utf-8');
}

function downloadJson(registry, filename = 'swiss-tax-locations-backup.json') {
  downloadBlob(exportJson(registry), filename, 'application/json;charset=utf-8');
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function importFromCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { entries: [], errors: ['CSV has no data rows'] };

  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const col = (names) => {
    for (const n of names) {
      const i = header.indexOf(n);
      if (i >= 0) return i;
    }
    return -1;
  };

  const iAddr = col(['address']);
  const iGem = col(['gemeinde', 'commune']);
  const iCan = col(['canton']);
  const iPct = col(['tax %', 'total tax %', 'total_tax_pct', 'total tax burden in %']);
  const iChf = col(['tax chf', 'total tax chf', 'total_chf', 'total tax burden in chf']);
  const iSfo = col(['sfo_id', 'sfo commune id', 'sfo_commune_id']);
  const iFed = col(['federal', 'federal tax in chf']);
  const iCant = col(['cantonal', 'cantonal tax in chf']);
  const iCom = col(['communal', 'communal tax in chf']);
  const iChurch = col(['church', 'church tax in chf']);
  const iPers = col(['personal', 'personal tax in chf']);
  const iLat = col(['lat']);
  const iLon = col(['lon']);
  const iNote = col(['note']);

  if (iAddr < 0) return { entries: [], errors: ['CSV must include an Address column'] };

  const cellNum = (cells, idx) => (idx >= 0 && cells[idx] !== '' ? Number(cells[idx]) : 0);

  const entries = [];
  const errors = [];

  for (let r = 1; r < lines.length; r++) {
    const cells = parseCsvLine(lines[r]);
    if (!cells.some((c) => c.trim())) continue;
    const row = {
      address: cells[iAddr],
      gemeinde: iGem >= 0 ? cells[iGem] : '',
      canton: iCan >= 0 ? cells[iCan] : '',
      sfo_id: iSfo >= 0 ? Number(cells[iSfo]) : 0,
      total_pct: cellNum(cells, iPct),
      total_chf: cellNum(cells, iChf),
      federal: cellNum(cells, iFed),
      cantonal: cellNum(cells, iCant),
      communal: cellNum(cells, iCom),
      church: cellNum(cells, iChurch),
      personal: cellNum(cells, iPers),
      lat: iLat >= 0 && cells[iLat] !== '' ? Number(cells[iLat]) : null,
      lon: iLon >= 0 && cells[iLon] !== '' ? Number(cells[iLon]) : null,
      note: iNote >= 0 ? cells[iNote] : '',
    };
    const norm = normalizeEntry(row);
    if (norm) entries.push(norm);
    else errors.push(`Row ${r + 1}: invalid address`);
  }

  return { entries, errors };
}

function importFromJson(text) {
  const errors = [];
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { entries: [], errors: ['Invalid JSON file'] };
  }

  let list = [];
  if (Array.isArray(data)) list = data;
  else if (Array.isArray(data.entries)) list = data.entries;
  else if (Array.isArray(data.swissTaxRegistry?.entries)) list = data.swissTaxRegistry.entries;
  else return { entries: [], errors: ['JSON must contain an entries array'] };

  const entries = [];
  list.forEach((raw, i) => {
    const norm = normalizeEntry(raw);
    if (norm) entries.push(norm);
    else errors.push(`Entry ${i + 1}: missing address`);
  });
  return { entries, errors };
}

/**
 * @param {'merge'|'replace'} mode
 */
function applyImport(registry, incoming, mode) {
  const result = {
    added: 0,
    duplicates: 0,
    skippedLimit: 0,
    truncated: 0,
    errors: [],
  };

  let pool = mode === 'replace' ? [] : [...registry.entries];
  const seen = new Set(pool.map((e) => normalizeAddressKey(e.address)));

  for (const raw of incoming) {
    const entry = normalizeEntry(raw);
    if (!entry) continue;
    const key = normalizeAddressKey(entry.address);
    if (seen.has(key)) {
      result.duplicates++;
      continue;
    }
    if (pool.length >= MAX_LOCATIONS) {
      result.skippedLimit++;
      continue;
    }
    seen.add(key);
    pool.push(entry);
    result.added++;
  }

  if (incoming.length > 0 && result.added === 0 && result.duplicates === incoming.length) {
    result.errors.push('All rows were duplicates of existing locations.');
  }

  registry.entries = pool;
  const saved = saveRegistry(registry);
  if (!saved.ok) {
    result.errors.push('Storage full — free space or export then remove some locations.');
    return { ...result, ok: false };
  }
  return { ...result, ok: true };
}

function importFromFile(registry, text, filename, mode) {
  const lower = (filename || '').toLowerCase();
  const parsed = lower.endsWith('.csv')
    ? importFromCsv(text)
    : importFromJson(text);

  if (!parsed.entries.length && parsed.errors.length) {
    return { ok: false, ...parsed, added: 0, duplicates: 0, skippedLimit: 0 };
  }

  const applied = applyImport(registry, parsed.entries, mode);
  return {
    ...applied,
    parseErrors: parsed.errors,
  };
}

window.SwissTaxRegistry = {
  STORAGE_KEY,
  MAX_LOCATIONS,
  loadRegistry,
  saveRegistry,
  addEntry,
  removeEntry,
  clearAllEntries,
  groupByGemeinde,
  filterEntries,
  isDuplicate,
  getCapacity,
  normalizeEntry,
  exportCsv,
  exportJson,
  downloadCsv,
  downloadJson,
  importFromFile,
  applyImport,
};
