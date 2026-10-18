import { blackScholes, bondPrice, fmt, pct, type WorkedExample } from './pricingMath';

/**
 * Pricing and valuation notes for each Investment Universe category.
 * Methodology only: no return forecasts, no live prices. Scores are editorial 1–5 judgements for comparison on this site.
 */

export type CategoryId =
  | 'global-equities'
  | 'fx'
  | 'fixed-income'
  | 'cash'
  | 'precious-metals'
  | 'commodities'
  | 'derivatives'
  | 'real-estate'
  | 'infrastructure'
  | 'private-markets'
  | 'whisky'
  | 'wine'
  | 'vsop-spirits'
  | 'collectibles'
  | 'weather'
  | 'crypto';

export type Score = 1 | 2 | 3 | 4 | 5;

export interface ValuationStrategy {
  name: string;
  how: string;
  bestFor: string;
  watchOut: string;
  /** how well this method works for the category, 1 (poor) to 5 (strong) */
  fit: Score;
}

export interface PricingDetail {
  headline: string;
  priceFormation: string;
  quotedAs: string;
  priceSources: string[];
  drivers: { name: string; effect: string }[];
  frictions: string[];
  strategies: ValuationStrategy[];
  redFlags: string[];
  profile: { transparency: Score; frequency: Score; modelDependence: Score; frictionCost: Score };
  example?: () => WorkedExample;
}

/* ---------- worked examples (hypothetical inputs) ---------- */

const equityExample = (): WorkedExample => {
  const d1 = 3;
  const r = 0.08;
  const g = 0.04;
  const v = d1 / (r - g);
  const vLow = d1 / (0.07 - g);
  const vHigh = d1 / (0.09 - g);
  return {
    title: 'Dividend discount (Gordon growth) value',
    intro: 'A share is worth the present value of the dividends it will pay. With steady growth, one formula captures it.',
    inputs: [
      { label: 'Next-year dividend', value: '3.00' },
      { label: 'Required return (cost of equity)', value: pct(r, 1) },
      { label: 'Perpetual dividend growth', value: pct(g, 1) },
    ],
    steps: [
      { label: 'Value = dividend ÷ (required return − growth)', value: fmt(v) },
      { label: 'Same, required return 7%', value: fmt(vLow) },
      { label: 'Same, required return 9%', value: fmt(vHigh) },
    ],
    result: { label: 'Value per share', value: fmt(v) },
    note: 'Hypothetical inputs. One point of discount rate moves the value by roughly a quarter to a third: this is why equity valuation is a range, not a number.',
  };
};

const fxExample = (): WorkedExample => {
  const spot = 0.95;
  const rQuote = 0.01;
  const rBase = 0.025;
  const fwd = (spot * (1 + rQuote)) / (1 + rBase);
  return {
    title: 'Forward rate from covered interest parity',
    intro: 'A forward is not a forecast. It is the spot rate adjusted for the interest-rate gap, so that no risk-free profit is left.',
    inputs: [
      { label: 'Spot (CHF per 1 EUR)', value: fmt(spot, 4) },
      { label: 'CHF 1-year rate', value: pct(rQuote, 1) },
      { label: 'EUR 1-year rate', value: pct(rBase, 1) },
    ],
    steps: [{ label: 'Forward = spot × (1 + CHF rate) ÷ (1 + EUR rate)', value: fmt(fwd, 4) }],
    result: { label: '1-year forward (CHF per EUR)', value: `${fmt(fwd, 4)} (${pct(fwd / spot - 1)} vs spot)` },
    note: 'Hypothetical rates. The currency with the higher rate trades at a forward discount. Hedging cost for a CHF investor in EUR assets follows from this gap.',
  };
};

const bondExample = (): WorkedExample => {
  const c = 0.03;
  const years = 10;
  const p0 = bondPrice(c, 0.03, years);
  const pUp = bondPrice(c, 0.04, years);
  const pDown = bondPrice(c, 0.02, years);
  return {
    title: 'Price of a 10-year bond when yields move',
    intro: 'A bond is priced by discounting its coupons and face value at the market yield. Price and yield move in opposite directions.',
    inputs: [
      { label: 'Coupon / maturity', value: `${pct(c, 1)} annual / ${years} years` },
      { label: 'Face value', value: '100' },
    ],
    steps: [
      { label: 'Price at 3% yield (par)', value: fmt(p0) },
      { label: 'Price if yield rises to 4%', value: `${fmt(pUp)} (${pct(pUp / p0 - 1, 1)})` },
      { label: 'Price if yield falls to 2%', value: `${fmt(pDown)} (${pct(pDown / p0 - 1, 1)})` },
    ],
    result: { label: 'Duration risk: ± 1 point of yield', value: `${pct(pUp / p0 - 1, 1)} / +${pct(pDown / p0 - 1, 1)}` },
    note: 'Hypothetical bond. Longer maturity and lower coupon raise the sensitivity. Credit spread changes work the same way as a yield change.',
  };
};

const cashExample = (): WorkedExample => {
  const y = 0.02;
  const days = 91;
  const price = 100 / (1 + (y * days) / 360);
  return {
    title: 'Price of a 3-month treasury bill',
    intro: 'Bills pay no coupon. They are bought below 100 and redeemed at 100, and the discount is the interest.',
    inputs: [
      { label: 'Money-market yield', value: pct(y, 1) },
      { label: 'Days to maturity', value: `${days} (actual/360)` },
    ],
    steps: [{ label: 'Price = 100 ÷ (1 + yield × days ÷ 360)', value: fmt(price, 3) }],
    result: { label: 'Purchase price per 100', value: fmt(price, 3) },
    note: 'Hypothetical yield. The price barely moves with rates because the maturity is short, which is why cash is a stable store of value in nominal terms.',
  };
};

const goldExample = (): WorkedExample => {
  const S = 2000;
  const r = 0.03;
  const u = 0.003;
  const T = 1;
  const F = S * Math.exp((r + u) * T);
  return {
    title: 'Futures price from cost of carry',
    intro: 'Gold pays no income, so a futures price is spot plus the cost of financing and storing the metal until delivery.',
    inputs: [
      { label: 'Spot price (per ounce, hypothetical)', value: fmt(S, 0) },
      { label: 'Financing rate / storage cost', value: `${pct(r, 1)} / ${pct(u, 1)}` },
      { label: 'Time to delivery', value: `${T} year` },
    ],
    steps: [{ label: 'Futures = spot × e^((rate + storage) × T)', value: fmt(F, 1) }],
    result: { label: 'Fair futures price', value: `${fmt(F, 1)} (+${pct(F / S - 1, 1)} over spot)` },
    note: 'Hypothetical inputs. Higher interest rates raise the carry; gold does not pay a yield, so rising real rates are a headwind for the spot price.',
  };
};

