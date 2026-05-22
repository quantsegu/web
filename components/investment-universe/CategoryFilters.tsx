import { universeUi } from './universeUi';

export type CategoryFilter = 'all' | 'traditional' | 'alternative' | 'niche' | 'core' | 'collectible';

const FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'traditional', label: 'Traditional' },
  { id: 'alternative', label: 'Alternative' },
  { id: 'niche', label: 'Niche' },
  { id: 'core', label: 'Core role' },
  { id: 'collectible', label: 'Collectibles' },
];

interface CategoryFiltersProps {
  active: CategoryFilter;
  onChange: (f: CategoryFilter) => void;
}

export default function CategoryFilters({ active, onChange }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter investment categories">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={`${universeUi.chip} ${active === f.id ? universeUi.chipActive : universeUi.chipIdle}`}
          aria-pressed={active === f.id}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
