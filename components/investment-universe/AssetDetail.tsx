import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { INVESTMENT_CATEGORIES, type InvestmentCategory } from '../../lib/investmentUniverse';
import { PRICING_DETAILS, PROFILE_LABELS, type CategoryId } from '../../lib/investmentPricing';
import BarList from './charts/BarList';
import ChartFrame from './charts/ChartFrame';
import { BRAND_BAR, SERIES } from './charts/chartTokens';
import { Disclaimer, DetailSection, JumpNav, RedFlags, WorkedExampleCard } from './DetailBits';
import { roleBadgeClass, universeUi } from './universeUi';

const NAV = [
  { id: 'pricing', label: 'Pricing' },
  { id: 'charts', label: 'Charts' },
  { id: 'valuation', label: 'Valuation strategies' },
  { id: 'example', label: 'Worked example' },
  { id: 'red-flags', label: 'Red flags' },
];

export default function AssetDetail({ category }: { category: InvestmentCategory }) {
  const detail = PRICING_DETAILS[category.id as CategoryId];
  const idx = INVESTMENT_CATEGORIES.findIndex((c) => c.id === category.id);
  const prev = INVESTMENT_CATEGORIES[(idx - 1 + INVESTMENT_CATEGORIES.length) % INVESTMENT_CATEGORIES.length];
  const next = INVESTMENT_CATEGORIES[(idx + 1) % INVESTMENT_CATEGORIES.length];

  const profileRows = (Object.keys(PROFILE_LABELS) as (keyof typeof PROFILE_LABELS)[]).map((k) => ({
    label: `${PROFILE_LABELS[k].label} (${PROFILE_LABELS[k].hint})`,
    value: detail.profile[k],
  }));
  const fitRows = [...detail.strategies].sort((a, b) => b.fit - a.fit).map((s) => ({ label: s.name, value: s.fit }));
  const placement = [
    { label: 'Modelled risk', value: category.risk },
    { label: 'Liquidity', value: category.liquidityScore },
    { label: 'Growth orientation', value: category.growth },
    { label: 'Income orientation', value: category.income },
    { label: 'Complexity', value: category.complexityScore },
    { label: 'Accessibility', value: category.accessibilityScore },
  ];

  return (
    <>
      <header className="relative pt-24 pb-10 px-4 sm:px-6 lg:px-8 border-b border-saffron-800/25">
        <div className={`${universeUi.container} max-w-4xl`}>
          <p className="text-saffron-400 text-xs font-semibold tracking-widest uppercase mb-3">
            <Link to="/wealth-tools/investment-universe" className="hover:text-saffron-200 inline-flex items-center gap-1">
              <ArrowLeft size={12} aria-hidden /> Investment Universe
            </Link>
            <span className="text-gray-500 mx-2" aria-hidden="true">/</span>
            Pricing & valuation
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">{category.name}</h1>
          <p className="text-saffron-100 text-lg max-w-2xl mb-4">{detail.headline}</p>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`${universeUi.badge} ${roleBadgeClass[category.portfolioRole]}`}>{category.portfolioRole}</span>
            <span className={`${universeUi.chip} ${universeUi.chipIdle}`}>Liquidity: {category.liquidity}</span>
            <span className={`${universeUi.chip} ${universeUi.chipIdle}`}>Valuation difficulty: {category.valuationDifficulty}</span>
          </div>
        </div>
      </header>
      <JumpNav items={NAV} />

      <div className={`${universeUi.container} max-w-5xl px-4 sm:px-6 lg:px-8 pb-16`}>
        <DetailSection id="pricing" title="How the price is formed" intro={detail.priceFormation}>
          <div className="grid md:grid-cols-2 gap-5">
            <div className={`${universeUi.panel} p-5`}>
              <p className={universeUi.label}>Quoted as</p>
              <p className={`${universeUi.value} mt-1 mb-4`}>{detail.quotedAs}</p>
              <p className={universeUi.label}>Where prices come from</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-300 list-disc list-inside">
                {detail.priceSources.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className={`${universeUi.panel} p-5`}>
              <p className={universeUi.label}>Costs and frictions between quote and your outcome</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-300 list-disc list-inside">
                {detail.frictions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <h3 className="text-white font-semibold mt-6 mb-3">What moves the price</h3>
          <dl className="grid sm:grid-cols-2 gap-3">
            {detail.drivers.map((d) => (
              <div key={d.name} className={`${universeUi.panel} p-4`}>
                <dt className="text-white text-sm font-semibold">{d.name}</dt>
                <dd className={`${universeUi.proseMuted} mt-1`}>{d.effect}</dd>
              </div>
            ))}
          </dl>
        </DetailSection>

        <DetailSection
          id="charts"
          title="Charts"
          intro="Editorial 1–5 scores and 0–100 positions for comparison. They are judgements, not market data."
        >
          <div className="grid lg:grid-cols-2 gap-5">
            <ChartFrame
              title="Price discovery profile"
              subtitle="How visible, frequent, model-driven and costly the price is."
              table={{ head: ['Dimension', 'Score (1–5)'], rows: profileRows.map((r) => [r.label, r.value]) }}
              note="Editorial scores."
            >
              <BarList rows={profileRows.map((r) => ({ ...r, color: BRAND_BAR }))} max={5} format={(v) => `${v}/5`} ariaLabel="Price discovery profile" />
            </ChartFrame>
            <ChartFrame
              title="Which valuation methods fit"
              subtitle="Sorted by how well each method suits this asset (5 = strong)."
              table={{ head: ['Method', 'Fit (1–5)'], rows: fitRows.map((r) => [r.label, r.value]) }}
              note="Editorial scores."
            >
              <BarList rows={fitRows.map((r) => ({ ...r, color: SERIES.aqua }))} max={5} format={(v) => `${v}/5`} ariaLabel="Valuation method fit" />
            </ChartFrame>
            <div className="lg:col-span-2">
              <ChartFrame
                title={`Where ${category.name.toLowerCase()} sits in the universe`}
                subtitle="Relative 0–100 positions used on the main page's maps."
                table={{ head: ['Measure', 'Score (0–100)'], rows: placement.map((r) => [r.label, r.value]) }}
                note="Illustrative ordinal scores, not live data."
              >
                <BarList rows={placement.map((r) => ({ ...r, color: SERIES.blue }))} max={100} format={(v) => String(v)} ariaLabel="Position scores" />
              </ChartFrame>
            </div>
          </div>
        </DetailSection>

        <DetailSection
          id="valuation"
          title="Valuation strategies"
          intro={`Valuation difficulty for this asset: ${category.valuationDifficulty}. Use more than one method and look at the range.`}
        >
          <div className="grid md:grid-cols-2 gap-4">
            {detail.strategies.map((s) => (
              <article key={s.name} className={`${universeUi.card} !h-auto`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-white font-semibold">{s.name}</h3>
                  <span className="text-xs text-saffron-300 tabular-nums shrink-0">fit {s.fit}/5</span>
                </div>
                <p className={`${universeUi.prose} mb-3`}>{s.how}</p>
                <p className="text-sm text-gray-300">
                  <span className={universeUi.label}>Best for </span>
                  {s.bestFor}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  <span className={universeUi.label}>Watch out </span>
                  {s.watchOut}
                </p>
              </article>
            ))}
          </div>
        </DetailSection>

        <DetailSection id="example" title="Worked example">
          {detail.example ? (
            <WorkedExampleCard example={detail.example()} />
          ) : (
            <div className={`${universeUi.panel} p-5`}>
              <p className={universeUi.prose}>
                No closed-form example is shown here: this asset has no cash-flow or arbitrage formula that gives a sound number.
                That is the point. Pricing relies on comparables, indices and the cost-of-holding check above, and the honest
                answer is a range with fees deducted.
              </p>
            </div>
          )}
        </DetailSection>

        <DetailSection id="red-flags" title="Red flags in pricing and valuation">
          <RedFlags items={detail.redFlags} />
        </DetailSection>

        {category.id === 'derivatives' && (
          <DetailSection
            id="sspa"
            title="Structured products on the SSPA map"
            intro="Retail derivatives in Switzerland are classified by the Swiss Structured Products Association. Each family has its own pricing and valuation page."
          >
            <div className="flex flex-wrap gap-2">
              {['capital-protection', 'yield-enhancement', 'participation', 'leverage', 'credit-risk'].map((id) => (
                <Link key={id} to={`/wealth-tools/investment-universe/${id}`} className={`${universeUi.chip} ${universeUi.chipIdle}`}>
                  {id.replace('-', ' ')}
                </Link>
              ))}
            </div>
          </DetailSection>
        )}

        <nav className="grid sm:grid-cols-2 gap-4 mt-6" aria-label="Neighbouring assets">
          {[prev, next].map((c, i) => (
            <Link
              key={c.id}
              to={`/wealth-tools/investment-universe/${c.id}`}
              className={`${universeUi.panel} p-4 hover:border-saffron-400/50 transition-colors ${i === 1 ? 'text-right' : ''}`}
            >
              <p className={universeUi.label}>{i === 0 ? 'Previous' : 'Next'}</p>
              <p className="text-white font-semibold inline-flex items-center gap-2">
                {i === 0 && <ArrowLeft size={14} aria-hidden />}
                {c.name}
                {i === 1 && <ArrowRight size={14} aria-hidden />}
              </p>
            </Link>
          ))}
        </nav>
        <Disclaimer />
      </div>
    </>
  );
}
