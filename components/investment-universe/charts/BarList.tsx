import { BRAND_BAR, INK } from './chartTokens';

export interface BarRow {
  label: string;
  value: number;
  color?: string;
  /** shown after the value, e.g. a share */
  extra?: string;
}

interface BarListProps {
  rows: BarRow[];
  /** scale maximum; defaults to the largest value */
  max?: number;
  format?: (v: number) => string;
  ariaLabel: string;
}

/** Horizontal bars, thin marks, 4px rounded data-end, direct value labels (few rows by design). */
export default function BarList({ rows, max, format = (v) => v.toFixed(1), ariaLabel }: BarListProps) {
  const top = max ?? Math.max(...rows.map((r) => r.value), 1e-9);

  return (
    <ul className="space-y-2.5" role="list" aria-label={ariaLabel}>
      {rows.map((r) => {
        const w = Math.max(0, Math.min(100, (r.value / top) * 100));
        return (
          <li key={r.label} className="grid grid-cols-[minmax(6.5rem,35%)_1fr_auto] items-center gap-3">
            <span className="text-xs sm:text-sm text-gray-300 leading-tight" style={{ color: INK.secondary }}>
              {r.label}
            </span>
            <span className="h-3 rounded-r-[4px] bg-white/5 relative block overflow-hidden" aria-hidden>
              <span
                className="absolute inset-y-0 left-0 rounded-r-[4px]"
                style={{ width: `${w}%`, background: r.color ?? BRAND_BAR }}
              />
            </span>
            <span className="text-xs sm:text-sm text-white tabular-nums text-right min-w-[3.5rem]">
              {format(r.value)}
              {r.extra && <span className="text-gray-500 ml-1">{r.extra}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
