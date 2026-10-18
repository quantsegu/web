import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  SSPA_GROUPS,
  SSPA_GROUP_ORDER,
  choppyReturns,
  type SspaGroup,
} from '../../lib/sspa';
import { leveragedPath } from '../../lib/pricingMath';
import {
  GROUP_FACTS_Q2_2026,
  PRODUCT_TYPE_Q2_2026,
  QUARTERS,
  SSPA_MAP_URL,
  SSPA_REPORT_SOURCE,
  SSPA_REPORT_URL,
  TURNOVER_BY_GROUP,
  TURNOVER_TOTAL,
} from '../../lib/sspaReport';
import BarList from './charts/BarList';
import ChartFrame from './charts/ChartFrame';
import LineChart from './charts/LineChart';
import PayoffChart from './charts/PayoffChart';
import { SERIES } from './charts/chartTokens';
import { Disclaimer, DetailSection, JumpNav, RedFlags, WorkedExampleCard } from './DetailBits';
import { universeUi } from './universeUi';

export const SSPA_GROUP_COLOR: Record<string, string> = {
  'capital-protection': SERIES.blue,
  'yield-enhancement': SERIES.orange,
  participation: SERIES.aqua,
  leverage: SERIES.yellow,
  'credit-risk': SERIES.magenta,
};

function ConstantLeverageChart() {
  const days = 20;
  const returns = choppyReturns(days, 0.02);
  const base = leveragedPath(returns, 1);
  const lev = leveragedPath(returns, 5);
  return (
    <ChartFrame
      title="Constant leverage in a choppy market"
      subtitle="Hypothetical path: the underlying alternates +2% and −2% each day. Daily reset compounds the swings."
      table={{
        head: ['Day', 'Underlying (1x)', '5x daily-reset'],
        rows: base.map((v, i) => [i, v.toFixed(1), lev[i].toFixed(1)]),
      }}
      note="Computed from the stated hypothetical path; not market data."
    >
      <LineChart
        xLabel="trading days"
        ariaLabel="Underlying versus a 5x daily-reset product over twenty choppy days"
        series={[
          { label: 'Underlying (1x)', color: SERIES.blue, values: base },
          { label: '5x daily-reset long', color: SERIES.orange, values: lev },
        ]}
      />
    </ChartFrame>
  );
}

function CreditScenarioChart() {
  const coupon = 4.5;
  const recovery = 40;
  const rows = [
    { label: 'No credit event: nominal + coupon', value: 100 + coupon, color: SERIES.aqua },
    { label: 'Credit event: recovery value (assumed 40%)', value: recovery, color: SERIES.magenta },
  ];
  return (
    <ChartFrame
      title="Credit-linked note: two outcomes"
      subtitle="Redemption per 100 nominal for a 1-year note with a 4.5% coupon."
      table={{ head: ['Scenario', 'Redemption'], rows: rows.map((r) => [r.label, r.value]) }}
      note="Hypothetical coupon and recovery. Real recovery can be far lower or higher, and the issuer's own default risk sits on top."
    >
      <BarList rows={rows} max={110} format={(v) => v.toFixed(1)} ariaLabel="Credit-linked note scenarios" />
    </ChartFrame>
  );
}

