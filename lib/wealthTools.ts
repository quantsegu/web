export interface WealthTool {
  id: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  icon: 'retirement' | 'portfolio' | 'tax' | 'mortgage' | 'globe' | 'universe' | 'policy' | 'realestate' | 'car';
  ctaLabel?: string;
}

export const wealthTools: WealthTool[] = [
  {
    id: 'country-comparison-master-dashboard',
    title: 'CountryScope Master Dashboard',
    description:
      'Master comparison dashboard for country selection: benchmark tax efficiency, cost of living, healthcare, education, safety, pension systems, and quality of life with customizable preference weights.',
    features: [
      'Compare up to four countries side-by-side (11 jurisdictions including UK, Scotland, Ireland)',
      'Weighted scoring engine for personalized country ranking',
      'Category matrix: tax, living cost, healthcare, education, safety, pension, quality',
      'Auto-insights highlighting best-fit country and trade-offs',
      'Useful as a shortlisting layer before detailed migration or wealth planning',
    ],
    href: '/wealth-tools/country-comparison-master-dashboard',
    icon: 'globe',
    ctaLabel: 'Open master dashboard',
  },
  {
    id: 'take-home-pay-comparison',
    title: 'Global Take-Home Pay Comparison',
    description:
      'Compare net pay across permanent employment, contracting, and payrolling in NL, CH, LU, DE, BE, UK, Scotland, Ireland, UAE, and Singapore — with 30% ruling, cantonal tax, CPF, and expat regime options.',
    features: [
      'Ten jurisdictions with currency conversion (EUR, GBP, CHF, SGD, AED, USD)',
      'Engagement types: permanent, contractor (BV/ZZP), payrolling / EOR',
      'Contractor: deductible expenses, profit retention in company, salary vs dividend payout',
      'Advanced: NL 30% ruling, multi-canton CH compare (20 cantons incl. Schaffhausen), DE church tax, BE expat, SG CPF',
      'Ranked bar chart, deduction stack bars, and full breakdown per country',
      'Employer cost toggle for total cost-to-company view',
    ],
    href: '/wealth-tools/take-home-pay-comparison',
    icon: 'tax',
    ctaLabel: 'Compare take-home',
  },
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
    id: 'investment-policy-dashboard',
    title: 'Investment Policy Dashboard',
    description:
      'Define or review a private-client investment policy — goals, risk capacity, target allocation bands, liquidity buckets, rebalancing rules, and tax-aware guidelines with a draft IPS output.',
    features: [
      'Goal and objective inputs with preservation, retirement, growth, and legacy presets',
      'Risk capacity vs tolerance with suggested allocation ranges',
      'Liquidity reserve sizing and three-bucket planning',
      'Rebalancing triggers — calendar, threshold, or hybrid',
      'Draft investment policy statement with copy and print',
    ],
    href: '/wealth-tools/investment-policy-dashboard',
    icon: 'policy',
    ctaLabel: 'Open dashboard',
  },
  {
    id: 'edu-scope',
    title: 'EduScope — Global Education Intelligence',
    description:
      'Calculate total education spend from nursery to university across NL, CH, DE, LU, BE, AT, UK, Scotland, Ireland, Singapore, and UAE. Compare school quality, university rankings, family cost of living, and country scorecards.',
    features: [
      'Full cost calculator birth to age 22 with state, private, and international pathways',
      'PISA scores, curriculum cards, and international school ecosystem per country',
      'QS 2025 university rankings plus UK, US, Canada, Australia bonus destinations',
      'Family wellbeing radar, healthcare, parental leave, and cost of living',
      'Country scorecards and profile-based best-match ranking',
    ],
    href: '/wealth-tools/edu-scope',
    icon: 'globe',
    ctaLabel: 'Calculate education costs',
  },
  {
    id: 'pension-scope',
    title: 'PensionScope — Global Retirement Intelligence',
    description:
      'Calculate projected pension income across Netherlands, Switzerland, Germany, Luxembourg, Belgium, Austria, UK, Scotland, Ireland, UAE, and Singapore. Three-pillar breakdown, country comparison, replacement rate explorer, and retirement destination scoring.',
    features: [
      'Hero calculator with NL 30% ruling, CH canton/BVG, DE church tax, SG CPF status',
      'State, occupational, and private pillar cards with capital accumulation chart',
      'Eleven-country comparison dashboard with Mercer grades and ranking charts',
      'Replacement rate explorer by salary with ceiling table',
      'Best places to retire with preference sliders and radar chart',
      'Scenario planner: early retirement, Swiss max 3a, SG relocation at 50',
    ],
    href: '/wealth-tools/pension-scope',
    icon: 'retirement',
    ctaLabel: 'Calculate pension',
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
    id: 'nl-ch-vehicle-cost-comparison',
    title: 'Europe Vehicle Cost Comparison',
    description:
      'Compare annual private and company LCV costs across Netherlands, Switzerland, Germany, Italy, France, UK, and Ireland — diesel, petrol, and electric with ranked EUR-equivalent totals.',
    features: [
      'Seven-country ranking: NL, CH, DE, IT, FR, UK, IE with summary table',
      'Presets: VW Caddy, ID. Buzz Cargo, Ford Transit/E-Transit, Mercedes eSprinter',
      'Electric: BPM, bijtelling, Kfz-Steuer, TVS, and bollo estimates per country',
      'Swiss canton and Italian region selectors',
      'Custom catalogue values and consumption for any LCV',
    ],
    href: '/wealth-tools/nl-ch-vehicle-cost-comparison',
    icon: 'car',
    ctaLabel: 'Compare costs',
  },
  {
    id: 'personal-vs-company-car-planner',
    title: 'Personal vs Company Car Planner',
    description:
      'Compare 5-year total cost of any vehicle privately vs through a Swiss GmbH or AG — side-by-side cards, VAT, Privatanteil 10.8%, cantonal tax, leasing, and decision guide.',
    features: [
      'Any make/model — presets or custom purchase price',
      'Acquisition, running costs, and tax treatment side by side',
      'Zug and other canton corporate tax defaults',
      'Cash vs leasing with Privatanteil on list price',
      '5-year TCO table, chart, and decision guide',
    ],
    href: '/wealth-tools/personal-vs-company-car-planner',
    icon: 'car',
    ctaLabel: 'Compare ownership',
  },
  {
    id: 'real-estate-vs-equity-planner',
    title: 'Real Estate vs Equity Planner',
    description:
      'Compare leveraged property against a liquid portfolio over your horizon — net worth, rental cash flow vs dividends, mortgage leverage, maintenance, tax drag, and IRR-style returns.',
    features: [
      'Side-by-side property and portfolio projection',
      'Mortgage amortization, vacancy, maintenance, and appreciation',
      'Equity return, dividends, fees, and portfolio tax drag',
      'Net worth, income, and risk radar charts',
      'RE vs equity breakdown tables and decision guide',
    ],
    href: '/wealth-tools/real-estate-vs-equity-planner',
    icon: 'realestate',
    ctaLabel: 'Open planner',
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
      'Premium ten-jurisdiction dashboard for internationally mobile investors. Compare tax drag, pensions, real estate, and projected net worth across Switzerland, Netherlands, Germany, Belgium, UK, Scotland, Ireland, UAE, Singapore, and Luxembourg.',
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
