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

export type EntityTag = 'NL' | 'CH' | 'Both';

export interface ChecklistItemDef {
  id: string;
  label: string;
  tag?: EntityTag;
}

export interface TrackerState {
  weeklyChecks: Record<string, Record<string, boolean>>;
  weeklyNotes: Record<string, string>;
  monthlyChecks: Record<string, Record<string, boolean>>;
  quarterlyChecks: Record<string, Record<string, boolean>>;
  annualChecks: Record<string, Record<string, boolean>>;
  complianceNotes: Record<string, string>;
  infoRequests: InfoRequest[];
  weeklyUpdates: WeeklyStatusUpdate[];
  sopSections: SopSection[];
}

/** Daily work items, confirmed once per week (summarised across all working days). */
export const WEEKLY_DAILY_SUMMARY_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'sales-invoices', label: 'All new sales invoices for the week entered (or confirmed there were none)', tag: 'Both' },
  { id: 'purchase-invoices', label: 'All supplier bills and purchase invoices entered before or at payment (none paid without a booked bill)', tag: 'Both' },
  { id: 'bank-card', label: 'All bank and card transactions for the week imported or recorded', tag: 'Both' },
  { id: 'categorise', label: 'All new transactions categorised with correct GL accounts and VAT/MWST codes', tag: 'Both' },
  { id: 'nl-vat-codes', label: 'NL (SnelStart): BTW codes verified on purchases and sales (21% / 9% / 0% / verlegd / EU)', tag: 'NL' },
  { id: 'ch-mwst-codes', label: 'CH (ERPNext): MWST codes verified on purchases and sales (normal / reduced / exempt / import)', tag: 'CH' },
  { id: 'invoice-fields', label: 'Sales invoices meet legal requirements (NL: BTW-id, sequential number; CH: UID/MWST-nr where applicable)', tag: 'Both' },
  { id: 'intercompany', label: 'Intercompany invoices and recharges for the week entered and cross-referenced', tag: 'Both' },
  { id: 'attach-docs', label: 'Supporting documents attached or filed for every booking in the week', tag: 'Both' },
  { id: 'info-list', label: 'Information request list updated with missing invoices, receipts, or explanations', tag: 'Both' },
  { id: 'urgent', label: 'Urgent items checked: rejected payments, urgent supplier payments, critical overdue invoices', tag: 'Both' },
];

export const WEEKLY_REVIEW_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'bank-recon', label: 'Complete bank and card reconciliations for all active accounts (per company)', tag: 'Both' },
  { id: 'ar-review', label: 'Review A/R: run aging report, identify past-due invoices and reminder needs', tag: 'Both' },
  { id: 'ap-review', label: 'Review A/P: run open bills list, flag due/overdue and cash-flow issues', tag: 'Both' },
  { id: 'recurring', label: 'Confirm recurring transactions (rent, subscriptions, salaries, insurance) captured for the week', tag: 'Both' },
  { id: 'nl-vat-control', label: 'NL: BTW control accounts reviewed — open items match known filings and EU transactions', tag: 'NL' },
  { id: 'ch-mwst-control', label: 'CH: MWST control accounts reviewed — open items match known return positions', tag: 'CH' },
  { id: 'unmatched-payments', label: 'Unmatched bank payments and receipts investigated (no unexplained items > agreed threshold)', tag: 'Both' },
  { id: 'credit-notes', label: 'Credit notes, corrections, and write-offs for the week processed with documentation', tag: 'Both' },
  { id: 'suspense', label: 'Clean up small suspense / "to clarify" items that can be resolved quickly', tag: 'Both' },
  { id: 'info-list-update', label: 'Close resolved items on information request list; add new ones from the week', tag: 'Both' },
  { id: 'consolidated-request', label: 'Prepare a single consolidated message with open document requests', tag: 'Both' },
  { id: 'status-update', label: 'Send weekly status update (work done, reconciliation, overdue, open questions)', tag: 'Both' },
];

