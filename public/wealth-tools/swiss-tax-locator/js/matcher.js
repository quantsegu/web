/* Gemeinde fuzzy matching against TAX_DATA */

const CANTON_FROM_STATE = {
  'aargau': 'AG', 'appenzell ausserrhoden': 'AR', 'appenzell innerrhoden': 'AI',
  'basel-landschaft': 'BL', 'basel-stadt': 'BS', 'bern': 'BE', 'berne': 'BE',
  'fribourg': 'FR', 'freiburg': 'FR', 'geneva': 'GE', 'genève': 'GE', 'geneve': 'GE',
  'glarus': 'GL', 'graubünden': 'GR', 'graubunden': 'GR', 'grisons': 'GR',
  'jura': 'JU', 'lucerne': 'LU', 'luzern': 'LU', 'neuchâtel': 'NE', 'neuchatel': 'NE',
  'nidwalden': 'NW', 'obwalden': 'OW', 'schaffhausen': 'SH', 'schwyz': 'SZ',
  'solothurn': 'SO', 'st. gallen': 'SG', 'st gallen': 'SG', 'sankt gallen': 'SG',
  'thurgau': 'TG', 'ticino': 'TI', 'tessin': 'TI', 'uri': 'UR', 'valais': 'VS',
  'vaud': 'VD', 'waadt': 'VD', 'zug': 'ZG', 'zürich': 'ZH', 'zurich': 'ZH',
  'zuerich': 'ZH',
};

function normalizeName(s) {
  if (!s) return '';
  let t = String(s).toLowerCase().trim();
  t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  t = t.replace(/\bst\.\b/g, 'sankt').replace(/\bkt\.\b/g, 'kanton');
  t = t.replace(/\(zh\)/g, '').replace(/\(be\)/g, '').replace(/\(bl\)/g, '');
  t = t.replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  const aliases = {
    zurich: 'zurich', geneva: 'geneve', berne: 'bern', biel: 'bienne',
  };
  return aliases[t] || t;
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function parseCantonFromState(state) {
  if (!state) return null;
  const raw = state.replace(/^kanton\s+/i, '').trim().toLowerCase();
  if (CANTON_FROM_STATE[raw]) return CANTON_FROM_STATE[raw];
  const two = state.match(/\b([A-Z]{2})\b/);
  if (two) return two[1];
  return null;
}

function buildTaxIndex(taxData) {
  const bySfo = new Map();
  const byKey = new Map();
  for (const row of taxData) {
    bySfo.set(row.sfo_id, row);
    const key = `${row.canton}|${normalizeName(row.commune)}`;
    byKey.set(key, row);
  }
  return { bySfo, byKey, list: taxData };
}

function matchGemeinde(name, cantonHint, index) {
  const norm = normalizeName(name);
  if (!norm) return { row: null, confidence: 0, method: 'none' };

  let pool = index.list;
  if (cantonHint) {
    const filtered = pool.filter((r) => r.canton === cantonHint);
    if (filtered.length) pool = filtered;
  }

  const exact = pool.find((r) => normalizeName(r.commune) === norm);
  if (exact) return { row: exact, confidence: 1, method: 'exact' };

  let best = null;
  let bestDist = Infinity;
  for (const r of pool) {
    const d = levenshtein(norm, normalizeName(r.commune));
    if (d < bestDist) {
      bestDist = d;
      best = r;
    }
  }
  if (!best) return { row: null, confidence: 0, method: 'none' };

  const maxLen = Math.max(norm.length, normalizeName(best.commune).length, 1);
  const confidence = 1 - bestDist / maxLen;
  return {
    row: best,
    confidence: Math.max(0, Math.min(1, confidence)),
    method: bestDist <= 2 ? 'fuzzy-close' : 'fuzzy',
    distance: bestDist,
  };
}

function findBySfoId(sfoId, index) {
  return index.bySfo.get(Number(sfoId)) || null;
}

function computeStats(taxData) {
  const pcts = taxData.map((r) => r.total_pct);
  const nationalAvg = pcts.reduce((a, b) => a + b, 0) / pcts.length;
  const minRow = taxData.reduce((a, b) => (a.total_pct < b.total_pct ? a : b));
  const maxRow = taxData.reduce((a, b) => (a.total_pct > b.total_pct ? a : b));

  const byCanton = {};
  for (const r of taxData) {
    if (!byCanton[r.canton]) byCanton[r.canton] = [];
    byCanton[r.canton].push(r.total_pct);
  }
  const cantonAvgs = Object.entries(byCanton).map(([canton, arr]) => ({
    canton,
    avg: arr.reduce((a, b) => a + b, 0) / arr.length,
    count: arr.length,
  })).sort((a, b) => a.avg - b.avg);

  return { nationalAvg, minRow, maxRow, cantonAvgs, minPct: minRow.total_pct, maxPct: maxRow.total_pct };
}

function rankInCanton(row, taxData) {
  const same = taxData.filter((r) => r.canton === row.canton).sort((a, b) => a.total_pct - b.total_pct);
  const idx = same.findIndex((r) => r.sfo_id === row.sfo_id);
  return { rank: idx + 1, total: same.length, cantonAvg: same.reduce((s, r) => s + r.total_pct, 0) / same.length };
}

function rankNational(row, taxData) {
  const sorted = [...taxData].sort((a, b) => a.total_pct - b.total_pct);
  const idx = sorted.findIndex((r) => r.sfo_id === row.sfo_id);
  return idx + 1;
}

window.SwissTaxMatcher = {
  normalizeName,
  levenshtein,
  parseCantonFromState,
  buildTaxIndex,
  matchGemeinde,
  findBySfoId,
  computeStats,
  rankInCanton,
  rankNational,
};
