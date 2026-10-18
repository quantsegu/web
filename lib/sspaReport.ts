/**
 * Data re-plotted from the SSPA "Swiss Structured Product Industry Report Q2 2026" (August 2026, data as of 30 June 2026).
 * The report authorises reprints and quotes with attribution. Only figures that could be read unambiguously are included;
 * every breakdown is sum-checked in `SSPA_REPORT_CHECKS`.
 */
export const SSPA_REPORT_SOURCE =
  'SSPA, Swiss Structured Product Industry Report Q2 2026 (Aug 2026; data collected by BCG from SSPA member institutes)';
export const SSPA_REPORT_URL =
  'https://sspa.ch/wp-content/uploads/2026/08/sspa_swiss_structured_product_industry_report_q2_2026_en.pdf';
export const SSPA_MAP_URL = 'https://sspa.ch/wp-content/uploads/2026/01/en_sspaswissmap_2026.pdf';
export const SSPA_SITE_URL = 'https://sspa.ch/en/products/';

export const QUARTERS = ['Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26'] as const;

/** Total turnover, CHF bn */
export const TURNOVER_TOTAL = [56.5, 53.3, 62.7, 78.9, 67.2];

/** Turnover by product group, CHF bn, same quarter order. "Other" is derived (total − listed groups). */
export const TURNOVER_BY_GROUP = {
  'capital-protection': [7.0, 6.0, 8.0, 6.3, 5.9],
  'yield-enhancement': [27.3, 29.7, 30.6, 36.2, 33.5],
  participation: [5.0, 3.9, 4.8, 7.1, 5.4],
  leverage: [14.7, 11.6, 17.0, 25.7, 20.7],
  'credit-risk': [0.3, 0.2, 0.3, 0.3, 0.3],
} as const;

export const TURNOVER_OTHER = TURNOVER_TOTAL.map((t, i) =>
  Math.max(
    0,
    +(t - Object.values(TURNOVER_BY_GROUP).reduce((s, v) => s + v[i], 0)).toFixed(1),
  ),
);

/** Q2 2026 monthly turnover, CHF bn */
export const MONTHLY_Q2_2026 = [
  { label: 'April', value: 22 },
  { label: 'May', value: 20 },
  { label: 'June', value: 25 },
];

/** Q2 2026 breakdowns, CHF bn */
export const ASSET_CLASS_Q2_2026 = [
  { label: 'Equity', value: 35.7 },
  { label: 'Foreign exchange', value: 19.9 },
  { label: 'Fixed income / credit', value: 7.6 },
  { label: 'Commodity', value: 2.1 },
  { label: 'Other', value: 1.9 },
];
export const CURRENCY_Q2_2026 = [
  { label: 'EUR', value: 25.4 },
  { label: 'USD', value: 25.0 },
  { label: 'Other (AUD, CAD, GBP, JPY …)', value: 9.4 },
  { label: 'CHF', value: 7.4 },
];
export const TRADE_TYPE_Q2_2026 = [
  { label: 'Non-listed', value: 45.2 },
  { label: 'Listed', value: 22.0 },
];
export const MARKET_Q2_2026 = [
  { label: 'Primary market', value: 41.3 },
  { label: 'Secondary market', value: 25.9 },
];