/** Preparation items — complete ≥3 weeks before filing deadline. */
export const MONTHLY_PREP_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'prep-opened', label: 'Monthly checklist opened at least 3 weeks before filing deadline', tag: 'Both' },
  { id: 'prep-books-complete', label: 'All transactions for the month entered; banks reconciled to month-end', tag: 'Both' },
  { id: 'prep-docs-clear', label: 'Missing invoices/receipts chased; open items escalated before filing prep', tag: 'Both' },
  { id: 'prep-nl-draft', label: 'NL: draft BTW + ICP figures prepared and ready for review', tag: 'NL' },
  { id: 'prep-ch-mwst', label: 'CH: MWST position for the month reviewed and draft return data ready', tag: 'CH' },
  { id: 'prep-calendar', label: 'Filing deadline on calendar; advisor/manager informed of preparation timeline', tag: 'Both' },
];

export const QUARTERLY_PREP_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'prep-q-opened', label: 'Quarterly checklist opened at least 3 weeks before filing deadline', tag: 'Both' },
  { id: 'prep-q-close', label: 'Quarter-end close complete for all entities (banks, TB, A/R, A/P)', tag: 'Both' },
  { id: 'prep-nl-btw-draft', label: 'NL: draft BTW-aangifte prepared (quarterly filers)', tag: 'NL' },
  { id: 'prep-ch-mwst-draft', label: 'CH: draft MWST-Abrechnung prepared with Ziffern reconciliation', tag: 'CH' },
  { id: 'prep-advisor', label: 'Tax advisor review scheduled before filing deadline', tag: 'Both' },
];

export const ANNUAL_PREP_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'prep-y-opened', label: 'Annual checklist opened at least 3 weeks before filing deadline', tag: 'Both' },
  { id: 'prep-y-close', label: 'Year-end closing entries drafted (accruals, depreciation, provisions)', tag: 'Both' },
  { id: 'prep-y-package', label: 'Accountant/tax advisor package prepared (TB, schedules, supporting docs)', tag: 'Both' },
  { id: 'prep-y-nl', label: 'NL: VPB / annual accounts support items flagged for advisor', tag: 'NL' },
  { id: 'prep-y-ch', label: 'CH: Jahresabschluss / MWST annual reconciliation items flagged', tag: 'CH' },
];

/** Month-end close — every entity, every month. */
export const MONTHLY_CLOSE_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'bank-month-end', label: 'All bank and card accounts reconciled to statement month-end date', tag: 'Both' },
  { id: 'trial-balance', label: 'Trial balance exported; material balances reviewed and explained', tag: 'Both' },
  { id: 'ar-ap-aging', label: 'A/R and A/P aging reports run; overdue and doubtful items flagged', tag: 'Both' },
  { id: 'payroll-month', label: 'Payroll journals for the month complete and reconciled to payments (if applicable)', tag: 'Both' },
  { id: 'fixed-assets', label: 'Depreciation and fixed-asset movements posted for the month', tag: 'Both' },
  { id: 'accruals', label: 'Accruals, prepayments, and cut-off items reviewed and adjusted', tag: 'Both' },
  { id: 'suspense-month', label: 'Suspense / clarification accounts cleared or documented with owner and due date', tag: 'Both' },
  { id: 'intercompany-month', label: 'Intercompany balances agree between NL and CH entities (or differences explained)', tag: 'Both' },
  { id: 'manager-summary', label: 'Month-end summary prepared for manager / tax advisor', tag: 'Both' },
];

/** Netherlands — SnelStart monthly bookkeeping controls. */
export const NL_MONTHLY_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'nl-period-review', label: 'SnelStart period reviewed for completeness — no unposted drafts left open', tag: 'NL' },
  { id: 'nl-btw-rubrieken', label: 'BTW rubrieken (boxes 1a–5b) control totals reconciled to ledger', tag: 'NL' },
  { id: 'nl-eu-acquisitions', label: 'EU acquisitions (inkopen uit EU) booked with verlegde BTW and correct ICP data', tag: 'NL' },
  { id: 'nl-reverse-charge', label: 'Foreign services (buitenlandse diensten) reverse-charge BTW applied correctly', tag: 'NL' },
  { id: 'nl-kasstelsel', label: 'Kasstelsel vs factuurstelsel rules applied correctly for the entity', tag: 'NL' },
  { id: 'nl-private-use', label: 'Private use / mixed-use costs (auto, phone, home office) allocated per agreed method', tag: 'NL' },
  { id: 'nl-icp-filed', label: 'ICP-aangifte / Opgaaf ICP filed for intra-EU B2B supplies & acquisitions this month (or confirmed nil)', tag: 'NL' },
  { id: 'nl-icp-reconciled', label: 'Filed ICP return reconciled to SnelStart EU transaction listings', tag: 'NL' },
  { id: 'nl-btw-filed', label: 'BTW-aangifte (VAT return) prepared, reviewed, and filed with Belastingdienst', tag: 'NL' },
  { id: 'nl-btw-reconciled', label: 'Filed BTW return reconciled to SnelStart BTW accounts; payment/refund booked', tag: 'NL' },
];

