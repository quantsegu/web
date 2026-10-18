import { Link } from 'react-router-dom';
import SectionHeader from '../SectionHeader';
import { SSPA_GROUPS, SSPA_GROUP_ORDER } from '../../lib/sspa';
import {
  ASSET_CLASS_Q2_2026,
  CURRENCY_Q2_2026,
  MARKET_Q2_2026,
  MONTHLY_Q2_2026,
  QUARTERS,
  SSPA_MAP_URL,
  SSPA_REPORT_SOURCE,
  SSPA_REPORT_URL,
  SSPA_SITE_URL,
  TRADE_TYPE_Q2_2026,
  TURNOVER_BY_GROUP,
  TURNOVER_OTHER,
  TURNOVER_TOTAL,
} from '../../lib/sspaReport';
import BarList from './charts/BarList';
import ChartFrame from './charts/ChartFrame';
import StackedColumns from './charts/StackedColumns';
import { BRAND_BAR, SERIES } from './charts/chartTokens';
import { SSPA_GROUP_COLOR } from './SspaDetail';
import { universeUi } from './universeUi';

const TOTAL_Q2 = TURNOVER_TOTAL[4];
const share = (v: number) => `${((v / TOTAL_Q2) * 100).toFixed(0)}%`;
const yoy = ((TURNOVER_TOTAL[4] / TURNOVER_TOTAL[0] - 1) * 100).toFixed(0);

