import { blackScholes, bondPrice, fmt, pct, type WorkedExample } from './pricingMath';
import type { PayoffMark } from '../components/investment-universe/charts/PayoffChart';

/**
 * SSPA product families and product types (codes follow the SSPA Swiss Derivative Map, edition January 2026).
 * Descriptions are paraphrased; payoff diagrams are drawn from the formulas below with hypothetical parameters.
 */

export type SspaGroupId = 'capital-protection' | 'yield-enhancement' | 'participation' | 'leverage' | 'credit-risk';

export interface SspaProduct {
  code: string;
  name: string;
  expectation: string;
  keyTraits: string[];
  builtFrom: string;
  priceDrivers: string;
  payoff?: {
    fn: (x: number) => number;
    yDomain: [number, number];
    yLabel: string;
    marks: PayoffMark[];
    params: string;
    showDirect?: boolean;
    pathDependent?: boolean;
  };
}

export interface SspaValuationStrategy {
  name: string;
  how: string;
  watchOut: string;
}

export interface SspaGroup {
  id: SspaGroupId;
  mapCode: string;
  name: string;
  tagline: string;
  overview: string;
  buildingBlocks: string;
  products: SspaProduct[];
  pricing: { title: string; body: string }[];
  strategies: SspaValuationStrategy[];
  redFlags: string[];
  example?: () => WorkedExample;
}

const clampMin = (v: number, floor: number) => (v < floor ? floor : v);
const M100: PayoffMark = { x: 100, label: 'strike' };

/* ---------- worked examples (hypothetical inputs, computed here) ---------- */

function capitalProtectionExample(): WorkedExample {
  const nominal = 100;
  const years = 5;
  const rf = 0.02;
  const spread = 0.008;
  const fee = 0.01;
  const vol = 0.2;
  const q = 0.02;
  const floor = nominal / (1 + rf + spread) ** years;
  const optionBudget = nominal * (1 - fee) - floor;
  const call = blackScholes(100, 100, years, rf, q, vol).call;
  const participation = optionBudget / call;
  return {
    title: 'How a 100%-protected note is priced',
    intro: 'The issuer splits the issue price into a bond floor and an option budget. What is left after the floor and fees buys call options, which sets the participation rate.',
    inputs: [
      { label: 'Nominal / protection', value: '100 / 100%' },
      { label: 'Maturity', value: `${years} years` },
      { label: 'Risk-free rate + issuer credit spread', value: `${pct(rf)} + ${pct(spread)}` },
      { label: 'Embedded fees (assumed)', value: pct(fee) },
      { label: 'Underlying vol / dividend yield', value: `${pct(vol, 0)} / ${pct(q, 0)}` },
    ],
    steps: [
      { label: 'Bond floor = 100 discounted at rate + spread', value: fmt(floor) },
      { label: 'Option budget = 100 − fees − floor', value: fmt(optionBudget) },
      { label: 'At-the-money 5y call (Black–Scholes)', value: fmt(call) },
    ],
    result: { label: 'Participation rate = budget ÷ call price', value: pct(participation, 0) },
    note: 'Hypothetical inputs. A wider issuer spread lowers the floor and lifts the participation; a higher volatility makes the call dearer and cuts it. Before maturity the note trades on the same model, so it can sit below the protection level.',
  };
}

function yieldEnhancementExample(): WorkedExample {
  const rf = 0.02;
  const spread = 0.007;
  const fee = 0.01;
  const vol = 0.25;
  const q = 0.02;
  const T = 1;
  const put = blackScholes(100, 100, T, rf, q, vol).put;
  const df = 1 / (1 + rf + spread) ** T;
  const coupon = (100 * (1 - fee) + put) / df - 100;
  const lowVol = blackScholes(100, 100, T, rf, q, 0.15).put;
  const couponLow = (100 * (1 - fee) + lowVol) / df - 100;
  return {
    title: 'Where a reverse-convertible coupon comes from',
    intro: 'The investor lends 100 and sells a put on the underlying. The coupon is the bond yield plus the put premium, paid out over the life of the note.',
    inputs: [
      { label: 'Maturity', value: `${T} year` },
      { label: 'Risk-free rate + issuer credit spread', value: `${pct(rf)} + ${pct(spread)}` },
      { label: 'Embedded fees (assumed)', value: pct(fee) },
      { label: 'Underlying vol / dividend yield', value: `${pct(vol, 0)} / ${pct(q, 0)}` },
    ],
    steps: [
      { label: 'At-the-money 1y put sold (Black–Scholes)', value: fmt(put) },
      { label: 'Discount factor at rate + spread', value: fmt(df, 4) },
      { label: 'Coupon = (100 − fees + put) ÷ DF − 100', value: pct(coupon / 100) },
    ],
    result: { label: 'Coupon at 25% volatility', value: pct(coupon / 100) },
    note: `Same note on a 15% volatility underlying pays about ${pct(couponLow / 100)}. A high coupon is not a bonus: it is the market price of the downside you are agreeing to take.`,
  };
}