/**
 * Netherlands — periodic tax filings (quarterly BTW filers).
 * Monthly filers: complete BTW and ICP in the monthly checklist above.
 */
export const NL_QUARTERLY_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'nl-btw-filed-q', label: 'BTW-aangifte (VAT return) prepared, reviewed, and filed with Belastingdienst', tag: 'NL' },
  { id: 'nl-btw-reconciled-q', label: 'Filed BTW return reconciled to SnelStart BTW accounts; payment/refund booked', tag: 'NL' },
  { id: 'nl-oss', label: 'OSS / IOSS return filed if B2C EU sales via one-stop-shop (or confirmed not applicable)', tag: 'NL' },
  { id: 'nl-intrastat', label: 'Intrastat (goederen) filed if dispatch/arrival thresholds exceeded (or confirmed below)', tag: 'NL' },
  { id: 'nl-suppletie', label: 'Prior-period errors assessed; suppletie (correction return) filed if needed', tag: 'NL' },
  { id: 'nl-filing-frequency', label: 'BTW filing frequency (monthly vs quarterly) still appropriate for turnover', tag: 'NL' },
];

export const NL_ANNUAL_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'nl-year-close', label: 'Year-end closing entries prepared (accruals, depreciation, provisions)', tag: 'NL' },
  { id: 'nl-annual-accounts', label: 'Annual accounts data package ready for accountant (trial balance, schedules)', tag: 'NL' },
  { id: 'nl-vpb-support', label: 'VPB (corporate income tax) support: permanent/temporary differences flagged', tag: 'NL' },
  { id: 'nl-dga', label: 'DGA / shareholder loan and dividend transactions reviewed for tax reporting', tag: 'NL' },
  { id: 'nl-kvk-ubo', label: 'KvK / UBO register obligations confirmed current (if applicable)', tag: 'NL' },
  { id: 'nl-auditfile', label: 'Audit file (XAF) export available if Belastingdienst or accountant requests', tag: 'NL' },
  { id: 'nl-retention', label: '7/10-year document retention confirmed for the closing year', tag: 'NL' },
];

/** Switzerland — ERPNext monthly bookkeeping controls. */
export const CH_MONTHLY_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'ch-period-review', label: 'ERPNext period reviewed — all transactions posted, no draft entries left open', tag: 'CH' },
  { id: 'ch-mwst-recon', label: 'MWST accounts reconciled to open items and expected return position', tag: 'CH' },
  { id: 'ch-import-mwst', label: 'Import MWST and foreign supplier invoices handled correctly (reverse charge / Zoll)', tag: 'CH' },
  { id: 'ch-invoice-compliance', label: 'Outgoing invoices meet CH requirements (UID, MWST-nr, rates, QR-bill if used)', tag: 'CH' },
  { id: 'ch-fx-review', label: 'Foreign-currency balances and FX differences reviewed and adjusted', tag: 'CH' },
];

/** Switzerland — MWST periodic return (quarterly or semi-annual per ESTV agreement). */
export const CH_QUARTERLY_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'ch-mwst-filed', label: 'MWST-Abrechnung (Form 200/650) prepared, reviewed, and filed with ESTV / canton', tag: 'CH' },
  { id: 'ch-mwst-reconciled', label: 'Filed MWST return reconciled to ERPNext MWST accounts; payment/refund booked', tag: 'CH' },
  { id: 'ch-mwst-method', label: 'MWST method (effektiv vs Saldosteuersatz) still appropriate for turnover', tag: 'CH' },
  { id: 'ch-eu-supplies', label: 'Cross-border supplies to EU tracked for any NL ICP / reporting obligations', tag: 'CH' },
  { id: 'ch-form-ziffern', label: 'Return Ziffern (200/221/230 etc.) reconciled to ledger totals', tag: 'CH' },
];

