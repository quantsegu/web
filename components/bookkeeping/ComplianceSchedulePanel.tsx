import type { FilingSchedule } from '../../lib/complianceDeadlines';
import { STATUS_STYLES, formatDisplayDate } from '../../lib/complianceDeadlines';

interface ComplianceSchedulePanelProps {
  schedules: FilingSchedule[];
  onSelect: (schedule: FilingSchedule) => void;
}

export default function ComplianceSchedulePanel({ schedules, onSelect }: ComplianceSchedulePanelProps) {
  if (schedules.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Active filing windows</h2>
        <p className="text-sm text-slate-600 mt-1">
          No checklists are in their 3-week preparation window right now. Periods open automatically before each filing
          deadline.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
        <h2 className="text-base font-semibold text-slate-900">Active filing windows</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Checklists auto-created at least 3 weeks before each deadline. Work oldest / most urgent first.
        </p>
      </div>
      <ul className="divide-y divide-slate-100">
        {schedules.map((schedule) => {
          const styles = STATUS_STYLES[schedule.status];
          return (
            <li key={`${schedule.cadence}-${schedule.periodKey}-${schedule.filingLabel}`}>
              <button
                type="button"
                onClick={() => onSelect(schedule)}
                className="w-full text-left px-5 py-3.5 hover:bg-emerald-50/50 transition-colors flex flex-wrap items-center gap-2 justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {schedule.label} — {schedule.filingLabel}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Due {formatDisplayDate(schedule.filingDeadline)} · prep since{' '}
                    {formatDisplayDate(schedule.prepStart)}
                  </p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${styles.badge}`}>
                  {styles.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