export default function SspaDetail({ group }: { group: SspaGroup }) {
  const idx = SSPA_GROUP_ORDER.indexOf(group.id);
  const prev = SSPA_GROUPS[SSPA_GROUP_ORDER[(idx - 1 + SSPA_GROUP_ORDER.length) % SSPA_GROUP_ORDER.length]];
  const next = SSPA_GROUPS[SSPA_GROUP_ORDER[(idx + 1) % SSPA_GROUP_ORDER.length]];
  const color = SSPA_GROUP_COLOR[group.id];
  const series = TURNOVER_BY_GROUP[group.id];
  const facts = GROUP_FACTS_Q2_2026[group.id];
  const typeRows = PRODUCT_TYPE_Q2_2026[group.id];

  const nav = [
    { id: 'overview', label: 'Overview' },
    { id: 'market', label: 'Market charts' },
    { id: 'products', label: 'Product types' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'valuation', label: 'Valuation strategies' },
    ...(group.example ? [{ id: 'example', label: 'Worked example' }] : []),
    { id: 'red-flags', label: 'Red flags' },
  ];

  return (
    <>
      <header className="relative pt-24 pb-10 px-4 sm:px-6 lg:px-8 border-b border-saffron-800/25">
        <div className={`${universeUi.container} max-w-4xl`}>
          <p className="text-saffron-400 text-xs font-semibold tracking-widest uppercase mb-3">
            <Link to="/wealth-tools/investment-universe#sspa" className="hover:text-saffron-200 inline-flex items-center gap-1">
              <ArrowLeft size={12} aria-hidden /> Investment Universe
            </Link>
            <span className="text-gray-500 mx-2" aria-hidden="true">/</span>
            SSPA structured products · category {group.mapCode}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">{group.name}</h1>
          <p className="text-saffron-100 text-lg max-w-2xl">{group.tagline}</p>
        </div>
      </header>
      <JumpNav items={nav} />

      <div className={`${universeUi.container} max-w-5xl px-4 sm:px-6 lg:px-8 pb-16`}>
        <DetailSection id="overview" title="What it is" intro={group.overview}>
          <div className={`${universeUi.panel} p-5`}>
            <p className={universeUi.label}>Building blocks</p>
            <p className={`${universeUi.value} mt-1`}>{group.buildingBlocks}</p>
          </div>
          {facts && (
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { k: 'Q2 2026 turnover', v: `CHF ${facts.turnover} bn (${facts.share})` },
                { k: 'Main asset class', v: `${facts.assetClass} (${facts.assetShare})` },
                { k: 'Main currency', v: `${facts.currency} (${facts.currencyShare})` },
                { k: 'Trading', v: `${facts.listed}, ${facts.market}` },
              ].map((t) => (
                <div key={t.k} className={`${universeUi.panel} p-4`}>
                  <dt className={universeUi.label}>{t.k}</dt>
                  <dd className="text-white text-sm font-semibold mt-1">{t.v}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="text-xs text-gray-500 mt-2">Source: {SSPA_REPORT_SOURCE}.</p>
        </DetailSection>

        <DetailSection id="market" title="Market charts" intro="How much of this family is traded in Switzerland, and in which product types.">
          <div className="grid lg:grid-cols-2 gap-5">
            <ChartFrame
              title={`${group.name}: quarterly turnover`}
              subtitle="CHF bn, member institutes of the SSPA."
              table={{
                head: ['Quarter', 'Group turnover (CHF bn)', 'All products (CHF bn)'],
                rows: QUARTERS.map((q, i) => [q, series[i], TURNOVER_TOTAL[i]]),
              }}
              source={SSPA_REPORT_SOURCE}
            >
              <BarList
                rows={QUARTERS.map((q, i) => ({ label: q, value: series[i], color: color }))}
                format={(v) => v.toFixed(1)}
                ariaLabel={`${group.name} quarterly turnover`}
              />
            </ChartFrame>
            <ChartFrame
              title="Q2 2026 turnover by product type"
              subtitle="CHF bn. Codes are SSPA Swiss Derivative Map codes."
              table={{ head: ['Code', 'Product type', 'CHF bn'], rows: typeRows.map((t) => [t.code, t.label, t.value]) }}
              source={SSPA_REPORT_SOURCE}
              note="Rounded to the report's precision; small values show as 0.0."
            >
              <BarList
                rows={typeRows.map((t) => ({ label: `${t.code} ${t.label}`, value: t.value, color: color }))}
                format={(v) => (v < 0.1 && v > 0 ? v.toFixed(2) : v.toFixed(1))}
                ariaLabel={`${group.name} turnover by product type`}
              />
            </ChartFrame>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Full report:{' '}
            <a href={SSPA_REPORT_URL} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
              SSPA Industry Report Q2 2026 (PDF)
            </a>
            .
          </p>
        </DetailSection>

        <DetailSection
          id="products"
          title="Product types"
          intro="Payoff diagrams are drawn here from simple formulas with hypothetical parameters. They show the typical shape at maturity, not a specific product. For the official classification see the SSPA Swiss Derivative Map."
        >
          <div className="space-y-6">
            {group.products.map((p) => (
              <article key={p.code} id={`p-${p.code}`} className={`${universeUi.panel} p-5 sm:p-6 scroll-mt-32`}>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded border border-saffron-500/30 text-saffron-300">{p.code}</span>
                  <h3 className="text-white font-semibold text-lg">{p.name}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">Market view: {p.expectation}</p>
                <div className={p.payoff ? 'grid md:grid-cols-2 gap-6' : ''}>
                  {p.payoff && (
                    <div>
                      <PayoffChart
                        fn={p.payoff.fn}
                        yDomain={p.payoff.yDomain}
                        yLabel={p.payoff.yLabel}
                        marks={p.payoff.marks}
                        showDirect={p.payoff.showDirect}
                        color={color}
                        ariaLabel={`Payoff at maturity for ${p.name}`}
                      />
                      <p className="text-[0.7rem] text-gray-500 mt-1">
                        Hypothetical: {p.payoff.params}.
                        {p.payoff.pathDependent && ' Path dependent: the diagram assumes the barrier was not touched where relevant.'}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className={universeUi.label}>Key traits</p>
                    <ul className="mt-1.5 mb-3 space-y-1 text-sm text-gray-300 list-disc list-inside">
                      {p.keyTraits.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-300">
                      <span className={universeUi.label}>Built from </span>
                      {p.builtFrom}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      <span className={universeUi.label}>Price drivers </span>
                      {p.priceDrivers}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {group.id === 'leverage' && (
            <div className="mt-6">
              <ConstantLeverageChart />
            </div>
          )}
          {group.id === 'credit-risk' && (
            <div className="mt-6">
              <CreditScenarioChart />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-4">
            Classification and terminology: SSPA Swiss Derivative Map, January 2026 edition (©{' '}
            <a href={SSPA_MAP_URL} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
              SSPA
            </a>
            ). Descriptions are paraphrased.
          </p>
        </DetailSection>

        <DetailSection id="pricing" title="How these products are priced">
          <div className="grid md:grid-cols-2 gap-4">
            {group.pricing.map((p) => (
              <div key={p.title} className={`${universeUi.panel} p-5`}>
                <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                <p className={universeUi.proseMuted}>{p.body}</p>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection id="valuation" title="Valuation strategies" intro="Ways to judge whether the price and the structure are reasonable, and where each method breaks.">
          <div className="grid md:grid-cols-2 gap-4">
            {group.strategies.map((s) => (
              <article key={s.name} className={`${universeUi.card} !h-auto`}>
                <h3 className="text-white font-semibold mb-2">{s.name}</h3>
                <p className={`${universeUi.prose} mb-3`}>{s.how}</p>
                <p className="text-sm text-gray-400">
                  <span className={universeUi.label}>Watch out </span>
                  {s.watchOut}
                </p>
              </article>
            ))}
          </div>
        </DetailSection>

        {group.example && (
          <DetailSection id="example" title="Worked example">
            <WorkedExampleCard example={group.example()} />
          </DetailSection>
        )}

        <DetailSection id="red-flags" title="Red flags">
          <RedFlags items={group.redFlags} />
        </DetailSection>

        <nav className="grid sm:grid-cols-2 gap-4 mt-6" aria-label="Neighbouring families">
          {[prev, next].map((g, i) => (
            <Link
              key={g.id}
              to={`/wealth-tools/investment-universe/${g.id}`}
              className={`${universeUi.panel} p-4 hover:border-saffron-400/50 transition-colors ${i === 1 ? 'text-right' : ''}`}
            >
              <p className={universeUi.label}>{i === 0 ? 'Previous family' : 'Next family'}</p>
              <p className="text-white font-semibold inline-flex items-center gap-2">
                {i === 0 && <ArrowLeft size={14} aria-hidden />}
                {g.name}
                {i === 1 && <ArrowRight size={14} aria-hidden />}
              </p>
            </Link>
          ))}
        </nav>
        <Disclaimer>
          <p className={`${universeUi.proseMuted} mb-2`}>
            The Swiss Derivative Map is the SSPA's copyright and is not reproduced here: product names, codes and ideas are
            referenced, descriptions are paraphrased, and the payoff drawings are our own. Turnover figures are re-plotted from
            the SSPA Industry Report, which permits quotes with attribution. Structured products carry issuer credit risk and
            can lose money.
          </p>
        </Disclaimer>
      </div>
    </>
  );
}