export const CH_ANNUAL_ITEMS: readonly ChecklistItemDef[] = [
  { id: 'ch-year-close', label: 'Jahresabschluss support: year-end trial balance and schedules for tax advisor', tag: 'CH' },
  { id: 'ch-mwst-annual', label: 'Annual MWST reconciliation (Form 650/651) completed if required', tag: 'CH' },
  { id: 'ch-verrechnungssteuer', label: 'Verrechnungssteuer (withholding tax) on dividends/interest reviewed', tag: 'CH' },
  { id: 'ch-payroll-year', label: 'Payroll / social insurance year-end reconciled (AHV/IV/EO/BVG if applicable)', tag: 'CH' },
  { id: 'ch-retention', label: '10-year business record retention confirmed for the closing year', tag: 'CH' },
];

/** Static reference — filing deadlines and key obligations (not checkboxes). */
export const COMPLIANCE_REFERENCE = [
  {
    id: 'nl-deadlines',
    title: 'Netherlands — key filing deadlines',
    bullets: [
      'BTW-aangifte (VAT return): due by the last day of the month after the period (monthly or quarterly per Belastingdienst). Checklists open 3 weeks before each deadline.',
      'ICP-aangifte (Opgaaf ICP / intra-EU listing): filed monthly (or quarterly if BTW is quarterly) — same deadline as BTW return.',
      'Intrastat: monthly, due by the 15th of the month after the reporting month (if above threshold).',
      'OSS (one-stop-shop): quarterly, due end of month after the quarter.',
      'VPB (corporate tax): annual return, typically within 5 months after fiscal year-end (extensions possible).',
      'Document retention: 7 years general; 10 years for real estate and certain VAT records.',
    ],
  },
  {
    id: 'ch-deadlines',
    title: 'Switzerland — key filing deadlines',
    bullets: [
      'MWST-Abrechnung (VAT return): typically quarterly or semi-annually — due 60 days after period end (confirm with ESTV agreement). Checklists open 3 weeks before each deadline.',
      'Saldosteuersatz (flat-rate): annual reconciliation if using Vereinbarung.',
      'Jahresabschluss / tax return: deadlines vary by canton and entity type — coordinate with tax advisor.',
      'Verrechnungssteuer: 35% withholding on dividends/interest — reclaim or gross-up per treaty.',
      'Document retention: 10 years for business records (OR Art. 958f).',
    ],
  },
  {
    id: 'shared',
    title: 'Cross-border (NL ↔ CH)',
    bullets: [
      'Intercompany invoices must be at arm\'s length with supporting documentation.',
      'NL entity selling B2B to EU customers: ICP listing required; CH entity may trigger NL reporting if customer is NL VAT-registered.',
      'Import/export: ensure customs documents match booked amounts and VAT/MWST treatment.',
      'Transfer pricing and DGA/shareholder rules apply on related-party flows — flag unusual items early.',
    ],
  },
] as const;

export const WEEKLY_ITEMS = [...WEEKLY_DAILY_SUMMARY_ITEMS, ...WEEKLY_REVIEW_ITEMS] as const;

