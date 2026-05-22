export interface WealthTool {
  id: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  icon: 'retirement' | 'portfolio';
  ctaLabel?: string;
}

export const wealthTools: WealthTool[] = [
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
    href: '/wealth-tools/retirement-income-planner.html',
    icon: 'retirement',
    ctaLabel: 'Open planner',
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
];