const commodityExample = (): WorkedExample => {
  const S = 80;
  const r = 0.03;
  const u = 0.02;
  const c = 0.06;
  const T = 1;
  const F = S * Math.exp((r + u - c) * T);
  return {
    title: 'Futures curve with a convenience yield',
    intro: 'Physical users value having the commodity on hand. That convenience yield can push the futures price below spot (backwardation).',
    inputs: [
      { label: 'Spot price (hypothetical)', value: fmt(S, 0) },
      { label: 'Financing / storage', value: `${pct(r, 1)} / ${pct(u, 1)}` },
      { label: 'Convenience yield', value: pct(c, 1) },
    ],
    steps: [{ label: 'Futures = spot × e^((rate + storage − convenience) × T)', value: fmt(F, 2) }],
    result: { label: '1-year futures price', value: `${fmt(F, 2)} (${pct(F / S - 1, 1)} vs spot)` },
    note: 'Hypothetical inputs. A fund that rolls futures earns or loses the roll yield: it is a return source that spot price charts do not show.',
  };
};

const derivativeExample = (): WorkedExample => {
  const bs = blackScholes(100, 100, 1, 0.02, 0.02, 0.2);
  const bsHigh = blackScholes(100, 100, 1, 0.02, 0.02, 0.3);
  return {
    title: 'Option price from Black–Scholes',
    intro: 'An option\'s price depends on five inputs. Four are observable; volatility is the one the market argues about.',
    inputs: [
      { label: 'Spot / strike', value: '100 / 100' },
      { label: 'Maturity', value: '1 year' },
      { label: 'Rate / dividend yield', value: '2.0% / 2.0%' },
      { label: 'Implied volatility', value: '20%' },
    ],
    steps: [
      { label: 'Call price at 20% volatility', value: fmt(bs.call) },
      { label: 'Put price at 20% volatility', value: fmt(bs.put) },
      { label: 'Call delta', value: fmt(bs.deltaCall, 2) },
      { label: 'Call price if volatility is 30%', value: fmt(bsHigh.call) },
    ],
    result: { label: 'Call price', value: fmt(bs.call) },
    note: 'Hypothetical inputs. Option value rises with volatility. Real markets show a skew: different strikes trade at different implied volatilities.',
  };
};

const propertyExample = (): WorkedExample => {
  const noi = 50000;
  const cap = 0.045;
  const v = noi / cap;
  const v2 = noi / (cap + 0.01);
  return {
    title: 'Direct capitalisation of rental income',
    intro: 'A rented building is often valued as net operating income divided by a capitalisation rate taken from comparable sales.',
    inputs: [
      { label: 'Net operating income (after non-recoverable costs)', value: fmt(noi, 0) },
      { label: 'Market capitalisation rate', value: pct(cap, 2) },
    ],
    steps: [
      { label: 'Value = NOI ÷ cap rate', value: fmt(v, 0) },
      { label: 'Same, cap rate +1 point', value: `${fmt(v2, 0)} (${pct(v2 / v - 1, 0)})` },
    ],
    result: { label: 'Indicated value', value: fmt(v, 0) },
    note: 'Hypothetical building. A one-point rise in the cap rate cuts value by about a fifth. Appraisals lag the market, so listed property vehicles reprice faster than direct holdings.',
  };
};

const infraExample = (): WorkedExample => {
  const cf = 6;
  const r = 0.07;
  const n = 25;
  const pv = (cf * (1 - (1 + r) ** -n)) / r;
  const pv20 = (cf * (1 - (1 + r) ** -(n - 5))) / r;
  return {
    title: 'DCF of a fixed-life concession',
    intro: 'A toll road or utility with a finite licence is valued as the present value of its cash flows until the contract ends, with little or no terminal value.',
    inputs: [
      { label: 'Annual cash flow to equity (hypothetical)', value: fmt(cf, 1) },
      { label: 'Discount rate', value: pct(r, 1) },
      { label: 'Concession life', value: `${n} years` },
    ],
    steps: [
      { label: 'PV = cash flow × (1 − (1 + r)^−n) ÷ r', value: fmt(pv) },
      { label: 'Same with 5 years less concession life', value: fmt(pv20) },
    ],
    result: { label: 'Value of the cash flows', value: fmt(pv) },
    note: 'Hypothetical inputs. Regulatory resets, inflation indexation and the end-of-life treatment decide the answer more than the discount rate does.',
  };
};

const weatherExample = (): WorkedExample => {
  const strike = 1000;
  const tick = 5000;
  const history = [1020, 940, 1090, 1010, 975, 1130, 1050, 960, 1005, 1075];
  const payoffs = history.map((h) => Math.min(Math.max(h - strike, 0) * tick, 750000));
  const expected = payoffs.reduce((a, b) => a + b, 0) / payoffs.length;
  return {
    title: 'Burn analysis for a heating-degree-day option',
    intro: 'With little market data, weather derivatives are often priced by replaying historical seasons through the contract and averaging the payout, then adding a risk loading.',
    inputs: [
      { label: 'Strike (heating degree days)', value: fmt(strike, 0) },
      { label: 'Tick size per degree day', value: fmt(tick, 0) },
      { label: 'Historical seasons (hypothetical)', value: `${history.length}` },
    ],
    steps: [
      { label: 'Seasons that pay out', value: `${payoffs.filter((p) => p > 0).length} of ${history.length}` },
      { label: 'Average payout across the history', value: fmt(expected, 0) },
    ],
    result: { label: 'Burn-analysis fair premium (before risk loading)', value: fmt(expected, 0) },
    note: 'Hypothetical data. Ten seasons is a thin sample, trends and climate change shift the distribution, and the seller will add a margin for the tail.',
  };
};

/* ---------- category content ---------- */

