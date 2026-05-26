/* Wealth & corporate tax estimates per Gemeinde (by SFO id) */

function getFortuneBase() {
  const el = document.getElementById('fortune-amount');
  const v = el ? Number(el.value) : 500000;
  return Number.isFinite(v) && v > 0 ? v : 500000;
}

function getAuxTax(sfoId) {
  if (typeof AUX_TAX_BY_SFO === 'undefined') return null;
  return AUX_TAX_BY_SFO[String(sfoId)] || null;
}

function scaleWealthChf(aux, fortuneBase) {
  if (!aux) return null;
  const base = typeof FORTUNE_BASE_CHF !== 'undefined' ? FORTUNE_BASE_CHF : 500000;
  return Math.round(aux.wealth_chf_500k * (fortuneBase / base));
}

function getTaxProfile(row, fortuneBase) {
  const aux = getAuxTax(row.sfo_id);
  const wealthChf = scaleWealthChf(aux, fortuneBase);
  return {
    income_pct: row.total_pct,
    income_chf: row.total_chf,
    wealth_chf: wealthChf,
    wealth_pct: wealthChf != null ? (wealthChf / fortuneBase) * 100 : null,
    corp_pct: aux ? aux.corp_pct : null,
    fortune_base: fortuneBase,
  };
}

window.SwissTaxProfile = {
  getFortuneBase,
  getAuxTax,
  scaleWealthChf,
  getTaxProfile,
};
