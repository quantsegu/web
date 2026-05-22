/** Validated design tokens for Investment Universe — matches site navy / saffron / green language */
export const universeUi = {
  page: 'min-h-screen w-full bg-[#050108]',
  section: 'py-14 sm:py-16 px-4 sm:px-6 lg:px-8',
  sectionAlt: 'py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-black/30 border-y border-saffron-800/20',
  container: 'max-w-7xl mx-auto',
  panel:
    'bg-black/40 backdrop-blur-md rounded-xl border border-saffron-500/15 shadow-lg shadow-black/20',
  card:
    'bg-bjp-navy-light/60 backdrop-blur-sm rounded-lg border border-saffron-500/20 p-5 sm:p-6 h-full flex flex-col',
  cardTitle: 'text-lg font-bold text-white',
  cardMeta: 'text-xs font-semibold uppercase tracking-wider text-saffron-400/90',
  prose: 'text-saffron-50/90 text-sm sm:text-[0.9375rem] leading-relaxed',
  proseMuted: 'text-gray-400 text-sm leading-relaxed',
  label: 'text-[0.65rem] font-semibold uppercase tracking-wider text-saffron-400/80',
  value: 'text-white text-sm font-medium',
  chip:
    'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border transition-colors duration-200',
  chipIdle: 'border-saffron-500/25 text-gray-300 bg-black/30 hover:border-saffron-500/50',
  chipActive: 'border-saffron-400 text-white bg-saffron-500/20',
  tableWrap: 'overflow-x-auto rounded-xl border border-saffron-500/15 bg-black/30',
  table: 'w-full min-w-[960px] text-left text-sm border-collapse',
  th: 'px-3 py-3 text-xs font-semibold uppercase tracking-wide text-saffron-300 bg-bjp-navy/80 border-b border-saffron-500/20 sticky top-0 z-10',
  td: 'px-3 py-3 text-gray-300 border-b border-saffron-500/10 align-top',
  tdCategory: 'font-semibold text-white whitespace-nowrap',
  badge:
    'inline-block px-2 py-0.5 rounded text-[0.65rem] font-semibold uppercase tracking-wide border',
  mapFrame: 'rounded-xl border border-saffron-500/15 bg-bjp-navy/40 p-4 sm:p-6',
  callout:
    'border-l-2 border-saffron-500/60 pl-4 py-1 text-saffron-100/90 text-sm leading-relaxed',
  ctaCard:
    'rounded-xl border border-saffron-500/25 bg-gradient-to-br from-bjp-navy-light/90 to-black/50 p-6 sm:p-8 text-center',
} as const;

export type UniverseRole =
  | 'Core'
  | 'Income / defensive'
  | 'Diversifier'
  | 'Hedge'
  | 'Tactical'
  | 'Speculative'
  | 'Passion / collectible';

export const roleBadgeClass: Record<UniverseRole, string> = {
  Core: 'border-bjp-green/40 text-bjp-green-light bg-bjp-green/10',
  'Income / defensive': 'border-saffron-500/40 text-saffron-200 bg-saffron-500/10',
  Diversifier: 'border-white/20 text-gray-200 bg-white/5',
  Hedge: 'border-saffron-300/30 text-saffron-100 bg-saffron-500/5',
  Tactical: 'border-saffron-400/35 text-saffron-300 bg-saffron-500/10',
  Speculative: 'border-red-400/40 text-red-200 bg-red-500/10',
  'Passion / collectible': 'border-saffron-600/30 text-saffron-200 bg-black/40',
};