/** Product-type turnover in Q2 2026, CHF bn, keyed by SSPA group id */
export const PRODUCT_TYPE_Q2_2026: Record<string, { code: string; label: string; value: number }[]> = {
  'capital-protection': [
    { code: '1100', label: 'Participation', value: 0.3 },
    { code: '1130', label: 'Barrier', value: 0.1 },
    { code: '1135', label: 'Twin-Win', value: 0.0 },
    { code: '1140', label: 'Coupon', value: 5.5 },
  ],
  'yield-enhancement': [
    { code: '1200', label: 'Discount certificate', value: 6.2 },
    { code: '1210', label: 'Barrier discount', value: 0.0 },
    { code: '1220', label: 'Reverse convertible', value: 19.0 },
    { code: '1230', label: 'Barrier reverse convertible', value: 5.4 },
    { code: '1255', label: 'Conditional coupon RC', value: 0.6 },
    { code: '1260', label: 'Conditional coupon barrier RC', value: 2.3 },
  ],
  participation: [
    { code: '1300', label: 'Tracker', value: 4.9 },
    { code: '1310', label: 'Outperformance', value: 0.1 },
    { code: '1320', label: 'Bonus', value: 0.3 },
    { code: '1330', label: 'Bonus outperformance', value: 0.0 },
    { code: '1340', label: 'Twin-Win', value: 0.0 },
  ],
  leverage: [
    { code: '2100', label: 'Warrant', value: 4.5 },
    { code: '2110', label: 'Spread warrant', value: 0.6 },
    { code: '2200', label: 'Warrant with knock-out', value: 11.6 },
    { code: '2210', label: 'Mini-future', value: 2.9 },
    { code: '2300', label: 'Constant leverage certificate', value: 1.1 },
  ],
  'credit-risk': [
    { code: '1400', label: 'Credit-linked note', value: 0.08 },
    { code: '1410', label: 'Conditional capital protection, credit risk', value: 0.19 },
    { code: '1420', label: 'Yield enhancement, credit risk', value: 0.02 },
    { code: '1430', label: 'Participation, credit risk', value: 0.03 },
  ],
};

/** Group-level headline facts stated in the report's executive summary (Q2 2026). */
export const GROUP_FACTS_Q2_2026: Record<
  string,
  { turnover: number; share: string; assetClass: string; assetShare: string; currency: string; currencyShare: string; listed: string; market: string }
> = {
  'yield-enhancement': { turnover: 33.5, share: '50%', assetClass: 'Foreign exchange', assetShare: '51%', currency: 'USD', currencyShare: '43%', listed: '9% listed', market: '93% primary' },
  leverage: { turnover: 20.7, share: '31%', assetClass: 'Equity', assetShare: '68%', currency: 'EUR', currencyShare: '75%', listed: '79% listed', market: '90% secondary' },
  'capital-protection': { turnover: 5.9, share: '9%', assetClass: 'Fixed income', assetShare: '88%', currency: 'USD', currencyShare: '62%', listed: '3% listed', market: '93% primary' },
  participation: { turnover: 5.4, share: '8%', assetClass: 'Equity', assetShare: '70%', currency: 'USD', currencyShare: '59%', listed: '41% listed', market: '77% secondary' },
};

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Sum checks against the published totals (tolerance covers the report's rounding). */
export const SSPA_REPORT_CHECKS = (() => {
  const checks: { name: string; got: number; want: number; ok: boolean }[] = [];
  const add = (name: string, got: number, want: number, tol = 0.15) =>
    checks.push({ name, got: +got.toFixed(2), want, ok: Math.abs(got - want) <= tol });

  add('asset class = total Q2 26', sum(ASSET_CLASS_Q2_2026.map((x) => x.value)), 67.2);
  add('currency = total Q2 26', sum(CURRENCY_Q2_2026.map((x) => x.value)), 67.2);
  add('trade type = total Q2 26', sum(TRADE_TYPE_Q2_2026.map((x) => x.value)), 67.2);
  add('market = total Q2 26', sum(MARKET_Q2_2026.map((x) => x.value)), 67.2);
  add('months = quarter', sum(MONTHLY_Q2_2026.map((x) => x.value)), 67.2, 1);
  add('capital protection types', sum(PRODUCT_TYPE_Q2_2026['capital-protection'].map((x) => x.value)), 5.9);
  add('yield enhancement types', sum(PRODUCT_TYPE_Q2_2026['yield-enhancement'].map((x) => x.value)), 33.5);
  add('participation types', sum(PRODUCT_TYPE_Q2_2026.participation.map((x) => x.value)), 5.4);
  add('leverage types', sum(PRODUCT_TYPE_Q2_2026.leverage.map((x) => x.value)), 20.7);
  add('credit-risk types', sum(PRODUCT_TYPE_Q2_2026['credit-risk'].map((x) => x.value)), 0.3);
  add('Q2 26 groups + other = total', sum(Object.values(TURNOVER_BY_GROUP).map((v) => v[4])) + TURNOVER_OTHER[4], 67.2);
  add('Q2 26 other matches report (1.4)', TURNOVER_OTHER[4], 1.4, 0.05);
  return checks;
})();
