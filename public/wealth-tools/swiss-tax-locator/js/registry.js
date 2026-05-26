/* localStorage registry CRUD + grouped UI */

const STORAGE_KEY = 'swissTaxRegistry';

function loadRegistry() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, entries: [] };
    const data = JSON.parse(raw);
    return data.version ? data : { version: 1, entries: data.entries || [] };
  } catch {
    return { version: 1, entries: [] };
  }
}

function saveRegistry(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, entries: data.entries }));
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

function isDuplicate(entries, address) {
  const key = normalizeAddressKey(address);
  return entries.some((e) => normalizeAddressKey(e.address) === key);
}

function addEntry(registry, entry) {
  if (isDuplicate(registry.entries, entry.address)) {
    return { ok: false, reason: 'duplicate' };
  }
  const full = { id: uuid(), added_at: new Date().toISOString(), ...entry };
  registry.entries.push(full);
  saveRegistry(registry);
  return { ok: true, entry: full };
}

function removeEntry(registry, id) {
  registry.entries = registry.entries.filter((e) => e.id !== id);
  saveRegistry(registry);
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

function exportCsv(entries) {
  const header = 'Address,Gemeinde,Canton,Tax %,Tax CHF,Federal,Cantonal,Communal,Church,Personal,Lat,Lon,Added';
  const rows = entries.map((e) => [
    `"${String(e.address).replace(/"/g, '""')}"`,
    `"${e.gemeinde}"`,
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
    e.added_at,
  ].join(','));
  return [header, ...rows].join('\n');
}

function downloadCsv(entries, filename = 'swiss-tax-registry.csv') {
  const blob = new Blob([exportCsv(entries)], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

window.SwissTaxRegistry = {
  STORAGE_KEY,
  loadRegistry,
  saveRegistry,
  addEntry,
  removeEntry,
  groupByGemeinde,
  isDuplicate,
  exportCsv,
  downloadCsv,
};
