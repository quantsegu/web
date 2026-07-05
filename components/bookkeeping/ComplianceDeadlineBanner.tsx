import type { FilingSchedule } from '../../lib/complianceDeadlines';
import { STATUS_STYLES, formatDisplayDate, PREP_LEAD_DAYS } from '../../lib/complianceDeadlines';

interface ComplianceDeadlineBannerProps {
  schedule: FilingSchedule;
}

export default function ComplianceDeadlineBanner({ schedule }: ComplianceDeadlineBannerProps) {
  const styles = STATUS_STYLES[schedule.status];

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles.banner}`}>
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${styles.badge}`}>
          {styles.label}
        </span>
        <span className="font-medium">{schedule.filingLabel}</span>
      </div>
      {schedule.status === 'not-open' ? (
        <p>
          Checklist opens <strong>{formatDisplayDate(schedule.prepStart)}</strong> ({PREP_LEAD_DAYS} days before filing
          due <strong>{formatDisplayDate(schedule.filingDeadline)}</strong>).
        </p>
      ) : (
        <p>
          Preparation since <strong>{formatDisplayDate(schedule.prepStart)}</strong> · Filing due{' '}
          <strong>{formatDisplayDate(schedule.filingDeadline)}</strong>
        </p>
      )}
    </div>
  );
}
