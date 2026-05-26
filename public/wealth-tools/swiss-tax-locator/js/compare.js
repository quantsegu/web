/* Gemeinde comparison modal */

const NUMERIC_ROWS = [
  { key: 'total_pct', label: 'Total tax %', fmt: (v) => `${v.toFixed(2)}%`, lowerBetter: true },
  { key: 'total_chf', label: 'Total tax CHF', fmt: (v) => v.toLocaleString('de-CH'), lowerBetter: true },
  { key: 'federal', label: 'Federal', fmt: (v) => v.toLocaleString('de-CH'), lowerBetter: true },
  { key: 'cantonal', label: 'Cantonal', fmt: (v) => v.toLocaleString('de-CH'), lowerBetter: true },
  { key: 'communal', label: 'Communal', fmt: (v) => v.toLocaleString('de-CH'), lowerBetter: true },
  { key: 'church', label: 'Church', fmt: (v) => v.toLocaleString('de-CH'), lowerBetter: true },
  { key: 'personal', label: 'Personal', fmt: (v) => v.toLocaleString('de-CH'), lowerBetter: true },
];

function renderCompareTable(groups, taxData, rankNational) {
  const cols = groups.slice(0, 4);
  if (cols.length < 2) return null;

  const rows = [
    { label: 'Gemeinde', values: cols.map((g) => g.gemeinde) },
    { label: 'Canton', values: cols.map((g) => g.canton) },
    ...NUMERIC_ROWS.map((def) => ({
      label: def.label,
      values: cols.map((g) => g.entries[0][def.key] ?? g[def.key]),
      def,
    })),
    {
      label: 'Rank in CH',
      values: cols.map((g) => {
        const sfo = g.sfo_id;
        const row = taxData.find((r) => r.sfo_id === sfo);
        return row ? `#${rankNational(row, taxData)}` : '—';
      }),
    },
  ];

  return { cols, rows };
}

function highlightCells(tableEl, rows) {
  const trs = tableEl.querySelectorAll('tbody tr');
  rows.forEach((row, ri) => {
    if (!row.def) return;
    const vals = row.values.map(Number);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const tr = trs[ri];
    if (!tr) return;
    [...tr.children].slice(1).forEach((td, i) => {
      const v = vals[i];
      td.classList.remove('low', 'high');
      if (v === min && min !== max) td.classList.add('low');
      if (v === max && min !== max) td.classList.add('high');
    });
  });
}

window.SwissTaxCompare = {
  NUMERIC_ROWS,
  renderCompareTable,
  highlightCells,
};
