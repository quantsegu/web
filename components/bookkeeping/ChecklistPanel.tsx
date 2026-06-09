import type { ReactNode } from 'react';
import ProgressBar from './ProgressBar';
import { progressForItems } from '../../lib/bookkeepingTracker';

interface ChecklistItem {
  id: string;
  label: string;
}

interface ChecklistPanelProps {
  title: string;
  subtitle?: string;
  items: readonly ChecklistItem[];
  checks: Record<string, boolean> | undefined;
  onToggle: (id: string, checked: boolean) => void;
  onReset?: () => void;
  headerExtra?: ReactNode;
  footerExtra?: ReactNode;
}

export default function ChecklistPanel({
  title,
  subtitle,
  items,
  checks,
  onToggle,
  onReset,
  headerExtra,
  footerExtra,
}: ChecklistPanelProps) {
  const progress = progressForItems(checks, items);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-600 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerExtra}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded border border-slate-200"
              >
                Reset all
              </button>
            )}
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar {...progress} />
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {items.map((item) => {
          const checked = Boolean(checks?.[item.id]);
          return (
            <li key={item.id}>
              <label className="flex items-start gap-3 px-5 py-3.5 cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onToggle(item.id, e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className={`text-sm leading-relaxed ${checked ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                  {item.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {footerExtra && <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">{footerExtra}</div>}
    </section>
  );
}