export const PRICING_DETAILS: Record<CategoryId, PricingDetail> = {
  'global-equities': {
    headline: 'Priced continuously on exchanges; valued as a stream of future earnings.',
    priceFormation: 'Prices come from a continuous auction in a regulated order book. Valuation asks what the price implies for earnings growth and required return, then compares it with a view of the business.',
    quotedAs: 'Price per share, market cap, and multiples (P/E, P/B, EV/EBITDA, dividend yield)',
    priceSources: ['Stock exchanges (live)', 'Index providers (MSCI, S&P)', 'ETF net asset values and creation baskets', 'Company filings'],
    drivers: [
      { name: 'Earnings expectations', effect: 'Revisions move prices more than the reported past.' },
      { name: 'Discount rate', effect: 'Higher real yields lower the present value of distant profits.' },
      { name: 'Risk appetite', effect: 'The equity risk premium widens in stress and compresses in calm markets.' },
      { name: 'Currency', effect: 'A foreign listing carries FX return on top of the local price.' },
    ],
    frictions: ['Bid-ask spread', 'Brokerage and exchange fees', 'Stamp duty or transaction tax in some markets', 'Fund total expense ratio', 'Withholding tax on dividends'],
    strategies: [
      { name: 'Discounted cash flow / dividend discount', how: 'Forecast cash flows, discount at the cost of equity, add a terminal value.', bestFor: 'Stable, cash-generative companies', watchOut: 'Terminal value is often most of the answer; small input changes swing it.', fit: 4 },
      { name: 'Relative multiples', how: 'Compare P/E, EV/EBITDA or P/B with peers and with the stock\'s own history.', bestFor: 'Quick cross-checks within a sector', watchOut: 'Peers can be wrong together; accounting differences distort comparisons.', fit: 4 },
      { name: 'Earnings yield vs bond yield', how: 'Compare the inverse of the P/E with a real government yield to gauge the equity premium.', bestFor: 'Whole-market valuation', watchOut: 'Cyclical earnings make the ratio unstable.', fit: 3 },
      { name: 'Sum of the parts / asset-based', how: 'Value divisions or assets separately and add up.', bestFor: 'Conglomerates, holding companies, asset-heavy firms', watchOut: 'Holding discounts can persist for years.', fit: 2 },
      { name: 'Factor and quality screens', how: 'Rank by value, quality, momentum and size characteristics instead of absolute value.', bestFor: 'Portfolio construction, not single names', watchOut: 'Factor premia can go unrewarded for a decade.', fit: 3 },
    ],
    redFlags: ['A valuation case that rests on terminal value alone', 'Earnings quality issues (accruals far above cash flow)', 'Multiples compared across different accounting regimes', 'Treating a low P/E as safety without checking balance sheet'],
    profile: { transparency: 5, frequency: 5, modelDependence: 3, frictionCost: 1 },
    example: equityExample,
  },
  fx: {
    headline: 'Priced as a relative rate between two currencies; "value" is a long-run anchor, not a cash flow.',
    priceFormation: 'Spot rates are set by dealers and electronic platforms in an over-the-counter market. Forward prices follow the interest-rate gap, so the forward is not a forecast of spot.',
    quotedAs: 'Bid and ask for a currency pair; forward points; implied volatility',
    priceSources: ['Interbank and ECN platforms', 'Central-bank reference rates', 'Bank quotes to clients', 'OTC forward and option dealers'],
    drivers: [
      { name: 'Rate differentials', effect: 'Set the forward and attract carry flows.' },
      { name: 'Inflation differentials', effect: 'Purchasing-power parity pulls rates over multi-year horizons.' },
      { name: 'Current account and capital flows', effect: 'Persistent deficits or safe-haven flows move the rate.' },
      { name: 'Policy surprises', effect: 'Central-bank decisions cause the largest jumps.' },
    ],
    frictions: ['Dealer spread (wider for exotic pairs and small tickets)', 'Rollover / swap points on leveraged positions', 'Hedging cost embedded in foreign-asset funds', 'Platform and conversion fees'],
    strategies: [
      { name: 'Covered interest parity (forwards)', how: 'Derive the forward from spot and the two interest rates.', bestFor: 'Pricing hedges and hedging cost', watchOut: 'Funding-market stress can open gaps (cross-currency basis).', fit: 5 },
      { name: 'Purchasing-power parity', how: 'Compare the rate with the ratio of price levels, often with a basket such as the Big Mac index or real effective exchange rates.', bestFor: 'Long-run anchor over many years', watchOut: 'Deviations can last a decade or more.', fit: 3 },
      { name: 'Real effective exchange rate', how: 'Use trade-weighted rates deflated by inflation.', bestFor: 'Judging whether a currency is stretched', watchOut: 'Weights and deflators matter and are revised.', fit: 3 },
      { name: 'Carry and momentum models', how: 'Rank currencies by rate differential or trend.', bestFor: 'Systematic strategies', watchOut: 'Carry can unwind sharply in risk-off periods.', fit: 2 },
    ],
    redFlags: ['Treating a forward as a forecast', 'Leverage sized on average volatility', 'Retail quotes with wide, undisclosed spreads', 'Unhedged FX inside a bond allocation sold as defensive'],
    profile: { transparency: 4, frequency: 5, modelDependence: 2, frictionCost: 2 },
    example: fxExample,
  },
  'fixed-income': {
    headline: 'Priced from yields: price is the present value of coupons and principal.',
    priceFormation: 'Government bonds trade on dealer networks and electronic platforms, with prices from the yield curve. Corporate bonds add a credit spread and trade less often, so quotes can be indicative rather than firm.',
    quotedAs: 'Clean price, yield to maturity, spread to a benchmark, duration',
    priceSources: ['Dealer quotes', 'Electronic platforms and exchanges', 'Evaluated prices from data vendors', 'Fund net asset values'],
    drivers: [
      { name: 'Risk-free yields', effect: 'Set the base discount rate for all maturities.' },
      { name: 'Credit spread', effect: 'Widens with default risk and falls with strong credit conditions.' },
      { name: 'Inflation expectations', effect: 'Raise nominal yields; real yields drive linkers.' },
      { name: 'Liquidity', effect: 'Off-the-run and small issues carry a premium.' },
    ],
    frictions: ['Dealer spread (small for government bonds, large for some corporates)', 'Accrued interest on trade date', 'Fund expense ratio', 'Custody fees', 'Withholding tax'],
    strategies: [
      { name: 'Discounted coupons at yield', how: 'Discount coupons and principal at the bond\'s market yield.', bestFor: 'Plain-vanilla bonds', watchOut: 'Callable and floating-rate bonds need option-adjusted or margin-based methods.', fit: 5 },
      { name: 'Yield curve and spread analysis', how: 'Compare the bond\'s yield with the government curve at the same maturity to read the spread.', bestFor: 'Relative value across issuers', watchOut: 'Spread includes liquidity premium, not only default risk.', fit: 4 },
      { name: 'Duration and convexity', how: 'Estimate price change for a parallel yield move.', bestFor: 'Interest-rate risk budgeting', watchOut: 'Convexity matters for large moves and for callable bonds.', fit: 4 },
      { name: 'Credit analysis / CDS-implied', how: 'Analyse the issuer or read default probability from CDS and bond spreads.', bestFor: 'Corporate and emerging-market debt', watchOut: 'Market-implied default probabilities include a risk premium.', fit: 3 },
    ],
    redFlags: ['Chasing yield without checking credit quality', 'Long duration bought as "safe"', 'Quoted prices that are indicative only', 'Bond funds with mismatch between liquidity and redemptions'],
    profile: { transparency: 3, frequency: 4, modelDependence: 3, frictionCost: 2 },
    example: bondExample,
  },
  cash: {
    headline: 'Priced at face value or by a short-dated discount; the main variable is the rate you earn.',
    priceFormation: 'Deposits pay a stated rate. Money-market instruments are priced off short-term rates, with a small discount to par that accrues daily.',
    quotedAs: 'Interest rate, money-market yield, net asset value (stable or floating)',
    priceSources: ['Bank rate sheets', 'Central-bank policy rate', 'Treasury bill auctions', 'Money-market fund NAVs'],
    drivers: [
      { name: 'Policy rate', effect: 'Moves deposit and bill yields almost one-for-one.' },
      { name: 'Credit and liquidity conditions', effect: 'Prime funds and bank deposits can reprice in stress.' },
      { name: 'Inflation', effect: 'Determines the real return, not the price.' },
    ],
    frictions: ['Spread between deposit rate and policy rate', 'Account or custody fees', 'Currency conversion', 'Fund expense ratio'],
    strategies: [
      { name: 'Compare after-tax, after-fee yield', how: 'Set the net yield against the policy rate and inflation.', bestFor: 'Choosing between deposits, funds and bills', watchOut: 'Tax and deposit protection limits differ by country.', fit: 5 },
      { name: 'Discount pricing', how: 'Convert a quoted discount or yield into a price per 100.', bestFor: 'Treasury bills and commercial paper', watchOut: 'Day-count conventions differ by market.', fit: 5 },
      { name: 'Counterparty review', how: 'Check bank rating, deposit protection and the fund\'s holdings.', bestFor: 'Large balances', watchOut: 'Concentration in one bank is the real risk, not the rate.', fit: 4 },
    ],
    redFlags: ['Teaser rates that reset after a short period', 'Balances above the deposit protection limit', 'Treating a floating-NAV money-market fund as a deposit', 'Ignoring inflation over long holding periods'],
    profile: { transparency: 5, frequency: 4, modelDependence: 1, frictionCost: 1 },
    example: cashExample,
  },
  'precious-metals': {
    headline: 'Priced as a global commodity with no cash flow; the anchor is real rates, dollar strength and risk demand.',
    priceFormation: 'Spot is set in over-the-counter markets and fixed twice daily in London; futures set the price curve. Physical dealers add a premium over spot for bars and coins.',
    quotedAs: 'USD per troy ounce, premium over spot, ETF NAV, futures price',
    priceSources: ['LBMA fixings', 'COMEX/other futures', 'ETF NAV and holdings', 'Dealer price lists'],
    drivers: [
      { name: 'Real interest rates', effect: 'Higher real yields raise the cost of holding a non-yielding asset.' },
      { name: 'US dollar', effect: 'Prices are quoted in dollars; a weaker dollar tends to support the price.' },
      { name: 'Central-bank and investment demand', effect: 'Official-sector buying and ETF flows add to demand.' },
      { name: 'Risk hedging', effect: 'Demand rises in stress episodes and falls when yields climb.' },
    ],
    frictions: ['Dealer premium on physical metal', 'Storage and insurance', 'VAT or sales tax in some jurisdictions', 'ETF management fee', 'Futures roll cost'],
    strategies: [
      { name: 'Cost of carry', how: 'Derive futures prices from spot, financing and storage.', bestFor: 'Futures and forwards', watchOut: 'Doesn\'t say where spot should be.', fit: 3 },
      { name: 'Real-rate regression', how: 'Relate gold to real government yields and the dollar over history.', bestFor: 'Understanding drivers', watchOut: 'Relationship breaks during demand shocks.', fit: 3 },
      { name: 'Gold-to-asset ratios', how: 'Compare gold with money supply, the Dow, or oil over the long run.', bestFor: 'Long-run context', watchOut: 'No mean-reversion guarantee.', fit: 2 },
      { name: 'Mining-cost floor', how: 'Use all-in sustaining cost of marginal producers as a rough floor.', bestFor: 'Downside context', watchOut: 'Costs shift with energy and currency.', fit: 2 },
      { name: 'Premium and storage cost check', how: 'Compare the dealer premium, spread and storage fee with ETF and vault alternatives.', bestFor: 'Choosing physical vs fund exposure', watchOut: 'Premiums widen in demand spikes.', fit: 4 },
    ],
    redFlags: ['Large premiums on coins sold as "collectible"', 'Unallocated accounts without clear title', 'Gold quoted without the currency', 'Leveraged gold products held for long periods'],
    profile: { transparency: 4, frequency: 5, modelDependence: 3, frictionCost: 3 },
    example: goldExample,
  },
  commodities: {
    headline: 'Priced through futures curves: return is spot change plus roll yield plus collateral.',
    priceFormation: 'Prices are set on futures exchanges. Spot is inferred from the nearest contracts. The shape of the curve (backwardation or contango) tells you the cost or reward of holding the commodity.',
    quotedAs: 'Futures price per contract unit, curve shape, index level, ETF/ETN price',
    priceSources: ['Futures exchanges', 'Commodity indices (BCOM, S&P GSCI)', 'Physical benchmarks and assessments', 'ETF/ETN prices'],
    drivers: [
      { name: 'Supply shocks', effect: 'Weather, outages, and geopolitics move prices fast.' },
      { name: 'Demand cycle', effect: 'Industrial activity drives energy and metals.' },
      { name: 'Inventories', effect: 'Low stocks lift convenience yield and flatten or invert the curve.' },
      { name: 'Dollar and rates', effect: 'Dollar strength and financing costs weigh on prices and carry.' },
    ],
    frictions: ['Roll cost in contango', 'Fund or index fee', 'Margin and collateral cost', 'Storage for physical exposure', 'Tracking error vs spot'],
    strategies: [
      { name: 'Futures curve analysis', how: 'Read roll yield and carry from the slope of the curve.', bestFor: 'Fund and index investors', watchOut: 'Past roll yield is not a forecast.', fit: 4 },
      { name: 'Cost of carry with convenience yield', how: 'Fit the theoretical futures price from spot, rates, storage and convenience yield.', bestFor: 'Understanding the curve', watchOut: 'Convenience yield is implied, not observed.', fit: 3 },
      { name: 'Supply-demand and inventory models', how: 'Compare stock levels with consumption to judge tightness.', bestFor: 'Single commodities', watchOut: 'Data is revised and lags.', fit: 3 },
      { name: 'Cost-curve floors', how: 'Use marginal production cost as a long-run anchor.', bestFor: 'Metals and oil', watchOut: 'Costs move with energy, currency and technology.', fit: 3 },
    ],
    redFlags: ['Judging a fund by spot charts when it holds futures', 'Persistent contango with a long-dated roll', 'Single-commodity concentration', 'Leverage on a commodity with gap risk'],
    profile: { transparency: 4, frequency: 5, modelDependence: 3, frictionCost: 3 },
    example: commodityExample,
  },
  derivatives: {
    headline: 'Priced by replication and no-arbitrage; the unobservable input is volatility.',
    priceFormation: 'Listed derivatives trade on exchanges; OTC contracts are priced by dealers using models fitted to market quotes. A model price is only as good as the volatility, rate and correlation inputs.',
    quotedAs: 'Premium, implied volatility, Greeks (delta, gamma, vega, theta), margin',
    priceSources: ['Exchange order books', 'Dealer quotes (OTC)', 'Implied volatility surfaces', 'Clearing-house settlement prices'],
    drivers: [
      { name: 'Underlying price', effect: 'Delta and gamma describe the sensitivity.' },
      { name: 'Implied volatility', effect: 'Raises option prices; skew differs by strike.' },
      { name: 'Time to expiry', effect: 'Time value decays, faster near expiry.' },
      { name: 'Rates and dividends', effect: 'Enter the forward and the discounting.' },
    ],
    frictions: ['Bid-ask spread (wide for far-from-money strikes)', 'Margin and funding cost', 'Clearing and exchange fees', 'Roll cost', 'Model risk on OTC trades'],
    strategies: [
      { name: 'Black–Scholes and extensions', how: 'Price vanilla options from five inputs, then adjust for skew with local- or stochastic-volatility models.', bestFor: 'Vanilla options', watchOut: 'Constant volatility is a simplification.', fit: 4 },
      { name: 'Replication and no-arbitrage', how: 'Price forwards, swaps and futures from the underlying and financing.', bestFor: 'Linear products', watchOut: 'Basis and funding spreads open small gaps.', fit: 5 },
      { name: 'Monte Carlo simulation', how: 'Simulate paths to price path-dependent payoffs such as barriers and autocalls.', bestFor: 'Exotic and structured payoffs', watchOut: 'Needs correlation and skew inputs; results are noisy.', fit: 3 },
      { name: 'Scenario and stress analysis', how: 'Apply price, volatility and time shocks to the position.', bestFor: 'Risk management', watchOut: 'Stress should include joint moves, not only single factors.', fit: 4 },
    ],
    redFlags: ['Selling options without a defined loss limit', 'Leverage with no stress test', 'Counterparty without margining', 'Complex payoffs with no independent valuation'],
    profile: { transparency: 3, frequency: 5, modelDependence: 5, frictionCost: 3 },
    example: derivativeExample,
  },
  'real-estate': {
    headline: 'Priced through appraisals and comparable sales; listed vehicles reprice daily.',
    priceFormation: 'Direct property trades privately, one asset at a time, so price is negotiated. Appraisals estimate value between sales and lag the market. Listed real estate trades like equities and shows the market\'s view faster.',
    quotedAs: 'Price per m², capitalisation rate, rental yield, NAV and premium/discount for funds and REITs',
    priceSources: ['Comparable transactions', 'Professional appraisals', 'Property price indices', 'Listed REIT and fund prices'],
    drivers: [
      { name: 'Net operating income', effect: 'Rents and vacancy set the cash flow.' },
      { name: 'Interest rates and cap rates', effect: 'Higher financing costs push cap rates up and values down.' },
      { name: 'Local supply', effect: 'New construction and zoning set the rent ceiling.' },
      { name: 'Leverage', effect: 'Debt magnifies value changes.' },
    ],
    frictions: ['Transaction taxes and agent fees', 'Notary and legal costs', 'Maintenance, vacancy, management', 'Property tax and insurance', 'Fund fees and NAV discounts'],
    strategies: [
      { name: 'Direct capitalisation', how: 'Divide net operating income by a market cap rate.', bestFor: 'Stabilised income properties', watchOut: 'Cap rate selection drives the answer.', fit: 4 },
      { name: 'Discounted cash flow', how: 'Forecast rents, costs and capital spending, discount at the property\'s required return.', bestFor: 'Properties with changing income', watchOut: 'Exit-value assumption dominates.', fit: 4 },
      { name: 'Comparable sales', how: 'Adjust recent prices of similar properties for size, location and condition.', bestFor: 'Homes and small buildings', watchOut: 'Few comparables in thin markets.', fit: 4 },
      { name: 'Replacement cost', how: 'Estimate land plus rebuild cost less depreciation.', bestFor: 'Ceiling for value', watchOut: 'Ignores demand and location premium.', fit: 2 },
      { name: 'REIT NAV premium/discount', how: 'Compare the listed price with appraised net asset value.', bestFor: 'Listed property', watchOut: 'Appraised NAV itself lags the market.', fit: 3 },
    ],
    redFlags: ['Rental yield quoted before costs and vacancy', 'Valuation based on seller\'s appraisal only', 'High leverage with short refinancing windows', 'Concentration in one local market'],
    profile: { transparency: 2, frequency: 2, modelDependence: 4, frictionCost: 5 },
    example: propertyExample,
  },
  infrastructure: {
    headline: 'Valued as long-dated contracted or regulated cash flows; price follows rates and regulation.',
    priceFormation: 'Listed infrastructure trades daily like equities. Unlisted funds report net asset values from periodic discounted-cash-flow models. Regulated returns and contract terms anchor the cash flows.',
    quotedAs: 'Equity value, EV/EBITDA, dividend yield, fund NAV, discount rate used in the model',
    priceSources: ['Listed infrastructure equities and indices', 'Fund NAV reports', 'Regulator decisions (allowed returns)', 'Transaction multiples'],
    drivers: [
      { name: 'Discount rate and bond yields', effect: 'Long-duration cash flows react strongly to rates.' },
      { name: 'Regulation and tariff resets', effect: 'Allowed returns set the cash flow.' },
      { name: 'Inflation linkage', effect: 'Indexed tariffs pass inflation through.' },
      { name: 'Counterparty and demand risk', effect: 'Traffic or offtake risk differs by asset type.' },
    ],
    frictions: ['Fund management and performance fees', 'Lock-up and redemption gates', 'Transaction costs on private deals', 'Tax on distributions'],
    strategies: [
      { name: 'Discounted cash flow', how: 'Forecast the contracted or regulated cash flows over the asset life and discount them.', bestFor: 'Concessions and regulated utilities', watchOut: 'Discount rate and end-of-life value are the swing factors.', fit: 5 },
      { name: 'Regulated asset base multiple', how: 'Compare enterprise value with the regulated asset base.', bestFor: 'Regulated networks', watchOut: 'Regulator can reset returns.', fit: 4 },
      { name: 'Yield spread to bonds', how: 'Compare distribution yield with government or corporate bonds.', bestFor: 'Listed infrastructure', watchOut: 'Not a substitute for cash-flow analysis.', fit: 3 },
      { name: 'Transaction multiples', how: 'Compare with recent sales of similar assets.', bestFor: 'Private assets', watchOut: 'Few deals; private pricing is opaque.', fit: 3 },
    ],
    redFlags: ['Valuation using a discount rate below comparable bonds', 'Single-asset concentration', 'Aggressive terminal value', 'Fund NAVs that move far less than listed peers'],
    profile: { transparency: 3, frequency: 3, modelDependence: 4, frictionCost: 3 },
    example: infraExample,
  },
  'private-markets': {
    headline: 'No market price: value is a manager estimate until a sale, so judge returns by cash flows.',
    priceFormation: 'Funds report net asset value from valuation committees using comparable multiples, DCF or the last funding round. The true price appears only on exit or in a secondary sale, often at a discount or premium to NAV.',
    quotedAs: 'NAV, IRR, TVPI/DPI/RVPI, multiple of invested capital, secondary discount to NAV',
    priceSources: ['Manager NAV reports (quarterly)', 'Audited annual accounts', 'Secondary-market transactions', 'Public comparables for the portfolio'],
    drivers: [
      { name: 'Exit environment', effect: 'IPO and M&A windows set realised value.' },
      { name: 'Public-market multiples', effect: 'Used to mark private companies, with a lag.' },
      { name: 'Leverage and financing costs', effect: 'Matter most for buyouts and real-asset funds.' },
      { name: 'Time and fees', effect: 'J-curve: early returns are negative after fees.' },
    ],
    frictions: ['Management and performance fees', 'Fund and placement costs', 'Capital calls on a schedule you do not control', 'Illiquidity: secondary sale discount'],
    strategies: [
      { name: 'Public market equivalent (PME)', how: 'Compare the fund\'s cash flows with investing the same amounts in a public index.', bestFor: 'Judging whether illiquidity paid', watchOut: 'Needs full cash-flow history.', fit: 4 },
      { name: 'DPI and TVPI tracking', how: 'DPI shows cash returned; TVPI adds the unrealised NAV.', bestFor: 'Separating realised from estimated returns', watchOut: 'High TVPI with low DPI means value is still on paper.', fit: 4 },
      { name: 'NAV with a discount', how: 'Value a stake as reported NAV less a secondary discount.', bestFor: 'Secondary purchases or sales', watchOut: 'Discount varies with market stress.', fit: 3 },
      { name: 'Underlying company DCF and comparables', how: 'Revalue the portfolio companies from first principles.', bestFor: 'Co-investments and direct stakes', watchOut: 'Hard to access full information.', fit: 3 },
    ],
    redFlags: ['Reported IRR boosted by subscription credit lines', 'High NAV and no distributions for many years', 'Smoothed volatility mistaken for low risk', 'Fee layers on top of fund-of-funds'],
    profile: { transparency: 1, frequency: 1, modelDependence: 5, frictionCost: 5 },
  },
  whisky: {
    headline: 'Priced by auction results and bottle-level comparables; no cash flow, no central exchange.',
    priceFormation: 'Rare bottles trade at auction and on dealer platforms. Casks trade privately, and value depends on spirit, age, distillery reputation and bottling potential. Indices track auction prices of selected bottles.',
    quotedAs: 'Hammer price plus buyer premium, price per bottle, price per litre of pure alcohol for casks, index level',
    priceSources: ['Auction houses', 'Whisky auction indices (e.g. rare-whisky indices)', 'Broker and dealer lists', 'Cask brokers and bottlers'],
    drivers: [
      { name: 'Distillery reputation and closures', effect: 'Scarcity premium for silent or closed distilleries.' },
      { name: 'Collector demand and trends', effect: 'Fashion drives specific releases.' },
      { name: 'Age, cask type, and bottling', effect: 'Determine rarity and condition.' },
      { name: 'Condition and provenance', effect: 'Label, fill level and documentation affect price.' },
    ],
    frictions: ['Buyer premium and seller commission', 'Storage and insurance (for casks: bonded warehouse)', 'Duty and VAT outside bond', 'Authentication costs', 'Thin secondary market'],
    strategies: [
      { name: 'Comparable auction sales', how: 'Use recent hammer prices of the same bottling, adjusted for condition.', bestFor: 'Bottles with a deep trading record', watchOut: 'Buyer premium and fees change the net price.', fit: 4 },
      { name: 'Index-relative valuation', how: 'Compare the price path with a published whisky index.', bestFor: 'Judging the category trend', watchOut: 'Index composition is narrower than the market.', fit: 3 },
      { name: 'Cask: price per litre of pure alcohol', how: 'Value the cask by its litres of pure alcohol and the market price for similar age and distillery.', bestFor: 'Cask purchases', watchOut: 'Evaporation, cask quality and unlisted fees.', fit: 3 },
      { name: 'Net-of-cost holding analysis', how: 'Deduct storage, insurance, and selling costs from the expected price.', bestFor: 'Judging whether holding makes sense', watchOut: 'Costs are known; price rise is not.', fit: 4 },
    ],
    redFlags: ['Cask offers with no independent warehouse record', 'Promised return on a cask', 'Fake or refilled bottles', 'Valuations from the seller\'s own list'],
    profile: { transparency: 2, frequency: 2, modelDependence: 3, frictionCost: 5 },
  },
  wine: {
    headline: 'Priced by auction and merchant comparables, with critic scores and provenance as quality signals.',
    priceFormation: 'Fine wine trades through merchants, auctions and trading platforms. Prices follow vintage, producer, critic scores and drinking window. Indices such as Liv-ex track a basket of top wines.',
    quotedAs: 'Price per case or bottle, in-bond or duty-paid, index level',
    priceSources: ['Liv-ex and trading platforms', 'Auction results', 'Merchant price lists', 'Critic scores and vintage reports'],
    drivers: [
      { name: 'Vintage quality', effect: 'Strong years command a premium.' },
      { name: 'Producer and label scarcity', effect: 'Few top labels carry most of the market.' },
      { name: 'Maturity / drinking window', effect: 'Consumption removes supply as wines age.' },
      { name: 'Critic scores and demand cycles', effect: 'Can swing prices by a large amount.' },
    ],
    frictions: ['Merchant and auction commissions', 'Bonded storage and insurance', 'Duty and VAT if released from bond', 'Authentication and provenance checks', 'Spread between buy and sell prices'],
    strategies: [
      { name: 'Comparable sales and merchant prices', how: 'Compare the same wine, vintage, bottle size and storage history.', bestFor: 'Top labels with deep trading', watchOut: 'Lower-tier wines trade thinly.', fit: 4 },
      { name: 'Hedonic / index models', how: 'Explain prices by vintage, producer and score, or track an index of top wines.', bestFor: 'Category-level trend', watchOut: 'Index covers a narrow set of top names.', fit: 3 },
      { name: 'Drinking-window analysis', how: 'Check where the wine sits relative to its peak window.', bestFor: 'Timing sales and consumption', watchOut: 'Expert opinions differ.', fit: 3 },
      { name: 'Net-of-cost holding analysis', how: 'Subtract storage, insurance and the round-trip spread from expected price.', bestFor: 'Holding decisions', watchOut: 'Costs are certain, appreciation is not.', fit: 4 },
    ],
    redFlags: ['Fine-wine "funds" with no independent custody', 'Wine with no provenance chain', 'Quoted prices excluding fees', 'Concentration in one vintage'],
    profile: { transparency: 3, frequency: 3, modelDependence: 3, frictionCost: 4 },
  },
  'vsop-spirits': {
    headline: 'Priced by dealer lists and auction comparables; thin trading means wide ranges.',
    priceFormation: 'Aged cognac, armagnac, rum and other collectible spirits trade through specialist dealers and auctions. With few repeated trades per bottling, price is anchored on a handful of comparables.',
    quotedAs: 'Price per bottle, dealer ask and bid, auction hammer price',
    priceSources: ['Specialist auctions', 'Dealer catalogues', 'Producer releases', 'Collector forums (low reliability)'],
    drivers: [
      { name: 'Age statement and house reputation', effect: 'Older releases from top houses are scarce.' },
      { name: 'Limited edition status', effect: 'Release size and packaging influence demand.' },
      { name: 'Condition and seal', effect: 'Evaporation and closure damage lower value.' },
      { name: 'Collector fashion', effect: 'Trends move quickly.' },
    ],
    frictions: ['Dealer margins (often large)', 'Auction commissions', 'Storage and insurance', 'Duty and VAT', 'Authentication'],
    strategies: [
      { name: 'Comparable sales with a wide band', how: 'Use the few recent trades of the exact bottling and show a range, not a point.', bestFor: 'Established bottlings', watchOut: 'Few trades per bottle.', fit: 3 },
      { name: 'Dealer bid, not ask', how: 'Value at what a dealer would pay, not the catalogue price.', bestFor: 'Realistic exit value', watchOut: 'Bid can be far under ask.', fit: 4 },
      { name: 'Net-of-cost holding analysis', how: 'Deduct costs and the dealer spread.', bestFor: 'Holding decisions', watchOut: 'Hard to know the future buyer.', fit: 4 },
    ],
    redFlags: ['Prices taken from the seller\'s list', 'No documentation of bottling', 'Counterfeits in old bottles', 'Over-reliance on a hot trend'],
    profile: { transparency: 1, frequency: 1, modelDependence: 3, frictionCost: 5 },
  },
  collectibles: {
    headline: 'Priced one item at a time: value is provenance, condition and the next buyer.',
    priceFormation: 'Art, watches, cars, coins and similar items trade at auction and through dealers. Each item is unique or in small series, so price comes from comparables and expert opinion, with indices for sub-markets.',
    quotedAs: 'Hammer price plus buyer premium, estimate range, dealer price, index level',
    priceSources: ['Auction results', 'Dealer and gallery sales (private)', 'Sub-market indices', 'Expert appraisals'],
    drivers: [
      { name: 'Provenance and condition', effect: 'Documentation and originality set the premium.' },
      { name: 'Artist, maker or model reputation', effect: 'Concentrated in a few top names.' },
      { name: 'Wealth and taste cycles', effect: 'Prices follow collector wealth and fashions.' },
      { name: 'Authenticity', effect: 'A doubt can erase most of the value.' },
    ],
    frictions: ['Buyer premium and seller commission', 'Insurance and storage', 'Restoration and conservation', 'Taxes (VAT, import, resale royalties)', 'Long time to sell'],
    strategies: [
      { name: 'Comparable sales', how: 'Use recent results of similar items with condition and provenance adjustments.', bestFor: 'Established sub-markets', watchOut: 'Unique items have no true comparable.', fit: 3 },
      { name: 'Repeat-sales and hedonic indices', how: 'Track items that sold more than once or model price by attributes.', bestFor: 'Judging the category trend', watchOut: 'Survivorship bias and thin data.', fit: 3 },
      { name: 'Expert appraisal', how: 'Independent specialist estimate for insurance or sale.', bestFor: 'Unique items', watchOut: 'Appraisal types differ (insurance values run above market).', fit: 3 },
      { name: 'Net-of-cost holding analysis', how: 'Account for premium, commission, insurance and taxes.', bestFor: 'Return realism', watchOut: 'Round-trip cost can be a quarter or more of price.', fit: 4 },
    ],
    redFlags: ['Insurance value mistaken for market value', 'Missing provenance or restoration records', 'Buying on estimate without fees', 'Concentration in one name or one item'],
    profile: { transparency: 2, frequency: 1, modelDependence: 4, frictionCost: 5 },
  },
  weather: {
    headline: 'Priced from a probability distribution of weather outcomes, plus a risk margin.',
    priceFormation: 'Contracts pay on an index such as heating or cooling degree days. With little trading, dealers price by replaying history and fitting a model to the index, then add a margin for uncertainty and capital.',
    quotedAs: 'Premium, strike, tick size, payout limit, index definition and weather station',
    priceSources: ['Meteorological station records', 'Dealer quotes (OTC)', 'Cat-bond and insurance-linked market spreads', 'Exchange listings (limited)'],
    drivers: [
      { name: 'Index distribution', effect: 'Mean and spread of the index set the expected payout.' },
      { name: 'Trend and climate change', effect: 'Shifts the distribution away from the historical record.' },
      { name: 'Basis risk', effect: 'The index may not match actual exposure.' },
      { name: 'Capital cost', effect: 'Tail risk requires a risk load.' },
    ],
    frictions: ['Dealer margin', 'Basis risk between index and exposure', 'Limited liquidity to exit', 'Legal and documentation cost'],
    strategies: [
      { name: 'Burn analysis', how: 'Apply the contract to each past season and average the payouts.', bestFor: 'First estimate with long data', watchOut: 'Ignores trend and tail events.', fit: 3 },
      { name: 'Index modelling', how: 'Fit a statistical model to the index (with trend and seasonality) and simulate.', bestFor: 'Pricing with shorter or noisy data', watchOut: 'Model choice drives the tail.', fit: 4 },
      { name: 'Risk-load and capital approach', how: 'Add a margin tied to the capital held against the tail.', bestFor: 'Seller view', watchOut: 'Hard to compare across dealers.', fit: 3 },
      { name: 'Hedge-effectiveness test', how: 'Measure how well the index tracks the actual loss.', bestFor: 'Buyers hedging a business', watchOut: 'Basis risk can make the hedge poor.', fit: 4 },
    ],
    redFlags: ['Index not linked to the actual exposure', 'Short data history', 'Seller with weak capital', 'No stress test of the tail'],
    profile: { transparency: 2, frequency: 1, modelDependence: 5, frictionCost: 4 },
    example: weatherExample,
  },
  crypto: {
    headline: 'Priced by supply and demand on exchanges; there is no cash-flow anchor for most coins.',
    priceFormation: 'Prices form continuously on centralised and decentralised exchanges, all day. Different venues can show different prices, and thin books move far on small orders. Valuation models try to link price to network activity or supply, with limited evidence.',
    quotedAs: 'Price in a quote currency, market cap, volume, funding rate, on-chain metrics',
    priceSources: ['Centralised exchanges', 'Decentralised exchanges and liquidity pools', 'Price aggregators and indices', 'Regulated ETPs and futures'],
    drivers: [
      { name: 'Liquidity and flows', effect: 'Leverage and exchange flows drive short-run moves.' },
      { name: 'Regulation and access', effect: 'Approvals and bans change demand.' },
      { name: 'Supply schedule', effect: 'Issuance, halvings and token unlocks affect supply.' },
      { name: 'Risk appetite', effect: 'Correlates with other risk assets in stress.' },
    ],
    frictions: ['Exchange and spread costs', 'Network (gas) fees', 'Custody and key-management cost', 'Funding costs on leveraged positions', 'Tax reporting effort'],
    strategies: [
      { name: 'Network-activity ratios', how: 'Compare market value with active users, transactions or fees.', bestFor: 'Relative comparison within the sector', watchOut: 'Activity can be gamed or inflated.', fit: 2 },
      { name: 'Stock-to-flow and supply models', how: 'Relate price to issuance schedule scarcity.', bestFor: 'Narrative context', watchOut: 'Weak out-of-sample record.', fit: 1 },
      { name: 'Cost of production / mining economics', how: 'Compare price with miner cost for proof-of-work coins.', bestFor: 'Downside context', watchOut: 'Not a floor.', fit: 2 },
      { name: 'Realised price and on-chain cost basis', how: 'Use the average acquisition cost of coins to see where holders are in profit.', bestFor: 'Sentiment context', watchOut: 'Descriptive, not predictive.', fit: 2 },
      { name: 'Liquidity and venue-risk check', how: 'Compare depth, spread and venue quality for the position size.', bestFor: 'Execution and sizing', watchOut: 'Wash trading inflates volume.', fit: 4 },
    ],
    redFlags: ['Volume from unregulated venues', 'Yield without a clear source', 'Leverage over the exchange risk', 'Valuation models presented as precise'],
    profile: { transparency: 3, frequency: 5, modelDependence: 4, frictionCost: 3 },
  },
};

export const CATEGORY_IDS = Object.keys(PRICING_DETAILS) as CategoryId[];

export const PROFILE_LABELS: Record<keyof PricingDetail['profile'], { label: string; hint: string }> = {
  transparency: { label: 'Price transparency', hint: '5 = live public quotes' },
  frequency: { label: 'Pricing frequency', hint: '5 = continuous' },
  modelDependence: { label: 'Model dependence', hint: '5 = value is mostly a model output' },
  frictionCost: { label: 'Round-trip cost', hint: '5 = very costly to buy and sell' },
};
