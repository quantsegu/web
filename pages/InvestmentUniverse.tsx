import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Activity,
  Banknote,
  BarChart3,
  Bitcoin,
  Building2,
  CloudRain,
  Coins,
  Globe,
  Landmark,
  Layers,
  LineChart,
  Package,
  TrendingUp,
  Wine,
  type LucideIcon,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionHeader from '../components/SectionHeader';
import CategoryCard from '../components/investment-universe/CategoryCard';
import CategoryFilters, { type CategoryFilter } from '../components/investment-universe/CategoryFilters';
import ComparisonTable from '../components/investment-universe/ComparisonTable';
import SpectrumMap from '../components/investment-universe/SpectrumMap';
import { universeUi } from '../components/investment-universe/universeUi';
import {
  INVESTMENT_CATEGORIES,
  PORTFOLIO_GROUPS,
  RISK_WARNINGS,
  SUITABILITY_GOALS,
} from '../lib/investmentUniverse';

const ICONS: Record<string, LucideIcon> = {
  'global-equities': Globe,
  fx: TrendingUp,
  'fixed-income': Landmark,
  cash: Banknote,
  'precious-metals': Coins,
  commodities: Package,
  derivatives: LineChart,
  'real-estate': Building2,
  infrastructure: Activity,
  'private-markets': Layers,
  whisky: Wine,
  wine: Wine,
  'vsop-spirits': Wine,
  collectibles: Package,
  weather: CloudRain,
  crypto: Bitcoin,
};

const COLLECTIBLE_IDS = new Set(['whisky', 'wine', 'vsop-spirits', 'collectibles']);

const SECTION_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'asset-class', label: 'Asset classes' },
  { id: 'categories', label: 'Categories' },
  { id: 'comparison', label: 'Compare' },
  { id: 'deep-dives', label: 'Deep dives' },
  { id: 'portfolio', label: 'Portfolio roles' },
  { id: 'suitability', label: 'Suitability' },
  { id: 'maps', label: 'Maps' },
  { id: 'warnings', label: 'Risks' },
];

function filterCategories(filter: CategoryFilter) {
  if (filter === 'all') return INVESTMENT_CATEGORIES;
  if (filter === 'traditional') return INVESTMENT_CATEGORIES.filter((c) => c.group === 'traditional');
  if (filter === 'alternative') return INVESTMENT_CATEGORIES.filter((c) => c.group === 'alternative');
  if (filter === 'niche') return INVESTMENT_CATEGORIES.filter((c) => c.group === 'niche');
  if (filter === 'core') return INVESTMENT_CATEGORIES.filter((c) => c.portfolioRole === 'Core');
  return INVESTMENT_CATEGORIES.filter((c) => COLLECTIBLE_IDS.has(c.id));
}

/** Required + adjacent categories for deep dives (required set highlighted in copy) */
const DEEP_DIVE_IDS = [
  'global-equities',
  'fx',
  'fixed-income',
  'precious-metals',
  'derivatives',
  'whisky',
  'weather',
  'wine',
  'vsop-spirits',
  'crypto',
];

