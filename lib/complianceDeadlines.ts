import {
  progressForItems,
  MONTHLY_CLOSE_ITEMS,
  NL_MONTHLY_ITEMS,
  CH_MONTHLY_ITEMS,
  NL_QUARTERLY_ITEMS,
  CH_QUARTERLY_ITEMS,
  NL_ANNUAL_ITEMS,
  CH_ANNUAL_ITEMS,
  MONTHLY_PREP_ITEMS,
  QUARTERLY_PREP_ITEMS,
  ANNUAL_PREP_ITEMS,
  type TrackerState,
  type EntityTag,
} from './bookkeepingTracker';

export const PREP_LEAD_DAYS = 21;

export type ComplianceCadence = 'monthly' | 'quarterly' | 'annual';

export type ComplianceStatus = 'not-open' | 'prep' | 'due-soon' | 'overdue' | 'complete';

export interface FilingSchedule {
  cadence: ComplianceCadence;
  periodKey: string;
  label: string;
  filingLabel: string;
  prepStart: Date;
  filingDeadline: Date;
  status: ComplianceStatus;
  entity: EntityTag;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function lastDayOfMonth(year: number, monthIndex0: number): Date {
  return new Date(year, monthIndex0 + 1, 0);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getPrepStart(filingDeadline: Date): Date {
  return startOfDay(addDays(filingDeadline, -PREP_LEAD_DAYS));
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** NL monthly BTW / ICP: last day of the month after the reporting period. */
export function getMonthlyFilingDeadline(monthKey: string): Date {
  const [y, m] = monthKey.split('-').map(Number);
  return lastDayOfMonth(y, m);
}

export function getQuarterEndDate(quarterKey: string): Date {
  const match = quarterKey.match(/^(\d{4})-Q(\d)$/);
  if (!match) return new Date();
  const year = Number(match[1]);
  const quarter = Number(match[2]);
  return lastDayOfMonth(year, quarter * 3 - 1);
}

/** NL quarterly BTW: last day of the month after the quarter ends. */
export function getNlQuarterlyFilingDeadline(quarterKey: string): Date {
  const quarterEnd = getQuarterEndDate(quarterKey);
  return lastDayOfMonth(quarterEnd.getFullYear(), quarterEnd.getMonth() + 1);
}

/** CH MWST: 60 days after quarter end (confirm per ESTV agreement). */
export function getChQuarterlyFilingDeadline(quarterKey: string): Date {
  return startOfDay(addDays(getQuarterEndDate(quarterKey), 60));
}

/** NL VPB / jaarrekening support: 31 May after calendar year-end. */
export function getNlAnnualFilingDeadline(yearKey: string): Date {
  return new Date(Number(yearKey) + 1, 4, 31);
}

/** CH annual tax / Jahresabschluss: 30 June after calendar year-end (varies by canton). */
export function getChAnnualFilingDeadline(yearKey: string): Date {
  return new Date(Number(yearKey) + 1, 5, 30);
}

export function getComplianceStatus(
  prepStart: Date,
  filingDeadline: Date,
  today: Date = new Date(),
  complete = false,
): ComplianceStatus {
  if (complete) return 'complete';
  const t = startOfDay(today).getTime();
  const prep = startOfDay(prepStart).getTime();
  const due = startOfDay(filingDeadline).getTime();
  if (t < prep) return 'not-open';
  if (t > due) return 'overdue';
  if (due - t <= 7 * 86_400_000) return 'due-soon';
  return 'prep';
}

function monthLabel(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function quarterLabel(quarterKey: string): string {
  const match = quarterKey.match(/^(\d{4})-Q(\d)$/);
  if (!match) return quarterKey;
  return `Q${match[2]} ${match[1]}`;
}

function isMonthlyComplete(state: TrackerState, monthKey: string): boolean {
  const checks = state.monthlyChecks[monthKey];
  const items = [...MONTHLY_PREP_ITEMS, ...MONTHLY_CLOSE_ITEMS, ...NL_MONTHLY_ITEMS, ...CH_MONTHLY_ITEMS];
  return progressForItems(checks, items).percent === 100;
}

function isQuarterlyComplete(state: TrackerState, quarterKey: string): boolean {
  const checks = state.quarterlyChecks[quarterKey];
  const items = [...QUARTERLY_PREP_ITEMS, ...NL_QUARTERLY_ITEMS, ...CH_QUARTERLY_ITEMS];
  return progressForItems(checks, items).percent === 100;
}

function isAnnualComplete(state: TrackerState, yearKey: string): boolean {
  const checks = state.annualChecks[yearKey];
  const items = [...ANNUAL_PREP_ITEMS, ...NL_ANNUAL_ITEMS, ...CH_ANNUAL_ITEMS];
  return progressForItems(checks, items).percent === 100;
}

export function getMonthlySchedule(monthKey: string, state: TrackerState, today = new Date()): FilingSchedule {
  const deadline = getMonthlyFilingDeadline(monthKey);
  const prepStart = getPrepStart(deadline);
  return {
    cadence: 'monthly',
    periodKey: monthKey,
    label: monthLabel(monthKey),
    filingLabel: 'NL BTW + ICP / month-end close',
    prepStart,
    filingDeadline: deadline,
    status: getComplianceStatus(prepStart, deadline, today, isMonthlyComplete(state, monthKey)),
    entity: 'Both',
  };
}

export function getQuarterlySchedules(
  quarterKey: string,
  state: TrackerState,
  today = new Date(),
): FilingSchedule[] {
  const nlDeadline = getNlQuarterlyFilingDeadline(quarterKey);
  const chDeadline = getChQuarterlyFilingDeadline(quarterKey);
  const complete = isQuarterlyComplete(state, quarterKey);
  return [
    {
      cadence: 'quarterly',
      periodKey: quarterKey,
      label: quarterLabel(quarterKey),
      filingLabel: 'NL BTW-aangifte (quarterly)',
      prepStart: getPrepStart(nlDeadline),
      filingDeadline: nlDeadline,
      status: getComplianceStatus(getPrepStart(nlDeadline), nlDeadline, today, complete),
      entity: 'NL',
    },
    {
      cadence: 'quarterly',
      periodKey: quarterKey,
      label: quarterLabel(quarterKey),
      filingLabel: 'CH MWST-Abrechnung',
      prepStart: getPrepStart(chDeadline),
      filingDeadline: chDeadline,
      status: getComplianceStatus(getPrepStart(chDeadline), chDeadline, today, complete),
      entity: 'CH',
    },
  ];
}

export function getAnnualSchedules(yearKey: string, state: TrackerState, today = new Date()): FilingSchedule[] {
  const nlDeadline = getNlAnnualFilingDeadline(yearKey);
  const chDeadline = getChAnnualFilingDeadline(yearKey);
  const complete = isAnnualComplete(state, yearKey);
  return [
    {
      cadence: 'annual',
      periodKey: yearKey,
      label: `FY ${yearKey}`,
      filingLabel: 'NL VPB / annual accounts',
      prepStart: getPrepStart(nlDeadline),
      filingDeadline: nlDeadline,
      status: getComplianceStatus(getPrepStart(nlDeadline), nlDeadline, today, complete),
      entity: 'NL',
    },
    {
      cadence: 'annual',
      periodKey: yearKey,
      label: `FY ${yearKey}`,
      filingLabel: 'CH Jahresabschluss / tax',
      prepStart: getPrepStart(chDeadline),
      filingDeadline: chDeadline,
      status: getComplianceStatus(getPrepStart(chDeadline), chDeadline, today, complete),
      entity: 'CH',
    },
  ];
}

function shiftMonthKey(key: string, months: number): string {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + months, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function shiftQuarterKey(key: string, quarters: number): string {
  const match = key.match(/^(\d{4})-Q(\d)$/);
  if (!match) return key;
  const d = new Date(Number(match[1]), (Number(match[2]) - 1) * 3 + quarters * 3, 1);
  const quarter = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}-Q${quarter}`;
}

export function listActiveFilingSchedules(state: TrackerState, today = new Date()): FilingSchedule[] {
  const now = startOfDay(today);
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  const quarterKey = `${now.getFullYear()}-Q${quarter}`;
  const yearKey = String(now.getFullYear());

  const monthKeys = Array.from({ length: 5 }, (_, i) => shiftMonthKey(monthKey, i - 2));
  const quarterKeys = Array.from({ length: 3 }, (_, i) => shiftQuarterKey(quarterKey, i - 1));
  const yearKeys = [String(Number(yearKey) - 1), yearKey];

  const schedules: FilingSchedule[] = [];
  for (const key of monthKeys) schedules.push(getMonthlySchedule(key, state, today));
  for (const key of quarterKeys) schedules.push(...getQuarterlySchedules(key, state, today));
  for (const key of yearKeys) schedules.push(...getAnnualSchedules(key, state, today));

  const active = schedules.filter((s) => s.status !== 'not-open' && s.status !== 'complete');
  const priority: Record<ComplianceStatus, number> = { overdue: 0, 'due-soon': 1, prep: 2, 'not-open': 3, complete: 4 };
  return active.sort((a, b) => priority[a.status] - priority[b.status] || a.filingDeadline.getTime() - b.filingDeadline.getTime());
}

export function isPeriodChecklistOpen(schedule: FilingSchedule, today = new Date()): boolean {
  return startOfDay(today).getTime() >= startOfDay(schedule.prepStart).getTime();
}

/** Initialise empty checklist records for periods now in the prep window. */
export function ensureActiveCompliancePeriods(state: TrackerState, today = new Date()): TrackerState {
  const now = startOfDay(today);
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  const quarterKey = `${now.getFullYear()}-Q${quarter}`;
  const yearKey = String(now.getFullYear());

  const monthKeys = Array.from({ length: 6 }, (_, i) => shiftMonthKey(monthKey, i - 2));
  const quarterKeys = Array.from({ length: 4 }, (_, i) => shiftQuarterKey(quarterKey, i - 1));
  const yearKeys = [String(Number(yearKey) - 1), yearKey, String(Number(yearKey) + 1)];

  const monthlyChecks = { ...state.monthlyChecks };
  const quarterlyChecks = { ...state.quarterlyChecks };
  const annualChecks = { ...state.annualChecks };

  let changed = false;

  for (const key of monthKeys) {
    const schedule = getMonthlySchedule(key, state, today);
    if (isPeriodChecklistOpen(schedule, today) && !monthlyChecks[key]) {
      monthlyChecks[key] = {};
      changed = true;
    }
  }

  for (const key of quarterKeys) {
    for (const schedule of getQuarterlySchedules(key, state, today)) {
      if (isPeriodChecklistOpen(schedule, today) && !quarterlyChecks[key]) {
        quarterlyChecks[key] = {};
        changed = true;
        break;
      }
    }
  }

  for (const key of yearKeys) {
    for (const schedule of getAnnualSchedules(key, state, today)) {
      if (isPeriodChecklistOpen(schedule, today) && !annualChecks[key]) {
        annualChecks[key] = {};
        changed = true;
        break;
      }
    }
  }

  if (!changed) return state;
  return { ...state, monthlyChecks, quarterlyChecks, annualChecks };
}

export const STATUS_STYLES: Record<ComplianceStatus, { banner: string; badge: string; label: string }> = {
  'not-open': {
    banner: 'border-slate-200 bg-slate-50 text-slate-600',
    badge: 'bg-slate-100 text-slate-600',
    label: 'Not yet open',
  },
  prep: {
    banner: 'border-blue-200 bg-blue-50 text-blue-900',
    badge: 'bg-blue-100 text-blue-800',
    label: 'Preparation window',
  },
  'due-soon': {
    banner: 'border-amber-200 bg-amber-50 text-amber-900',
    badge: 'bg-amber-100 text-amber-800',
    label: 'Due within 7 days',
  },
  overdue: {
    banner: 'border-red-200 bg-red-50 text-red-900',
    badge: 'bg-red-100 text-red-800',
    label: 'Overdue',
  },
  complete: {
    banner: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    badge: 'bg-emerald-100 text-emerald-800',
    label: 'Complete',
  },
};
