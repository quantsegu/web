export const STORAGE_KEY = 'bookkeeping-tracker-v1';

export const ENTITIES = ['Switzerland (ERPNext)', 'Netherlands (SnelStart)', 'All / shared'] as const;

export type InfoRequestStatus = 'Open' | 'Waiting' | 'Resolved' | 'Not needed';

export interface InfoRequest {
  id: string;
  dateAdded: string;
  entity: string;
  accountArea: string;
  description: string;
  value: string;
  requestedFrom: string;
  dateRequested: string;
  status: InfoRequestStatus;
  bookingRef: string;
}

export interface WeeklyStatusUpdate {
  id: string;
  weekKey: string;
  submittedAt: string;
  workDone: string;
  reconciliation: string;
  overdueItems: string;
  openQuestions: string;
}

export interface SopSection {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface TrackerState {
  weeklyChecks: Record<string, Record<string, boolean>>;
  weeklyNotes: Record<string, string>;
  infoRequests: InfoRequest[];
  weeklyUpdates: WeeklyStatusUpdate[];
  sopSections: SopSection[];
}

/** Daily work items, confirmed once per week (summarised across all working days). */
export const WEEKLY_DAILY_SUMMARY_ITEMS = [
  { id: 'sales-invoices', label: 'All new sales invoices for the week entered (or confirmed there were none)' },
  { id: 'purchase-invoices', label: 'All new purchase invoices and expenses for the week entered' },
  { id: 'bank-card', label: 'All bank and card transactions for the week imported or recorded' },
  { id: 'categorise', label: 'All new transactions categorised with correct accounts and VAT codes' },
  { id: 'attach-docs', label: 'Supporting documents attached or filed for the week\'s entries' },
  { id: 'info-list', label: 'Information request list updated with missing invoices, receipts, or explanations' },
  { id: 'urgent', label: 'Urgent items checked: rejected payments, urgent supplier payments, critical overdue invoices' },
] as const;

export const WEEKLY_REVIEW_ITEMS = [
  { id: 'bank-recon', label: 'Complete bank and card reconciliations for all active accounts (per company)' },
  { id: 'ar-review', label: 'Review A/R: run aging report, identify past-due invoices and reminder needs' },
  { id: 'ap-review', label: 'Review A/P: run open bills list, flag due/overdue and cash-flow issues' },
  { id: 'recurring', label: 'Confirm recurring transactions (rent, subscriptions, salaries) captured for the week' },
  { id: 'suspense', label: 'Clean up small suspense items that can be resolved quickly' },
  { id: 'info-list-update', label: 'Close resolved items on information request list; add new ones from the week' },
  { id: 'consolidated-request', label: 'Prepare a single consolidated message with open document requests' },
  { id: 'status-update', label: 'Send weekly status update (work done, reconciliation, overdue, open questions)' },
] as const;

export const WEEKLY_ITEMS = [...WEEKLY_DAILY_SUMMARY_ITEMS, ...WEEKLY_REVIEW_ITEMS] as const;

export const DEFAULT_SOP_SECTIONS: Omit<SopSection, 'updatedAt'>[] = [
  {
    id: 'general',
    title: 'General principles',
    content:
      'Double-entry bookkeeping. No posting without supporting documents. Use suspense / "To clarify" only temporarily with a note. Consistent naming rules per company.',
  },
  {
    id: 'sales',
    title: 'Sales process per company',
    content:
      'Document: where invoices originate, how to create in SnelStart/ERPNext, VAT rules, typical accounts. Add examples as they arise.',
  },
  {
    id: 'purchases',
    title: 'Purchases & expenses per company',
    content:
      'Document: how expenses arrive, approval rules, VAT rules, typical accounts. Note recurring suppliers and coding decisions.',
  },
  {
    id: 'bank-recon',
    title: 'Bank & card reconciliation',
    content:
      'Step-by-step for each bank account in each system. Include statement dates, feed import steps, and common matching patterns.',
  },
  {
    id: 'vat',
    title: 'VAT — Switzerland & Netherlands',
    content:
      'VAT handling once agreed with tax advisor. Include return deadlines, account mappings, and special cases.',
  },
  {
    id: 'edge-cases',
    title: 'Special / edge cases',
    content:
      'Shareholder expenses, intercompany recharges, specific projects. Document final decisions with examples.',
  },
];

export const ROLE_SECTIONS = [
  {
    id: 'overview',
    title: 'Role overview',
    content: `**Role:** Bookkeeper for Swiss and Dutch companies using SnelStart and ERPNext

**Goal:** Keep all entities' books accurate, fully documented, reconciled, and ready for tax and statutory reporting in Switzerland and the Netherlands.`,
  },
  {
    id: 'transaction-entry',
    title: 'Transaction entry and coding',
    bullets: [
      'Enter all invoices, expenses, and other financial transactions into SnelStart (NL) and ERPNext (CH) with correct accounts, tax codes, and dates.',
      'Avoid leaving items uncategorised; use a clear "To clarify / Suspense" account only temporarily and always add a note.',
    ],
  },
  {
    id: 'ar',
    title: 'Sales and invoicing (Accounts Receivable)',
    bullets: [
      'Create and send customer invoices when requested, using agreed templates and numbering for each company.',
      'Record incoming payments against correct invoices and maintain an updated list of open receivables and overdue invoices.',
    ],
  },
  {
    id: 'ap',
    title: 'Purchases and expenses (Accounts Payable)',
    bullets: [
      'Record all supplier invoices and expenses from documents provided.',
      'Record payments to suppliers, keep an updated list of unpaid bills, and flag overdue items.',
    ],
  },
  {
    id: 'bank',
    title: 'Bank, card, and cash bookkeeping',
    bullets: [
      'Import/enter all bank and credit card transactions regularly and assign to correct accounts/customers/suppliers.',
      'Perform bank and card reconciliations at least weekly (and always at month-end) so balances match statements and all differences are explained.',
    ],
  },
  {
    id: 'trial-balance',
    title: 'Periodic review and trial balance',
    bullets: [
      'At month-end, review trial balance: bank, receivables, payables, VAT, payroll, shareholder and intercompany accounts, and suspense accounts.',
      'Propose corrections or adjustments and prepare a short summary of issues and open questions.',
    ],
  },
  {
    id: 'documentation',
    title: 'Documentation and legal retention',
    bullets: [
      'Attach or organise all supporting documents so every booking is traceable.',
      'Retention: Swiss records ≥10 years; Dutch basic records ≥7 years (10 years for some real-estate and special VAT items).',
    ],
  },
  {
    id: 'info-requests',
    title: 'Proactive information requests',
    bullets: [
      'Maintain a running list of missing documents or unclear transactions, with dates and status.',
      'Send grouped, concise requests (e.g. weekly) instead of many individual messages.',
    ],
  },
  {
    id: 'sops',
    title: 'SOPs and learning documentation',
    bullets: [
      'Build and update a simple Bookkeeping Manual for each company (sales, purchases, bank, VAT, special cases).',
      'Document recurring issues and final decisions, with examples.',
    ],
  },
  {
    id: 'communication',
    title: 'Communication with manager',
    bullets: [
      'Provide short weekly and monthly status updates (what\'s done, reconciliation status, key balances, open issues).',
      'Flag potential compliance risks early (missing invoices, big unexplained transfers, VAT anomalies).',
    ],
  },
] as const;

export function defaultState(): TrackerState {
  const now = new Date().toISOString();
  return {
    weeklyChecks: {},
    weeklyNotes: {},
    infoRequests: [],
    weeklyUpdates: [],
    sopSections: DEFAULT_SOP_SECTIONS.map((s) => ({ ...s, updatedAt: now })),
  };
}

export function loadState(): TrackerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<TrackerState> & {
      dailyChecks?: Record<string, Record<string, boolean>>;
      dailyNotes?: Record<string, string>;
    };
    return {
      ...defaultState(),
      weeklyChecks: parsed.weeklyChecks ?? {},
      weeklyNotes: parsed.weeklyNotes ?? {},
      infoRequests: parsed.infoRequests ?? [],
      weeklyUpdates: parsed.weeklyUpdates ?? [],
      sopSections:
        parsed.sopSections && parsed.sopSections.length > 0
          ? parsed.sopSections
          : defaultState().sopSections,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: TrackerState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getIsoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function createInfoRequest(partial?: Partial<InfoRequest>): InfoRequest {
  const today = formatDateKey(new Date());
  return {
    id: crypto.randomUUID(),
    dateAdded: today,
    entity: ENTITIES[0],
    accountArea: '',
    description: '',
    value: '',
    requestedFrom: '',
    dateRequested: today,
    status: 'Open',
    bookingRef: '',
    ...partial,
  };
}

export function exportStateAsJson(state: TrackerState): string {
  return JSON.stringify(state, null, 2);
}

export function progressForItems(
  checks: Record<string, boolean> | undefined,
  items: readonly { id: string }[],
): { done: number; total: number; percent: number } {
  const total = items.length;
  const done = items.filter((item) => checks?.[item.id]).length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