function leverageExample(): WorkedExample {
  const S = 100;
  const K = 105;
  const T = 0.5;
  const r = 0.02;
  const q = 0.02;
  const vol = 0.25;
  const bs = blackScholes(S, K, T, r, q, vol);
  const later = blackScholes(S, K, T - 1 / 12, r, q, vol).call;
  const gearing = S / bs.call;
  const omega = (bs.deltaCall * S) / bs.call;
  return {
    title: 'Pricing a call warrant and reading its leverage',
    intro: 'A warrant is a bought option. Its price is mostly time value, so it decays even when the underlying does not move.',
    inputs: [
      { label: 'Underlying / strike', value: `${S} / ${K}` },
      { label: 'Maturity', value: `${T * 12} months` },
      { label: 'Rate / dividend yield', value: `${pct(r)} / ${pct(q)}` },
      { label: 'Implied volatility', value: pct(vol, 0) },
    ],
    steps: [
      { label: 'Warrant price (Black–Scholes, 1:1 ratio)', value: fmt(bs.call) },
      { label: 'Gearing = underlying ÷ warrant price', value: `${fmt(gearing, 1)}x` },
      { label: 'Delta', value: fmt(bs.deltaCall, 2) },
      { label: 'Effective leverage (omega) = delta × gearing', value: `${fmt(omega, 1)}x` },
    ],
    result: { label: 'Price one month later, underlying unchanged', value: `${fmt(later)} (${pct(later / bs.call - 1, 0)})` },
    note: 'Hypothetical inputs. Omega is the % move in the warrant for a 1% move in the underlying. Time decay accelerates as expiry approaches, and a volatility drop hurts a long option.',
  };
}

function creditExample(): WorkedExample {
  const rf = 0.02;
  const spread = 0.025;
  const years = 3;
  const coupon = rf + spread;
  const price = bondPrice(coupon, rf + spread, years);
  const riskFreePrice = bondPrice(coupon, rf, years);
  return {
    title: 'What the extra credit spread is worth',
    intro: 'A credit-linked note pays a higher coupon because the investor also takes the default risk of a reference entity. Valuing it means discounting at the risk-free rate plus the reference spread.',
    inputs: [
      { label: 'Maturity', value: `${years} years, annual coupon` },
      { label: 'Risk-free rate', value: pct(rf) },
      { label: 'Reference-entity credit spread', value: pct(spread) },
      { label: 'Coupon (set at par)', value: pct(coupon) },
    ],
    steps: [
      { label: 'Value if discounted at risk-free rate only', value: fmt(riskFreePrice) },
      { label: 'Value discounted at rate + spread', value: fmt(price) },
    ],
    result: { label: 'Credit compensation embedded in the coupon', value: `${fmt(riskFreePrice - price)} points per 100` },
    note: 'Hypothetical inputs. If spreads widen the note falls even when no default occurs; if a credit event happens, redemption is based on the recovery value, not par. The issuer risk sits on top.',
  };
}

/* ---------- the families ---------- */

const COMMON_PRICING = {
  title: 'Issue price vs fair value',
  body: 'The issue price is not the model value. It includes structuring and distribution costs, so the fair value at launch is usually a little under 100. The European key information document (KID) shows this as a reduction-in-yield cost, which makes products comparable.',
};
const COMMON_ISSUER = {
  title: 'Issuer credit counts twice',
  body: 'A structured product is an issuer debt obligation. A wider issuer credit spread cuts the value of the bond leg, and a default of the issuer can mean loss beyond the market risk. Collateralised (COSI) products reduce this.',
};
const COMMON_SECONDARY = {
  title: 'Secondary pricing',
  body: 'Listed products trade on SIX with the issuer as market maker, quoted as a bid and an ask. The spread is wider for illiquid underlyings, long maturities and stressed markets. Bond-like products can quote in % of nominal or on a clean basis with accrued interest added.',
};

