export interface WealthTool {
  id: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  icon: 'retirement' | 'portfolio' | 'tax' | 'mortgage' | 'globe' | 'universe';
  ctaLabel?: string;
}

export const wealthTools: WealthTool[] = [
  {
    id: 'investment-universe',
    title: 'The Investment Universe',
    description:
      'Structured reference comparing traditional markets, alternatives, and niche exposures—liquidity, volatility, portfolio roles, and suitability maps before you allocate capital.',
    features: [
      'Asset-class spectrum and category comparison tables',
      'Filters for traditional, alternative, niche, and collectible sleeves',
      'Deep dives on equities, FX, metals, derivatives, weather, wine, crypto',
      'Portfolio role groupings and suitability goal mapping',
      'Educational only—not product recommendations or advice',
    ],
    href: '/wealth-tools/investment-universe',
    icon: 'universe',
    ctaLabel: 'Explore universe',
  },
  {
    id: 'retirement-income-planner',
    title: 'Retirement Income Planner',
    description:
      'Model whether an equity-heavy portfolio can reach your target passive income. Adjust age, savings, returns, inflation, and withdrawal rate with monthly compounding, scenario presets, and sensitivity charts.',
    features: [
      'Monthly compounding with tax and fee drag',
      'Conservative, base, and equity-heavy scenarios',
      'Solve for monthly savings or sustainable income',
      'Growth charts, sensitivity grid, and CSV export',
      'Nominal vs real values and shareable URL state',
    ],
    href: '/wealth-tools/retirement-income-planner',
    icon: 'retirement',
    ctaLabel: 'Open planner',
  },
  {
    id: 'tax-drag-calculator',
    title: 'Tax Drag Calculator',
    description:
      'See how dividends, wealth tax, and capital-gains treatment erode long-term compounding. Compare low-tax vs high-tax profiles and country-style assumptions side by side.',
    features: [
      'Gross vs net portfolio projection over decades',
      'Dividend, Box 3–style wealth, and CG tax inputs',
      'Cumulative tax paid and compounding lost',
      'Low-tax, high-tax, NL, and Switzerland presets',
      'Chart-led explanation with custom analysis CTA',
    ],
    href: '/wealth-tools/tax-drag-calculator',
    icon: 'tax',
    ctaLabel: 'Open calculator',
  },
  {
    id: 'wealth-preservation-planner',
    title: 'Wealth Preservation Planner',
    description:
      'Model net worth, tax drag, pensions, and real-estate equity across Switzerland and the Netherlands. Compare staying, relocating, or moving later with yearly projections and CSV export.',
    features: [
      'Salary, portfolio, CH pillars, and NL pension pots',
      'Property equity, rental income, and simplified tax rules',
      'Switzerland, Netherlands, stay, and move-later scenarios',
      'Net worth, tax drag, asset mix, and retirement income charts',
      'Nominal vs real values and EUR/CHF display toggle',
    ],
    href: '/wealth-tools/wealth-preservation-planner.html',
    icon: 'portfolio',
    ctaLabel: 'Open planner',
  },
  {
    id: 'portfolio-efficiency-scorecard',
    title: 'Portfolio Efficiency Scorecard',
    description:
      'Interactive diagnostic that scores portfolio efficiency out of 100, surfaces return leaks (fees, cash, concentration, tax, diversification, rebalancing, goal mismatch), and suggests priority fixes.',
    features: [
      'Seven-category weighted audit with meters and leak chart',
      'Fee, cash, holdings, geographic, tax, and rebalancing inputs',
      'Goal vs allocation fit with time horizon and income target',
      'Risk flags, personalized recommendations, and uplift estimate',
      'Efficient, typical, leaky, and pre-retirement presets',
    ],
    href: '/wealth-tools/portfolio-efficiency-scorecard',
    icon: 'portfolio',
    ctaLabel: 'Run scorecard',
  },
  {
    id: 'additional-mortgage-capacity',
    title: 'Additional Mortgage Capacity',
    description:
      'If you can afford X more per month, how much extra mortgage can you borrow at Y% for Z years? Reverse mode solves the payment for a target loan. Includes stress-test comparison and amortization charts.',
    features: [
      'Payment → loan capacity with standard amortizing formula',
      'Reverse mode: loan amount → required payment',
      'Monthly, bi-weekly, weekly, quarterly, and annual frequency',
      'Stress-rate capacity vs base rate side by side',
      'Yearly amortization table and principal vs interest chart',
    ],
    href: '/wealth-tools/additional-mortgage-capacity',
    icon: 'mortgage',
    ctaLabel: 'Open calculator',
  },
  {
    id: 'global-wealth-preservation-comparison',
    title: 'Global Wealth Preservation Comparison',
    description:
      'Premium seven-jurisdiction dashboard for internationally mobile investors. Compare tax drag, pensions, real estate, and projected net worth across Switzerland, Netherlands, Germany, Belgium, UAE, Singapore, and Luxembourg.',
    features: [
      'Jurisdiction profile cards and detailed comparison matrix',
      'Interactive assumptions: salary, portfolio, property, pensions, relocation',
      'Net worth, tax drag, asset mix, retirement income, and ranking charts',
      '10 / 20 / 25-year horizon lens with CHF, EUR, or USD display',
      'Decision framework by priority — compounding, salary, pension, property, mobility',
    ],
    href: '/wealth-tools/global-wealth-preservation-comparison',
    icon: 'globe',
    ctaLabel: 'Open comparison',
  },
];