export const DEFAULT_SOP_SECTIONS: Omit<SopSection, 'updatedAt'>[] = [
  {
    id: 'general',
    title: 'General principles',
    content:
      'Double-entry bookkeeping. No posting without supporting documents. Use suspense / "To clarify" only temporarily with a note. Consistent naming rules per company. Every supplier bill must be entered before payment (or flagged immediately if paid without invoice).',
  },
  {
    id: 'sales',
    title: 'Sales process per company',
    content:
      'NL (SnelStart): invoice numbering sequential, BTW-id on invoice, correct BTW rate per customer (NL / EU B2B with VAT-id / export). CH (ERPNext): UID and MWST-nr on invoice, correct rate (8.1% normal / 2.6% accommodation / 3.8% hotel). Document templates, numbering, and typical GL accounts per company.',
  },
  {
    id: 'purchases',
    title: 'Purchases & expenses per company',
    content:
      'Document: how bills arrive (email, portal, post), approval rules, who can authorise payment. NL: BTW codes (21%, 9%, 0%, verlegd, EU). CH: MWST codes (normal, reduced, exempt, import). Note recurring suppliers and coding decisions. G-rekening rules if applicable.',
  },
  {
    id: 'bank-recon',
    title: 'Bank & card reconciliation',
    content:
      'Step-by-step for each bank account in each system. Include statement dates, feed import steps, and common matching patterns. Target: weekly reconciliation during the month; mandatory to statement date at month-end.',
  },
  {
    id: 'vat-nl',
    title: 'NL — BTW, ICP & related filings',
    content:
      'BTW-aangifte: filing frequency (monthly/quarterly), rubriek mapping in SnelStart, payment/refund booking.\nICP-aangifte (Opgaaf ICP): list all intra-EU B2B supplies and acquisitions each period — filed together with BTW return.\nIntrastat: thresholds and procedure if goods cross EU borders.\nOSS: only if B2C EU sales via one-stop-shop.\nSuppletie: process if prior-period correction needed.',
  },
  {
    id: 'vat-ch',
    title: 'CH — MWST & related filings',
    content:
      'MWST-Abrechnung: filing frequency (quarterly/semi-annual per ESTV), Form 200/650 mapping in ERPNext, Ziffern reconciliation.\nSaldosteuersatz: only if Vereinbarung in place — annual true-up.\nImport MWST: customs documents and reverse-charge treatment.\nCross-border to EU: track for NL ICP obligations on the Dutch entity.',
  },
  {
    id: 'edge-cases',
    title: 'Special / edge cases',
    content:
      'Shareholder expenses (DGA), intercompany recharges NL↔CH, private use allocations, FX differences, prepayments/accruals. Document final decisions with examples and booking references.',
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
      'Record all supplier invoices and expenses from documents provided — no payment without a booked bill (or immediate flag).',
      'Record payments to suppliers, keep an updated list of unpaid bills, and flag overdue items.',
      'NL: apply correct BTW treatment (including verlegd / EU acquisitions). CH: apply correct MWST (including import).',
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
      'At month-end, review trial balance: bank, receivables, payables, VAT/MWST, payroll, shareholder and intercompany accounts, and suspense.',
      'Propose corrections or adjustments and prepare a short summary of issues and open questions.',
      'Use the Compliance tab for month-end, quarterly (BTW/ICP/MWST), and annual checklists.',
    ],
  },
  {
    id: 'nl-compliance',
    title: 'Netherlands — tax & statutory filings',
    bullets: [
      'BTW-aangifte (VAT return): file per Belastingdienst schedule; reconcile to SnelStart before payment.',
      'ICP-aangifte (Opgaaf ICP): file monthly with BTW return (or quarterly if on quarterly BTW schedule).',
      'Intrastat, OSS, suppletie: file when applicable.',
      'Annual: VPB support, jaarrekening data, KvK/UBO if applicable.',
    ],
  },
  {
    id: 'ch-compliance',
    title: 'Switzerland — tax & statutory filings',
    bullets: [
      'MWST-Abrechnung: file per ESTV agreement (quarterly or semi-annual); reconcile to ERPNext.',
      'Annual MWST reconciliation (Form 650/651) and Jahresabschluss support for tax advisor.',
      'Verrechnungssteuer on dividends/interest; payroll year-end if applicable.',
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
    monthlyChecks: {},
    quarterlyChecks: {},
    annualChecks: {},
    complianceNotes: {},
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
      monthlyChecks: parsed.monthlyChecks ?? {},
      quarterlyChecks: parsed.quarterlyChecks ?? {},
      annualChecks: parsed.annualChecks ?? {},
      complianceNotes: parsed.complianceNotes ?? {},
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

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getQuarterKey(date: Date): string {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${quarter}`;
}

export function getYearKey(date: Date): string {
  return String(date.getFullYear());
}

export function shiftMonthKey(key: string, months: number): string {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + months, 1);
  return getMonthKey(d);
}

export function shiftQuarterKey(key: string, quarters: number): string {
  const match = key.match(/^(\d{4})-Q(\d)$/);
  if (!match) return getQuarterKey(new Date());
  const d = new Date(Number(match[1]), (Number(match[2]) - 1) * 3 + quarters * 3, 1);
  return getQuarterKey(d);
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

export const ENTITY_TAG_STYLES: Record<EntityTag, string> = {
  NL: 'bg-orange-100 text-orange-800 border-orange-200',
  CH: 'bg-red-100 text-red-800 border-red-200',
  Both: 'bg-slate-100 text-slate-600 border-slate-200',
};