export default function InvestmentUniverse() {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const filtered = useMemo(() => filterCategories(filter), [filter]);

  return (
    <div className={universeUi.page}>
      <Navbar />

      {/* Hero */}
      <header className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 border-b border-saffron-800/25">
        <div className={`${universeUi.container} max-w-4xl`}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-saffron-400 text-xs font-semibold tracking-widest uppercase mb-3">
              <Link to="/wealth-tools" className="hover:text-saffron-200 transition-colors">
                Wealth Tools
              </Link>
              <span className="text-gray-500 mx-2" aria-hidden="true">/</span>
              Reference · education
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              The Investment Universe
            </h1>
            <p className="text-saffron-100 text-lg max-w-2xl mb-3">
              A structured comparison of traditional markets, alternative assets, and niche exposures—for investors
              who want clarity before allocating capital.
            </p>
            <p className="text-gray-400 text-sm max-w-2xl">
              Calm, analytical reference material. No return promises. Not personal advice.
            </p>
            <div className="section-divider !w-32 !mt-6 !mx-0" />
          </motion.div>
        </div>
      </header>

      {/* Sticky section nav */}
      <nav
        className="sticky top-16 z-40 bg-bjp-navy/95 backdrop-blur-md border-b border-saffron-500/15 overflow-x-auto"
        aria-label="Page sections"
      >
        <ul className="flex gap-1 px-4 sm:px-6 lg:px-8 py-2 max-w-7xl mx-auto text-xs sm:text-sm">
          {SECTION_NAV.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="block px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-saffron-500/10 transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="overview" className={universeUi.section}>
        <div className={universeUi.container}>
          <SectionHeader
            title="What this page covers"
            subtitle="Sixteen asset types—from global equities to weather-linked instruments—compared on role, liquidity, and complexity."
          />
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-center">
            {[
              { n: '16', label: 'Categories mapped' },
              { n: '4', label: 'Spectrum views' },
              { n: '7', label: 'Suitability lenses' },
            ].map((stat) => (
              <div key={stat.label} className={universeUi.panel + ' py-6 px-4'}>
                <p className="text-2xl font-bold text-white tabular-nums">{stat.n}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="asset-class" className={universeUi.sectionAlt}>
        <div className={universeUi.container}>
          <SectionHeader
            title="What is an asset class?"
            subtitle="A category of investments that share similar behaviour, risk factors, and economic drivers."
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className={universeUi.panel + ' p-6'}>
              <h3 className="text-white font-semibold mb-2">Traditional assets</h3>
              <p className={universeUi.prose}>
                Listed equities, bonds, cash, commodities, and mainstream property accessed via public markets. Deep
                liquidity, established regulation, and decades of research.
              </p>
            </div>
            <div className={universeUi.panel + ' p-6'}>
              <h3 className="text-white font-semibold mb-2">Alternative assets</h3>
              <p className={universeUi.prose}>
                Private markets, direct real estate, infrastructure funds, and other less liquid structures. Often
                accessed via lock-up funds with higher minimums and complexity.
              </p>
            </div>
            <div className={universeUi.panel + ' p-6'}>
              <h3 className="text-white font-semibold mb-2">Why behaviour differs</h3>
              <p className={universeUi.prose}>
                Cash-flow profile, sensitivity to rates and growth, liquidity, leverage, and valuation method all
                change how an asset performs across cycles—no single “market beta” applies everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className={universeUi.section}>
        <div className={universeUi.container}>
          <SectionHeader
            title="Investment category cards"
            subtitle="Filter by type. Each card summarises definition, mechanics, risks, and portfolio role."
          />
          <CategoryFilters active={filter} onChange={setFilter} />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((cat) => {
              const Icon = ICONS[cat.id] ?? BarChart3;
              return (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  icon={<Icon size={20} aria-hidden />}
                />
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8">No categories match this filter.</p>
          )}
        </div>
      </section>

      <section id="comparison" className={universeUi.sectionAlt}>
        <div className={universeUi.container}>
          <SectionHeader
            title="Comparison table"
            subtitle="Scroll horizontally on smaller screens. Tax column is indicative—confirm with your adviser."
          />
          <ComparisonTable categories={INVESTMENT_CATEGORIES} />
        </div>
      </section>

      <section id="deep-dives" className={universeUi.section}>
        <div className={universeUi.container}>
          <SectionHeader
            title="Deep dives"
            subtitle="Focused notes on each mandated category plus context for adjacent types in the table above."
          />
          <div className="space-y-10 max-w-4xl mx-auto">
            {INVESTMENT_CATEGORIES.filter((c) => DEEP_DIVE_IDS.includes(c.id)).map((cat, i) => {
              const Icon = ICONS[cat.id] ?? BarChart3;
              return (
                <motion.article
                  key={cat.id}
                  id={`dive-${cat.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  viewport={{ once: true, margin: '-40px' }}
                  className={universeUi.panel + ' p-6 sm:p-8 scroll-mt-28'}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-saffron-500 to-bjp-green flex items-center justify-center text-white">
                      <Icon size={22} aria-hidden />
                    </div>
                    <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                  </div>
                  {cat.deepDive.map((para, pi) => (
                    <p key={pi} className={`${universeUi.prose} mb-3 last:mb-0`}>
                      {para}
                    </p>
                  ))}
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="portfolio" className={universeUi.sectionAlt}>
        <div className={universeUi.container}>
          <SectionHeader
            title="Portfolio construction lens"
            subtitle="How different assets typically fit—or do not fit—a disciplined allocation framework."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PORTFOLIO_GROUPS.map((group) => (
              <div key={group.id} className={universeUi.card}>
                <h3 className={universeUi.cardTitle}>{group.title}</h3>
                <p className={`${universeUi.proseMuted} mt-2 mb-4`}>{group.description}</p>
                <ul className="space-y-1.5 mt-auto">
                  {group.categoryIds.map((cid) => {
                    const cat = INVESTMENT_CATEGORIES.find((c) => c.id === cid);
                    return (
                      <li key={cid}>
                        <a href={`#${cid}`} className="text-saffron-300 hover:text-white text-sm transition-colors">
                          {cat?.name ?? cid}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="suitability" className={universeUi.section}>
        <div className={universeUi.container}>
          <SectionHeader
            title="Suitability framework"
            subtitle="Match goals to asset types—then size satellites relative to core holdings."
          />
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {SUITABILITY_GOALS.map((goal) => (
              <div key={goal.id} className={universeUi.panel + ' p-6'}>
                <h3 className="text-white font-semibold text-lg mb-1">{goal.title}</h3>
                <p className={universeUi.proseMuted + ' mb-4'}>{goal.description}</p>
                <p className={universeUi.label}>Often aligned</p>
                <ul className="flex flex-wrap gap-2 mb-3">
                  {goal.fit.map((id) => {
                    const cat = INVESTMENT_CATEGORIES.find((c) => c.id === id);
                    return (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          className="text-xs text-bjp-green-light hover:text-white border border-bjp-green/30 rounded px-2 py-0.5"
                        >
                          {cat?.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <p className={universeUi.label}>Use caution</p>
                <ul className="flex flex-wrap gap-2">
                  {goal.caution.map((label) => (
                    <li
                      key={label}
                      className="text-xs text-gray-400 border border-saffron-500/20 rounded px-2 py-0.5"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="maps" className={universeUi.sectionAlt}>
        <div className={universeUi.container}>
          <SectionHeader
            title="Visual maps"
            subtitle="Relative positioning (0–100 scores) for pattern recognition—not precise forecasts."
          />
          <div className="grid lg:grid-cols-2 gap-6">
            <SpectrumMap
              title="Risk vs liquidity"
              subtitle="Higher right = more liquid; higher up = higher modelled risk."
              xLabel="Liquidity"
              yLabel="Risk"
              categories={INVESTMENT_CATEGORIES}
              getX={(c) => c.liquidityScore}
              getY={(c) => c.risk}
            />
            <SpectrumMap
              title="Core vs alternative spectrum"
              subtitle="Left = closer to core portfolio; right = more alternative/niche."
              xLabel="Alternative / niche"
              yLabel="Risk"
              categories={INVESTMENT_CATEGORIES}
              getX={(c) => c.alternativeScore}
              getY={(c) => c.risk}
            />
            <SpectrumMap
              title="Income vs growth orientation"
              subtitle="Horizontal axis: growth score; vertical: income score."
              xLabel="Growth"
              yLabel="Income"
              categories={INVESTMENT_CATEGORIES}
              getX={(c) => c.growth}
              getY={(c) => c.income}
            />
            <SpectrumMap
              title="Complexity vs accessibility"
              subtitle="Upper right = harder for typical investors to access safely."
              xLabel="Accessibility"
              yLabel="Complexity"
              categories={INVESTMENT_CATEGORIES}
              getX={(c) => c.accessibilityScore}
              getY={(c) => c.complexityScore}
            />
          </div>
        </div>
      </section>

      <section id="warnings" className={universeUi.section}>
        <div className={universeUi.container}>
          <SectionHeader title="Important warnings" subtitle="Common failure modes across alternatives and niches." />
          <div className="grid sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {RISK_WARNINGS.map((w) => (
              <div key={w.title} className={universeUi.panel + ' p-5 border-l-2 border-red-400/50'}>
                <h3 className="text-white font-semibold text-sm mb-2">{w.title}</h3>
                <p className={universeUi.proseMuted}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={universeUi.sectionAlt}>
        <div className={`${universeUi.container} max-w-3xl`}>
          <div className={universeUi.ctaCard}>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Next steps</h2>
            <p className={universeUi.proseMuted + ' mb-6'}>
              Turn this reference into action: map your current holdings to roles, stress-test concentration, and
              align satellites with written policy limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <Link to="/wealth-tools/portfolio-efficiency-scorecard" className="btn-primary text-sm">
                Compare your portfolio efficiency
              </Link>
              <Link to="/wealth-tools" className="btn-primary text-sm !from-bjp-navy-light !to-bjp-navy !border border-saffron-500/30">
                Build allocation with Wealth Tools
              </Link>
              <a href="/#contact" className="text-saffron-300 hover:text-white text-sm font-medium py-3 px-4 transition-colors">
                Request a tailored investment-structure review
              </a>
            </div>
          </div>

          <div className={`${universeUi.panel} p-6 mt-10`}>
            <h3 className="text-white font-semibold mb-2">Methodology & disclaimer</h3>
            <p className={universeUi.proseMuted + ' mb-2'}>
              Category scores on spectrum charts are illustrative ordinal scales for comparison within this page—not
              derived from live market data. Liquidity, volatility, and role labels summarise typical characteristics;
              individual securities and funds vary widely.
            </p>
            <p className={universeUi.proseMuted}>
              This material is educational and general in nature. It does not constitute investment, legal, or tax
              advice, and does not recommend any specific product or strategy. Past patterns do not guarantee future
              results. Consult qualified professionals before making allocation decisions.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