export default function SspaSection() {
  const stacked = [
    ...SSPA_GROUP_ORDER.map((id) => ({
      key: id,
      label: SSPA_GROUPS[id].name === 'Products with additional credit risk' ? 'Additional credit risk' : SSPA_GROUPS[id].name,
      color: SSPA_GROUP_COLOR[id],
      values: [...TURNOVER_BY_GROUP[id]],
    })),
    { key: 'other', label: 'Other (derived)', color: SERIES.neutral, values: TURNOVER_OTHER },
  ];

  return (
    <section id="sspa" className={universeUi.section}>
      <div className={universeUi.container}>
        <SectionHeader
          title="Swiss structured products (SSPA)"
          subtitle="The Swiss Structured Products Association classifies retail derivatives into five families. Market data below is re-plotted from its Q2 2026 industry report."
        />

        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-center mb-10">
          {[
            { n: `CHF ${TOTAL_Q2} bn`, label: 'Q2 2026 turnover (SSPA members)' },
            { n: `+${yoy}%`, label: 'vs Q2 2025 (CHF 56.5 bn)' },
            { n: '≈75,000', label: 'products on the Swiss market, 5 families' },
          ].map((s) => (
            <div key={s.label} className={`${universeUi.panel} py-5 px-4`}>
              <p className="text-2xl font-bold text-white tabular-nums">{s.n}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <h3 className="text-white font-semibold text-lg mb-4">Product families: pricing and valuation pages</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {SSPA_GROUP_ORDER.map((id) => {
            const g = SSPA_GROUPS[id];
            return (
              <Link
                key={id}
                to={`/wealth-tools/investment-universe/${id}`}
                className={`${universeUi.card} hover:border-saffron-400/50 transition-colors`}
              >
                <p className={universeUi.cardMeta}>Category {g.mapCode}</p>
                <h4 className={`${universeUi.cardTitle} mb-2`}>{g.name}</h4>
                <p className={`${universeUi.proseMuted} mb-3`}>{g.tagline}</p>
                <p className="text-xs text-gray-500 mb-3">{g.products.map((p) => p.code).join(' · ')}</p>
                <span className="mt-auto text-saffron-300 text-sm">Pricing & valuation →</span>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="lg:col-span-2">
            <ChartFrame
              title="Quarterly turnover by product family"
              subtitle="CHF bn, SSPA member institutes. Totals above each column."
              table={{
                head: ['Quarter', ...stacked.map((s) => s.label), 'Total'],
                rows: QUARTERS.map((q, i) => [q, ...stacked.map((s) => s.values[i].toFixed(1)), TURNOVER_TOTAL[i].toFixed(1)]),
              }}
              source={SSPA_REPORT_SOURCE}
              note="“Other” is total minus the five families."
            >
              <StackedColumns categories={[...QUARTERS]} series={stacked} unit="CHF bn" ariaLabel="Stacked quarterly turnover by SSPA product family" />
            </ChartFrame>
          </div>

          <ChartFrame
            title="Q2 2026 turnover by family"
            subtitle="CHF bn and share of the quarter."
            table={{ head: ['Family', 'CHF bn', 'Share'], rows: stacked.map((s) => [s.label, s.values[4].toFixed(1), share(s.values[4])]) }}
            source={SSPA_REPORT_SOURCE}
          >
            <BarList
              rows={stacked.map((s) => ({ label: s.label, value: s.values[4], color: s.color, extra: share(s.values[4]) }))}
              ariaLabel="Q2 2026 turnover by family"
            />
          </ChartFrame>

          <ChartFrame
            title="Q2 2026 turnover by month"
            subtitle="CHF bn, rounded as published."
            table={{ head: ['Month', 'CHF bn'], rows: MONTHLY_Q2_2026.map((m) => [m.label, m.value]) }}
            source={SSPA_REPORT_SOURCE}
          >
            <BarList rows={MONTHLY_Q2_2026.map((m) => ({ ...m, color: BRAND_BAR }))} format={(v) => v.toFixed(0)} ariaLabel="Q2 2026 monthly turnover" />
          </ChartFrame>

          <ChartFrame
            title="Q2 2026 turnover by underlying asset class"
            subtitle="CHF bn."
            table={{ head: ['Asset class', 'CHF bn', 'Share'], rows: ASSET_CLASS_Q2_2026.map((a) => [a.label, a.value, share(a.value)]) }}
            source={SSPA_REPORT_SOURCE}
          >
            <BarList rows={ASSET_CLASS_Q2_2026.map((a) => ({ ...a, color: BRAND_BAR, extra: share(a.value) }))} ariaLabel="Turnover by asset class" />
          </ChartFrame>

          <ChartFrame
            title="Q2 2026 turnover by investment currency"
            subtitle="CHF bn."
            table={{ head: ['Currency', 'CHF bn', 'Share'], rows: CURRENCY_Q2_2026.map((a) => [a.label, a.value, share(a.value)]) }}
            source={SSPA_REPORT_SOURCE}
          >
            <BarList rows={CURRENCY_Q2_2026.map((a) => ({ ...a, color: SERIES.blue, extra: share(a.value) }))} ariaLabel="Turnover by currency" />
          </ChartFrame>

          <ChartFrame
            title="Listed or not, primary or secondary"
            subtitle="Q2 2026 turnover, CHF bn."
            table={{
              head: ['Split', 'CHF bn', 'Share'],
              rows: [...TRADE_TYPE_Q2_2026, ...MARKET_Q2_2026].map((a) => [a.label, a.value, share(a.value)]),
            }}
            source={SSPA_REPORT_SOURCE}
          >
            <BarList
              rows={[
                ...TRADE_TYPE_Q2_2026.map((a) => ({ ...a, color: SERIES.aqua, extra: share(a.value) })),
                ...MARKET_Q2_2026.map((a) => ({ ...a, color: SERIES.violet, extra: share(a.value) })),
              ]}
              ariaLabel="Turnover by trade type and market"
            />
          </ChartFrame>
        </div>

        <p className="text-xs text-gray-500 mt-6 max-w-3xl">
          Sources:{' '}
          <a href={SSPA_REPORT_URL} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
            SSPA Industry Report Q2 2026
          </a>
          ,{' '}
          <a href={SSPA_MAP_URL} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
            SSPA Swiss Derivative Map 2026
          </a>
          , <a href={SSPA_SITE_URL} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">sspa.ch</a>.
          Live index charts (SSPA MBRC indices) are on sspa.ch/performance and are not reproduced.
        </p>
      </div>
    </section>
  );
}
