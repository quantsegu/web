import type { InvestmentCategory } from '../../lib/investmentUniverse';
import { roleBadgeClass, universeUi } from './universeUi';

interface CategoryCardProps {
  category: InvestmentCategory;
  icon: React.ReactNode;
}

export default function CategoryCard({ category, icon }: CategoryCardProps) {
  const badge = roleBadgeClass[category.portfolioRole];

  return (
    <article
      id={category.id}
      className={`${universeUi.card} scroll-mt-28`}
      aria-labelledby={`${category.id}-title`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-md bg-gradient-to-br from-saffron-500/80 to-bjp-green/80 flex items-center justify-center text-white shrink-0"
          aria-hidden
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className={universeUi.cardMeta}>{category.group}</p>
          <h3 id={`${category.id}-title`} className={universeUi.cardTitle}>
            {category.name}
          </h3>
        </div>
      </div>

      <p className={`${universeUi.prose} mb-4`}>{category.definition}</p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-4 text-sm">
        <div>
          <dt className={universeUi.label}>How it works</dt>
          <dd className={universeUi.proseMuted}>{category.howItWorks}</dd>
        </div>
        <div>
          <dt className={universeUi.label}>Return driver</dt>
          <dd className={universeUi.value}>{category.returnDriver}</dd>
        </div>
        <div>
          <dt className={universeUi.label}>Risk profile</dt>
          <dd className={universeUi.value}>{category.riskProfile}</dd>
        </div>
        <div>
          <dt className={universeUi.label}>Liquidity</dt>
          <dd className={universeUi.value}>{category.liquidity}</dd>
        </div>
        <div>
          <dt className={universeUi.label}>Orientation</dt>
          <dd className={universeUi.value}>{category.orientation}</dd>
        </div>
        <div>
          <dt className={universeUi.label}>Typical use</dt>
          <dd className={universeUi.proseMuted}>{category.useCase}</dd>
        </div>
      </dl>

      <div className="mt-auto pt-3 border-t border-saffron-500/15">
        <span className={`${universeUi.badge} ${badge}`}>{category.portfolioRole}</span>
      </div>
    </article>
  );
}
