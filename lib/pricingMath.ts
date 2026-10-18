/** Small pricing helpers used for hypothetical worked examples. Inputs are always labelled as illustrative. */

export interface WorkedExample {
  title: string;
  intro: string;
  inputs: { label: string; value: string }[];
  steps: { label: string; value: string }[];
  result: { label: string; value: string };
  note: string;
}

export const fmt = (n: number, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const pct = (n: number, d = 2) => `${fmt(n * 100, d)}%`;

/** Standard normal CDF (Abramowitz & Stegun 7.1.26 via erf) */
export function normCdf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
  const poly =
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  const erf = 1 - poly * Math.exp(-(x * x) / 2);
  return 0.5 * (1 + (x >= 0 ? erf : -erf));
}

export interface BsResult {
  call: number;
  put: number;
  deltaCall: number;
  d1: number;
  d2: number;
}

/** Black–Scholes–Merton, continuous dividend yield q */
export function blackScholes(S: number, K: number, T: number, r: number, q: number, vol: number): BsResult {
  const sd = vol * Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r - q + (vol * vol) / 2) * T) / sd;
  const d2 = d1 - sd;
  const dfR = Math.exp(-r * T);
  const dfQ = Math.exp(-q * T);
  const call = S * dfQ * normCdf(d1) - K * dfR * normCdf(d2);
  const put = K * dfR * normCdf(-d2) - S * dfQ * normCdf(-d1);
  return { call, put, deltaCall: dfQ * normCdf(d1), d1, d2 };
}

/** Annual-pay bond price per 100 face */
export function bondPrice(couponRate: number, yld: number, years: number): number {
  let p = 0;
  for (let t = 1; t <= years; t += 1) p += (100 * couponRate) / (1 + yld) ** t;
  return p + 100 / (1 + yld) ** years;
}

/** Leverage path: daily-reset leverage L on an underlying with the given daily returns. Returns index levels (start 100). */
export function leveragedPath(returns: number[], leverage: number): number[] {
  const out = [100];
  for (const r of returns) out.push(out[out.length - 1] * Math.max(0, 1 + leverage * r));
  return out;
}