export const SSPA_GROUPS: Record<SspaGroupId, SspaGroup> = {
  'capital-protection': {
    id: 'capital-protection',
    mapCode: '11',
    name: 'Capital protection',
    tagline: 'Bond floor plus an option on the upside',
    overview:
      'These products promise a minimum redemption at maturity, expressed as a share of the nominal. The SSPA map counts a product as capital protected only when that floor is at least 90% of the nominal. The promise covers the nominal, not necessarily what you paid, and only at maturity: the market value can sit below the floor on the way.',
    buildingBlocks: 'Zero-coupon bond (the floor) + call option, or a call-spread, barrier or coupon structure on top.',
    products: [
      {
        code: '1100',
        name: 'Capital protection with participation',
        expectation: 'Rising underlying; rising volatility helps after issue',
        keyTraits: ['Floor at the protected % of nominal', 'Gains above the strike are shared at the participation rate', 'Coupon can be added in some versions'],
        builtFrom: 'Zero-coupon bond + at-the-money call',
        priceDrivers: 'Interest rates, issuer credit spread, volatility, dividends, remaining maturity',
        payoff: { fn: (x) => 100 + 0.8 * clampMin(x - 100, 0), yDomain: [60, 160], yLabel: 'Redemption', marks: [M100], params: '100% protection, 80% participation' },
      },
      {
        code: '1130',
        name: 'Capital protection with barrier',
        expectation: 'Rising underlying that does not breach the upper barrier',
        keyTraits: ['Higher participation than 1100 because the upside is capped by a knock-out barrier', 'Redemption falls back to the floor (plus any rebate) if the barrier is touched', 'Profit potential is limited'],
        builtFrom: 'Zero-coupon bond + up-and-out call',
        priceDrivers: 'Barrier distance, volatility skew, rates, issuer spread',
        payoff: { fn: (x) => (x >= 135 ? 103 : 100 + clampMin(x - 100, 0)), yDomain: [60, 160], yLabel: 'Redemption', marks: [M100, { x: 135, label: 'barrier' }], params: '100% protection, 100% participation up to a 135 barrier, 3 rebate', pathDependent: true },
      },
      {
        code: '1135',
        name: 'Capital protection with Twin-Win',
        expectation: 'Large moves in either direction, as long as neither barrier is touched',
        keyTraits: ['Gains from rises and from falls down to a lower barrier', 'Floor applies if a barrier is touched', 'Profit potential is limited'],
        builtFrom: 'Zero-coupon bond + up-and-out call + down-and-out put',
        priceDrivers: 'Both barrier distances, volatility, rates',
        payoff: { fn: (x) => (x > 130 || x < 70 ? 100 : 100 + Math.abs(x - 100)), yDomain: [60, 160], yLabel: 'Redemption', marks: [M100, { x: 70, label: 'low barrier' }, { x: 130, label: 'high barrier' }], params: '100% protection, barriers at 70 and 130', pathDependent: true },
      },
      {
        code: '1140',
        name: 'Capital protection with coupon',
        expectation: 'Rising underlying; sharp falls possible',
        keyTraits: ['Floor at maturity', 'Coupon depends on the underlying and is capped', 'Periodic coupon payments are expected'],
        builtFrom: 'Zero-coupon bond + series of capped options, or a plain bond with performance-linked coupons',
        priceDrivers: 'Rates, issuer spread, volatility, coupon formula',
        payoff: { fn: (x) => 100 + Math.min(clampMin(x - 100, 0) * 0.5, 12), yDomain: [60, 160], yLabel: 'Redemption (incl. coupons)', marks: [M100], params: 'Coupons total 50% of the gain, capped at 12' },
      },
    ],
    pricing: [
      COMMON_PRICING,
      { title: 'Bond floor sets the option budget', body: 'High interest rates and a wide issuer spread shrink the cost of the floor, leaving more for options. In low-rate periods the same protection leaves little budget, which is why participation rates and caps change so much with the rate cycle.' },
      COMMON_ISSUER,
      COMMON_SECONDARY,
    ],
    strategies: [
      { name: 'Replicate and compare', how: 'Price the bond floor and the option legs separately with market inputs, add them up, and compare with the quoted price.', watchOut: 'You need the issuer curve and a volatility input. Small input changes move the margin estimate.' },
      { name: 'Fair-value vs break-even', how: 'Compute the underlying return needed at maturity for the note to beat a plain bond of the same issuer and maturity.', watchOut: 'Compare with the same issuer credit; a plain government bond is a different risk.' },
      { name: 'Scenario table', how: 'List redemption at maturity for falls, flat and rises, including the barrier cases for 1130 and 1135.', watchOut: 'Barrier products are path dependent; the end value alone does not tell you if a barrier was touched.' },
      { name: 'Mark-to-market monitoring', how: 'Track the clean price against the floor over time. The gap shows how much the floor is being discounted for time and issuer risk.', watchOut: 'A price below the floor before maturity is normal, not a loss until you sell.' },
    ],
    redFlags: ['Protection quoted on the purchase price instead of the nominal', 'Floor below 90%, which the SSPA map does not treat as capital protection', 'Participation that looks high but sits on a very capped or barrier-based structure', 'Long maturity with a weak issuer'],
    example: capitalProtectionExample,
  },

  'yield-enhancement': {
    id: 'yield-enhancement',
    mapCode: '12',
    name: 'Yield enhancement',
    tagline: 'A bond plus a sold option: you are paid to take downside',
    overview:
      'Yield enhancement products give up some upside to improve the return when the market moves sideways or rises slightly. They are the largest family by turnover. The extra return is not free: the investor typically sells a put or a call, so a large fall in the underlying turns into a loss, and a cap stops the gains.',
    buildingBlocks: 'Bond (or cash) + sold put (reverse convertibles) or long underlying + sold call (discount certificates), with barrier or conditional-coupon features.',
    products: [
      {
        code: '1200',
        name: 'Discount certificate',
        expectation: 'Sideways or slightly rising; falling volatility',
        keyTraits: ['Bought at a discount to the underlying', 'Maximum redemption is capped', 'Delivery of the underlying or cash if below the strike at maturity', 'Worst-of baskets increase the discount and the risk'],
        builtFrom: 'Underlying − call at the cap',
        priceDrivers: 'Underlying price, volatility, dividends, maturity',
        payoff: { fn: (x) => Math.min(x, 100), yDomain: [40, 120], yLabel: 'Redemption', marks: [M100], params: 'Cap at 100, bought at about 90', showDirect: true },
      },
      {
        code: '1210',
        name: 'Barrier discount certificate',
        expectation: 'Sideways or slightly rising; barrier not breached',
        keyTraits: ['Maximum redemption paid unless the barrier is touched', 'Lower discount than 1200 for the same terms', 'Turns into a plain discount certificate if the barrier is touched'],
        builtFrom: 'Underlying − down-and-in-protected call structure',
        priceDrivers: 'Barrier level, volatility, skew',
        payoff: { fn: (x) => (x >= 70 ? 100 : x), yDomain: [40, 120], yLabel: 'Redemption', marks: [M100, { x: 70, label: 'barrier' }], params: 'Cap 100, barrier 70', showDirect: true, pathDependent: true },
      },
      {
        code: '1220',
        name: 'Reverse convertible',
        expectation: 'Sideways or slightly rising; falling volatility',
        keyTraits: ['Coupon is paid whatever the underlying does', 'Capped upside: at most nominal plus coupon', 'Below the strike at maturity: delivery of shares or cash, plus coupon'],
        builtFrom: 'Bond + sold at-the-money put',
        priceDrivers: 'Volatility (drives coupon), rates, issuer spread, dividends',
        payoff: { fn: (x) => Math.min(x, 100) + 8, yDomain: [40, 120], yLabel: 'Redemption incl. coupon', marks: [M100], params: 'Coupon 8, strike 100', showDirect: true },
      },
      {
        code: '1230',
        name: 'Barrier reverse convertible',
        expectation: 'Sideways or slightly rising; barrier not breached',
        keyTraits: ['Coupon paid regardless', 'Full nominal back unless the barrier was touched and the underlying ends below the strike', 'Coupon is lower than for 1220 at the same terms'],
        builtFrom: 'Bond + sold down-and-in put',
        priceDrivers: 'Barrier distance, volatility, skew',
        payoff: { fn: (x) => (x >= 70 ? 108 : x + 8), yDomain: [40, 120], yLabel: 'Redemption incl. coupon', marks: [M100, { x: 70, label: 'barrier' }], params: 'Coupon 8, barrier 70', showDirect: true, pathDependent: true },
      },
      {
        code: '1255',
        name: 'Conditional coupon reverse convertible',
        expectation: 'Sideways or slightly rising; falling volatility',
        keyTraits: ['Coupon only paid if a condition is met on an observation date', 'Often autocallable: early redemption if the underlying is above a trigger', 'Worst-of baskets make coupons richer and riskier'],
        builtFrom: 'Bond + sold put + digital (binary) coupon legs',
        priceDrivers: 'Volatility, correlation (worst-of), autocall trigger, barrier',
        payoff: { fn: (x) => Math.min(x, 100) + (x >= 70 ? 8 : 0), yDomain: [40, 120], yLabel: 'Redemption incl. coupon', marks: [M100, { x: 70, label: 'coupon level' }], params: 'Coupon 8 if the underlying is at 70 or above, no barrier on the capital', showDirect: true },
      },
      {
        code: '1260',
        name: 'Conditional coupon barrier reverse convertible',
        expectation: 'Sideways or slightly rising; barrier not breached',
        keyTraits: ['Conditional coupon plus a barrier on the capital', 'Usually autocallable', 'If the barrier is touched, underlying delivery or cash settlement'],
        builtFrom: 'Bond + sold down-and-in put + digital coupon legs',
        priceDrivers: 'Barrier, coupon level, correlation, skew, autocall trigger',
        payoff: { fn: (x) => (x >= 60 ? 100 + (x >= 70 ? 8 : 0) : x), yDomain: [40, 120], yLabel: 'Redemption incl. coupon', marks: [M100, { x: 60, label: 'capital barrier' }, { x: 70, label: 'coupon level' }], params: 'Coupon 8 above 70, capital barrier 60', showDirect: true, pathDependent: true },
      },
    ],
    pricing: [
      COMMON_PRICING,
      { title: 'The coupon is mostly option premium', body: 'Coupon ≈ bond yield + premium for the put you sold, spread over the term. High implied volatility, a worst-of basket, or a high barrier make the coupon larger because the downside you accept is larger.' },
      { title: 'Autocall and worst-of pricing', body: 'Autocallable and worst-of products depend on correlation between underlyings and on the volatility skew. Issuers price these with Monte Carlo or local-volatility models, so the investor cannot reproduce the price with a simple formula.' },
      COMMON_ISSUER,
      COMMON_SECONDARY,
    ],
    strategies: [
      { name: 'Coupon decomposition', how: 'Split the coupon into the risk-free part and the option-premium part. Compare the premium with the volatility of the underlying.', watchOut: 'A premium far above the underlying\'s historic volatility is a warning, not a gift.' },
      { name: 'Stress the strike and barrier', how: 'Check redemption if the underlying ends 10%, 30% and 50% below the strike, and whether the barrier is touched on the way.', watchOut: 'Barrier touches are path dependent; a small dip can reclassify the payoff.' },
      { name: 'Break-even vs holding the underlying', how: 'Find the fall at which the note stops beating a direct holding, once coupons are included.', watchOut: 'Coupons are taxed differently in some systems; compare after tax.' },
      { name: 'Worst-of correlation check', how: 'For baskets, test how the coupon changes if correlation drops. Lower correlation raises the odds that one name breaches.', watchOut: 'Correlation tends to rise in crashes, so the benign case understates joint downside.' },
      { name: 'Issuer credit review', how: 'Look at the issuer\'s CDS spread and rating, and use collateralised wrappers where available.', watchOut: 'The note\'s bond leg is unsecured unless it is collateralised.' },
    ],
    redFlags: ['Coupon far above bond yields with no clear reason', 'Worst-of basket of very different names', 'Barrier close to the current level', 'Autocall products sold as "capital protected"'],
    example: yieldEnhancementExample,
  },

  participation: {
    id: 'participation',
    mapCode: '13',
    name: 'Participation',
    tagline: 'Track the underlying, sometimes with a buffer or a boost',
    overview:
      'Participation products follow the underlying one-to-one or in a modified way: a boost above the strike, a minimum level held by a barrier, or gains from falls. There is no capital protection, so a falling underlying falls with the product. Trackers are the simplest and by far the largest in this family.',
    buildingBlocks: 'Long underlying (or a zero-strike call) + option layers for outperformance, bonus levels or twin-win features.',
    products: [
      {
        code: '1300',
        name: 'Tracker certificate',
        expectation: 'Rising underlying',
        keyTraits: ['Follows the underlying 1:1 after fees and conversion ratio', 'Underlying can be managed dynamically (actively managed certificates)', 'Trackers on non-tradable underlyings carry extra liquidity and market-access risk'],
        builtFrom: 'Long underlying (delta one)',
        priceDrivers: 'Underlying price, management fee, dividend treatment, currency',
        payoff: { fn: (x) => x, yDomain: [40, 160], yLabel: 'Redemption', marks: [M100], params: '1:1 participation, no fees shown' },
      },
      {
        code: '1310',
        name: 'Outperformance certificate',
        expectation: 'Rising underlying; rising volatility helps',
        keyTraits: ['Above the strike you gain at a rate over 100%', 'Below the strike you follow the underlying 1:1', 'Boost is paid for by giving up dividends or by a cap'],
        builtFrom: 'Long underlying + extra calls, financed by the dividends forgone',
        priceDrivers: 'Volatility, dividend yield, maturity',
        payoff: { fn: (x) => (x < 100 ? x : 100 + 1.5 * (x - 100)), yDomain: [40, 190], yLabel: 'Redemption', marks: [M100], params: '150% participation above the strike', showDirect: true },
      },
      {
        code: '1320',
        name: 'Bonus certificate',
        expectation: 'Sideways or rising; barrier not breached',
        keyTraits: ['Minimum redemption (the bonus level) if the barrier is never touched', 'If the barrier is touched it behaves like a tracker', 'Gains above the bonus level follow the underlying'],
        builtFrom: 'Long underlying + down-and-out put',
        priceDrivers: 'Barrier distance, volatility, dividends',
        payoff: { fn: (x) => (x >= 70 ? Math.max(x, 120) : x), yDomain: [40, 160], yLabel: 'Redemption', marks: [M100, { x: 70, label: 'barrier' }], params: 'Bonus level 120, barrier 70', showDirect: true, pathDependent: true },
      },
      {
        code: '1330',
        name: 'Bonus outperformance certificate',
        expectation: 'Rising underlying; barrier not breached',
        keyTraits: ['Bonus level protected by a barrier', 'Above the bonus it gains at a boosted rate', 'If the barrier is touched it behaves like an outperformance certificate'],
        builtFrom: 'Long underlying + down-and-out put + extra calls',
        priceDrivers: 'Barrier, volatility, dividend yield',
        payoff: { fn: (x) => (x >= 70 ? Math.max(120, 100 + 1.5 * (x - 100)) : x), yDomain: [40, 190], yLabel: 'Redemption', marks: [M100, { x: 70, label: 'barrier' }], params: 'Bonus 120, barrier 70, 150% above the strike', showDirect: true, pathDependent: true },
      },
      {
        code: '1340',
        name: 'Twin-Win certificate',
        expectation: 'Sideways or rising; barrier not breached',
        keyTraits: ['Profits from rises, and from falls down to the barrier', 'If the barrier is touched it behaves like a tracker', 'Minimum redemption equals the nominal if no barrier breach'],
        builtFrom: 'Long underlying + down-and-out put (twice the notional) ',
        priceDrivers: 'Barrier distance, volatility, dividends',
        payoff: { fn: (x) => (x < 60 ? x : x < 100 ? 200 - x : x), yDomain: [40, 160], yLabel: 'Redemption', marks: [M100, { x: 60, label: 'barrier' }], params: 'Barrier 60, falls convert into gains above it', showDirect: true, pathDependent: true },
      },
    ],
    pricing: [
      COMMON_PRICING,
      { title: 'Trackers: fees and dividends are the price', body: 'A plain tracker is close to its underlying. The cost sits in the management fee, the way dividends are treated (reinvested, paid out or kept by the issuer), and the bid-ask spread of the certificate.' },
      { title: 'Barrier layers are priced as options', body: 'Bonus and twin-win levels are bought with the dividends and with a barrier that you could lose. The closer the barrier to the current level, the lower the bonus a fair price can offer.' },
      COMMON_ISSUER,
      COMMON_SECONDARY,
    ],
    strategies: [
      { name: 'Net-of-fees comparison', how: 'Compare the tracker with a direct holding or ETF, after the management fee and the dividend treatment.', watchOut: 'Currency hedging and rolling costs can sit inside the tracker.' },
      { name: 'Bonus level probability check', how: 'Estimate how often the underlying has touched a level at the barrier distance over the product term, using a long price history.', watchOut: 'Historic frequency is not a forecast; volatility regimes change.' },
      { name: 'Option replication', how: 'Value the boost or bonus as a set of calls and barrier puts and compare with what the issuer shows.', watchOut: 'Skew matters most for barrier products.' },
      { name: 'Liquidity and underlying check', how: 'Confirm the underlying is tradable and priced daily. Non-tradable underlyings need a reference valuation process.', watchOut: 'Limited tradability can widen spreads and delay redemption.' },
    ],
    redFlags: ['Tracker on an opaque or non-tradable underlying', 'Fees hidden in the financing or roll', 'Bonus level very close to the current price', 'Active management without published rules'],
  },

  leverage: {
    id: 'leverage',
    mapCode: '20',
    name: 'Leverage',
    tagline: 'Small premium, magnified exposure, total-loss risk',
    overview:
      'Leverage products let an investor gain or lose a multiple of the underlying move for a small outlay. They are used for speculation or hedging. The maximum loss is the amount invested, but total loss is a real outcome, and many of these products need regular monitoring.',
    buildingBlocks: 'Options (warrants) or financed positions with a stop-loss level (knock-out, mini-future) or a daily-reset rule (constant leverage).',
    products: [
      {
        code: '2100',
        name: 'Warrant',
        expectation: 'Call: rising underlying and rising volatility. Put: falling underlying and rising volatility',
        keyTraits: ['Small investment, leveraged exposure', 'Loses time value every day', 'Total loss possible', 'Needs continuous monitoring'],
        builtFrom: 'Vanilla call or put option',
        priceDrivers: 'Underlying, implied volatility, time to expiry, rates, dividends',
        payoff: { fn: (x) => clampMin(x - 105, 0), yDomain: [0, 60], yLabel: 'Value at expiry', marks: [{ x: 105, label: 'strike' }], params: 'Call, strike 105 (premium not shown)' },
      },
      {
        code: '2110',
        name: 'Spread warrant',
        expectation: 'Bull: rising underlying. Bear: falling underlying',
        keyTraits: ['Leveraged within a fixed range', 'Profit is capped at the upper strike', 'Time value decays as expiry approaches'],
        builtFrom: 'Call spread (long call + short call at a higher strike)',
        priceDrivers: 'Both strikes, volatility, time to expiry',
        payoff: { fn: (x) => Math.min(clampMin(x - 100, 0), 20), yDomain: [0, 30], yLabel: 'Value at expiry', marks: [M100, { x: 120, label: 'cap' }], params: 'Bull spread 100 – 120' },
      },
      {
        code: '2200',
        name: 'Warrant with knock-out',
        expectation: 'Call: rising underlying. Put: falling underlying',
        keyTraits: ['Leveraged exposure at a low price', 'Expires worthless if the barrier is touched at any time', 'Low volatility and time-decay influence', 'Continuous monitoring required'],
        builtFrom: 'Barrier option (down-and-out call or up-and-out put)',
        priceDrivers: 'Distance to the knock-out barrier, underlying, financing level',
        payoff: { fn: (x) => clampMin(x - 100, 0), yDomain: [0, 60], yLabel: 'Value at expiry', marks: [M100, { x: 90, label: 'knock-out' }], params: 'Call, strike 100, knock-out at 90', pathDependent: true },
      },
      {
        code: '2210',
        name: 'Mini-future',
        expectation: 'Long: rising underlying. Short: falling underlying',
        keyTraits: ['Value follows the underlying above a financing level', 'A stop-loss event ends the product with a residual value', 'No volatility influence', 'Financing costs accrue daily'],
        builtFrom: 'Financed long position with a stop-loss',
        priceDrivers: 'Underlying, financing level (accrues funding cost), stop-loss distance',
        payoff: { fn: (x) => clampMin(x - 90, 0), yDomain: [0, 80], yLabel: 'Value', marks: [{ x: 90, label: 'financing level' }, { x: 95, label: 'stop-loss' }], params: 'Long, financing level 90, stop-loss 95', pathDependent: true },
      },
      {
        code: '2300',
        name: 'Constant leverage certificate',
        expectation: 'Long: rising underlying. Short: falling underlying',
        keyTraits: ['Leverage is reset on a regular basis to keep it constant', 'A stop-loss or adjustment rule keeps the value from going negative', 'Frequent direction changes hurt performance', 'Continuous monitoring required'],
        builtFrom: 'Daily-rebalanced financed position',
        priceDrivers: 'Underlying path (not just the end value), leverage factor, financing and rebalancing cost',
      },
    ],
    pricing: [
      COMMON_PRICING,
      { title: 'Warrants: price = intrinsic value + time value', body: 'Warrant prices come from an option model with implied volatility. A change in volatility or a day passing changes the price even if the underlying stands still. The issuer\'s quoted volatility can differ from the market\'s.' },
      { title: 'Knock-outs and mini-futures: financing level', body: 'These are priced as the underlying minus a financing level that moves each day with funding cost. The stop-loss premium covers the issuer\'s gap risk and is part of the price.' },
      COMMON_ISSUER,
      COMMON_SECONDARY,
    ],
    strategies: [
      { name: 'Effective leverage (omega)', how: 'Use delta × underlying ÷ product price to see the real % exposure, not the headline gearing.', watchOut: 'Leverage changes as the underlying moves; a warrant\'s omega drops after gains.' },
      { name: 'Time-decay budget', how: 'Estimate the daily premium loss at a flat underlying and compare with the move you expect.', watchOut: 'Decay accelerates in the last weeks before expiry.' },
      { name: 'Stop-distance sizing', how: 'For knock-outs and mini-futures, size the position as if the stop-loss will be hit, then judge whether that loss is tolerable.', watchOut: 'Gaps can jump past the stop level; the residual value may be near zero.' },
      { name: 'Issuer spread and liquidity', how: 'Compare the bid-ask spread in % of price across issuers for the same terms.', watchOut: 'Spreads widen when volatility rises, exactly when you may need to exit.' },
    ],
    redFlags: ['Barrier very close to the spot', 'Holding period far longer than the product design', 'Using leverage with money that must not be lost', 'Constant leverage held long in choppy markets'],
    example: leverageExample,
  },

  'credit-risk': {
    id: 'credit-risk',
    mapCode: '14',
    name: 'Products with additional credit risk',
    tagline: 'Market view plus the default risk of a third party',
    overview:
      'These products add the credit risk of a reference entity, often a corporate or government bond issuer, on top of the usual issuer risk. The extra risk lets the issuer offer better terms. The investor can spread default risk across several names, but must watch the reference entity\'s creditworthiness as well as the underlying.',
    buildingBlocks: 'Note + credit default swap-style exposure to the reference entity, sometimes combined with the capital protection, yield enhancement or participation structures above.',
    products: [
      {
        code: '1400',
        name: 'Credit-linked note',
        expectation: 'No credit event of the reference entity',
        keyTraits: ['Periodic coupon pays the investor for taking credit risk', 'Redemption depends on whether a credit event happens', 'Not driven by equity-market volatility'],
        builtFrom: 'Bond + sold credit default protection',
        priceDrivers: 'Reference entity credit spread, recovery assumption, rates, issuer spread',
      },
      {
        code: '1410',
        name: 'Conditional capital protection with additional credit risk',
        expectation: 'Rising underlying; no credit event',
        keyTraits: ['Capital protection only applies if no credit event occurs', 'Value can fall below the protection level before maturity', 'Protection refers to the nominal'],
        builtFrom: 'Capital protection structure + sold credit protection on the reference entity',
        priceDrivers: 'Same as 1100 plus reference credit spread',
      },
      {
        code: '1420',
        name: 'Yield enhancement certificate with additional credit risk',
        expectation: 'Sideways or slightly rising; no credit event',
        keyTraits: ['Coupon or discount, possibly with a barrier', 'Delivery or cash settlement if below the strike', 'Worst-of baskets raise the yield and the risk'],
        builtFrom: 'Yield-enhancement structure + sold credit protection',
        priceDrivers: 'Volatility, barrier, reference credit spread',
      },
      {
        code: '1430',
        name: 'Participation certificate with additional credit risk',
        expectation: 'Rising underlying; no credit event',
        keyTraits: ['Participation in the underlying only if no credit event occurs', 'Value can fall on a weaker view of the reference entity', 'Barrier features possible'],
        builtFrom: 'Participation structure + sold credit protection',
        priceDrivers: 'Underlying, reference credit spread',
      },
    ],
    pricing: [
      COMMON_PRICING,
      { title: 'Two credit spreads', body: 'The note is priced off both the issuer\'s spread and the reference entity\'s spread. A wider reference spread reduces the value even if the entity is solvent. Reference spreads come from CDS or bond markets.' },
      { title: 'Recovery assumption', body: 'Valuation needs a recovery rate for the case of a credit event. The standard market assumption is applied for modelling, but actual recovery in a default can be much lower or higher.' },
      COMMON_SECONDARY,
    ],
    strategies: [
      { name: 'Spread-implied default probability', how: 'Convert the reference spread into a default probability using spread ÷ (1 − recovery), then compare with the coupon uplift.', watchOut: 'Market-implied probabilities include a risk premium and overstate real default frequency.' },
      { name: 'Compare with a plain bond', how: 'Compare the coupon with a senior bond of the reference entity and of the issuer, same maturity.', watchOut: 'The note is a separate unsecured claim on the issuer, not a claim on the reference entity.' },
      { name: 'Concentration check', how: 'Add the reference entity to the credit exposure you already hold (bonds, deposits, equity).', watchOut: 'Correlated exposure to the same sector stacks up.' },
    ],
    redFlags: ['Reference entity you would not lend to directly', 'Complex credit events and restructuring definitions that are unclear', 'Long maturity on a weak reference name', 'Reference and issuer in the same group'],
    example: creditExample,
  },
};

export const SSPA_GROUP_ORDER: SspaGroupId[] = ['capital-protection', 'yield-enhancement', 'participation', 'leverage', 'credit-risk'];

export const isSspaGroupId = (id: string | undefined): id is SspaGroupId => !!id && id in SSPA_GROUPS;

/** Constant-leverage illustration: hypothetical choppy path, computed (see ConstantLeverageChart). */
export function choppyReturns(days: number, daily: number): number[] {
  return Array.from({ length: days }, (_, i) => (i % 2 === 0 ? daily : -daily));
}
