import { useCallback, useEffect, useMemo, useState } from 'react';
import TrackerShell, { type TrackerTab } from '../components/bookkeeping/TrackerShell';
import RoleDescription from '../components/bookkeeping/RoleDescription';
import ChecklistPanel from '../components/bookkeeping/ChecklistPanel';
import InfoRequestsTable from '../components/bookkeeping/InfoRequestsTable';
import ComplianceSchedulePanel from '../components/bookkeeping/ComplianceSchedulePanel';
import ComplianceDeadlineBanner from '../components/bookkeeping/ComplianceDeadlineBanner';
import {
  WEEKLY_DAILY_SUMMARY_ITEMS,
  WEEKLY_REVIEW_ITEMS,
  MONTHLY_PREP_ITEMS,
  MONTHLY_CLOSE_ITEMS,
  NL_MONTHLY_ITEMS,
  NL_QUARTERLY_ITEMS,
  NL_ANNUAL_ITEMS,
  CH_MONTHLY_ITEMS,
  CH_QUARTERLY_ITEMS,
  CH_ANNUAL_ITEMS,
  QUARTERLY_PREP_ITEMS,
  ANNUAL_PREP_ITEMS,
  COMPLIANCE_REFERENCE,
  type TrackerState,
  type WeeklyStatusUpdate,
  loadState,
  saveState,
  defaultState,
  formatDateKey,
  getIsoWeekKey,
  getMonthKey,
  getQuarterKey,
  getYearKey,
  shiftMonthKey,
  shiftQuarterKey,
  exportStateAsJson,
} from '../lib/bookkeepingTracker';
import {
  ensureActiveCompliancePeriods,
  listActiveFilingSchedules,
  getMonthlySchedule,
  getQuarterlySchedules,
  getAnnualSchedules,
  isPeriodChecklistOpen,
  formatDisplayDate,
  PREP_LEAD_DAYS,
  type FilingSchedule,
} from '../lib/complianceDeadlines';

function PeriodNav({
  label,
  value,
  onChange,
  onPrev,
  onNext,
  onToday,
  inputType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  inputType: 'month' | 'number' | 'quarter';
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button type="button" onClick={onPrev} className="px-2 py-1 rounded border border-slate-300 text-sm hover:bg-slate-50">
        ←
      </button>
      {inputType === 'month' ? (
        <input
          type="month"
          value={value}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm"
        />
      ) : inputType === 'quarter' ? (
        <span className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800">
          {value}
        </span>
      ) : (
        <input
          type="number"
          value={value}
          min={2020}
          max={2099}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="w-20 rounded border border-slate-300 px-3 py-1.5 text-sm"
        />
      )}
      <button type="button" onClick={onNext} className="px-2 py-1 rounded border border-slate-300 text-sm hover:bg-slate-50">
        →
      </button>
      <button
        type="button"
        onClick={onToday}
        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-900"
      >
        Current
      </button>
    </div>
  );
}

function WeekNav({
  value,
  onChange,
  onPrev,
  onNext,
  onToday,
}: {
  value: string;
  onChange: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-700">Week</span>
      <button type="button" onClick={onPrev} className="px-2 py-1 rounded border border-slate-300 text-sm hover:bg-slate-50">
        ←
      </button>
      <input
        type="week"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (v) {
            const [y, w] = v.split('-W');
            onChange(`${y}-W${w}`);
          }
        }}
        className="rounded border border-slate-300 px-3 py-1.5 text-sm"
      />
      <button type="button" onClick={onNext} className="px-2 py-1 rounded border border-slate-300 text-sm hover:bg-slate-50">
        →
      </button>
      <button
        type="button"
        onClick={onToday}
        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-900"
      >
        This week
      </button>
    </div>
  );
}

function SummaryField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />
    </label>
  );
}

export default function BookkeepingTracker() {
  const [activeTab, setActiveTab] = useState<TrackerTab>('weekly');
  const [state, setState] = useState<TrackerState>(defaultState);
  const [selectedWeek, setSelectedWeek] = useState(() => getIsoWeekKey(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(() => getMonthKey(new Date()));
  const [selectedQuarter, setSelectedQuarter] = useState(() => getQuarterKey(new Date()));
  const [selectedYear, setSelectedYear] = useState(() => getYearKey(new Date()));

  const [weeklyDraft, setWeeklyDraft] = useState({
    workDone: '',
    reconciliation: '',
    overdueItems: '',
    openQuestions: '',
  });

  useEffect(() => {
    setState(ensureActiveCompliancePeriods(loadState()));
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeSchedules = useMemo(() => listActiveFilingSchedules(state), [state]);

  const monthlySchedule = useMemo(
    () => getMonthlySchedule(selectedMonth, state),
    [selectedMonth, state],
  );
  const quarterlySchedules = useMemo(
    () => getQuarterlySchedules(selectedQuarter, state),
    [selectedQuarter, state],
  );
  const annualSchedules = useMemo(
    () => getAnnualSchedules(selectedYear, state),
    [selectedYear, state],
  );

  const monthlyOpen = isPeriodChecklistOpen(monthlySchedule);
  const quarterlyOpen = quarterlySchedules.some((s) => isPeriodChecklistOpen(s));
  const annualOpen = annualSchedules.some((s) => isPeriodChecklistOpen(s));

  const selectFilingSchedule = (schedule: FilingSchedule) => {
    if (schedule.cadence === 'monthly') setSelectedMonth(schedule.periodKey);
    if (schedule.cadence === 'quarterly') setSelectedQuarter(schedule.periodKey);
    if (schedule.cadence === 'annual') setSelectedYear(schedule.periodKey);
  };

  const patch = useCallback((partial: Partial<TrackerState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const weeklyChecks = state.weeklyChecks[selectedWeek];
  const monthlyChecks = state.monthlyChecks[selectedMonth];
  const quarterlyChecks = state.quarterlyChecks[selectedQuarter];
  const annualChecks = state.annualChecks[selectedYear];
  const complianceNoteKey = `${selectedMonth}|${selectedQuarter}|${selectedYear}`;

  const shiftWeek = (weeks: number) => {
    const match = selectedWeek.match(/^(\d{4})-W(\d{2})$/);
    if (!match) return;
    const d = new Date(Number(match[1]), 0, 1 + (Number(match[2]) - 1) * 7);
    d.setDate(d.getDate() + weeks * 7);
    setSelectedWeek(getIsoWeekKey(d));
  };

  const existingWeeklyUpdate = useMemo(
    () => state.weeklyUpdates.find((u) => u.weekKey === selectedWeek),
    [state.weeklyUpdates, selectedWeek],
  );

  useEffect(() => {
    if (existingWeeklyUpdate) {
      setWeeklyDraft({
        workDone: existingWeeklyUpdate.workDone,
        reconciliation: existingWeeklyUpdate.reconciliation,
        overdueItems: existingWeeklyUpdate.overdueItems,
        openQuestions: existingWeeklyUpdate.openQuestions,
      });
    } else {
      setWeeklyDraft({ workDone: '', reconciliation: '', overdueItems: '', openQuestions: '' });
    }
  }, [selectedWeek, existingWeeklyUpdate]);

  const toggleCheck = (id: string, checked: boolean) => {
    patch({
      weeklyChecks: {
        ...state.weeklyChecks,
        [selectedWeek]: { ...weeklyChecks, [id]: checked },
      },
    });
  };

  const toggleMonthlyCheck = (id: string, checked: boolean) => {
    patch({
      monthlyChecks: {
        ...state.monthlyChecks,
        [selectedMonth]: { ...monthlyChecks, [id]: checked },
      },
    });
  };

  const toggleQuarterlyCheck = (id: string, checked: boolean) => {
    patch({
      quarterlyChecks: {
        ...state.quarterlyChecks,
        [selectedQuarter]: { ...quarterlyChecks, [id]: checked },
      },
    });
  };

  const toggleAnnualCheck = (id: string, checked: boolean) => {
    patch({
      annualChecks: {
        ...state.annualChecks,
        [selectedYear]: { ...annualChecks, [id]: checked },
      },
    });
  };

  const resetCompliancePeriod = () => {
    patch({
      monthlyChecks: { ...state.monthlyChecks, [selectedMonth]: {} },
      quarterlyChecks: { ...state.quarterlyChecks, [selectedQuarter]: {} },
      annualChecks: { ...state.annualChecks, [selectedYear]: {} },
      complianceNotes: { ...state.complianceNotes, [complianceNoteKey]: '' },
    });
  };

  const resetWeek = () => {
    patch({
      weeklyChecks: { ...state.weeklyChecks, [selectedWeek]: {} },
      weeklyNotes: { ...state.weeklyNotes, [selectedWeek]: '' },
    });
  };

  const saveWeeklyUpdate = () => {
    const entry: WeeklyStatusUpdate = {
      id: existingWeeklyUpdate?.id ?? crypto.randomUUID(),
      weekKey: selectedWeek,
      submittedAt: new Date().toISOString(),
      ...weeklyDraft,
    };
    const others = state.weeklyUpdates.filter((u) => u.weekKey !== selectedWeek);
    patch({ weeklyUpdates: [entry, ...others] });
  };

  const copyWeeklyUpdate = () => {
    const text = [
      `Weekly status — ${selectedWeek}`,
      '',
      'Work done this week:',
      weeklyDraft.workDone || '(none)',
      '',
      'Reconciliation status:',
      weeklyDraft.reconciliation || '(none)',
      '',
      'Overdue invoices / bills:',
      weeklyDraft.overdueItems || '(none)',
      '',
      'Open questions / challenges:',
      weeklyDraft.openQuestions || '(none)',
    ].join('\n');
    void navigator.clipboard.writeText(text);
  };

  const handleExport = () => {
    const blob = new Blob([exportStateAsJson(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookkeeping-tracker-${formatDateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (json: string) => {
    try {
      const parsed = JSON.parse(json) as Partial<TrackerState>;
      setState({
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
      });
    } catch {
      alert('Invalid backup file.');
    }
  };

  const weekNav = (
    <WeekNav
      value={selectedWeek}
      onChange={setSelectedWeek}
      onPrev={() => shiftWeek(-1)}
      onNext={() => shiftWeek(1)}
      onToday={() => setSelectedWeek(getIsoWeekKey(new Date()))}
    />
  );

  return (
    <TrackerShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onExport={handleExport}
      onImport={handleImport}
    >
      {activeTab === 'role' && <RoleDescription />}

      {activeTab === 'weekly' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm text-emerald-900">
              Complete once per week on a fixed day. Confirm all daily work for the week in the first checklist,
              then finish the weekly review and status update below.
            </p>
          </div>

          <ChecklistPanel
            title="Daily work — week summary"
            subtitle="Confirm these were done across all working days this week (no per-day tracking)."
            items={WEEKLY_DAILY_SUMMARY_ITEMS}
            checks={weeklyChecks}
            onToggle={toggleCheck}
            headerExtra={weekNav}
            showTags
          />

          <ChecklistPanel
            title="Weekly review"
            subtitle="Per company where relevant. Ideally completed on the same fixed day each week."
            items={WEEKLY_REVIEW_ITEMS}
            checks={weeklyChecks}
            onToggle={toggleCheck}
            onReset={resetWeek}
            showTags
            footerExtra={
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Notes for this week</span>
                <textarea
                  value={state.weeklyNotes[selectedWeek] ?? ''}
                  onChange={(e) =>
                    patch({ weeklyNotes: { ...state.weeklyNotes, [selectedWeek]: e.target.value } })
                  }
                  rows={3}
                  placeholder="Questions, issues, or reminders to include in the status update…"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            }
          />

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Weekly status update</h2>
                <p className="text-sm text-slate-600">
                  Short bullet points for your manager — week {selectedWeek}
                  {existingWeeklyUpdate && (
                    <span className="text-emerald-700">
                      {' '}
                      · saved {new Date(existingWeeklyUpdate.submittedAt).toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyWeeklyUpdate}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50"
                >
                  Copy message
                </button>
                <button
                  type="button"
                  onClick={saveWeeklyUpdate}
                  className="px-4 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Save update
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryField
                label="Work done this week"
                value={weeklyDraft.workDone}
                onChange={(v) => setWeeklyDraft((d) => ({ ...d, workDone: v }))}
                placeholder={'• Entered NL purchases through Friday\n• Reconciled CH main account'}
              />
              <SummaryField
                label="Reconciliation status (per bank account)"
                value={weeklyDraft.reconciliation}
                onChange={(v) => setWeeklyDraft((d) => ({ ...d, reconciliation: v }))}
                placeholder={'• CH UBS — reconciled to 31.05\n• NL ING — 2 items in suspense'}
              />
              <SummaryField
                label="Overdue invoices / bills needing attention"
                value={weeklyDraft.overdueItems}
                onChange={(v) => setWeeklyDraft((d) => ({ ...d, overdueItems: v }))}
                placeholder={'• Customer X — invoice #123, 45 days\n• Supplier Y — due next week'}
              />
              <SummaryField
                label="Key open questions / challenges"
                value={weeklyDraft.openQuestions}
                onChange={(v) => setWeeklyDraft((d) => ({ ...d, openQuestions: v }))}
                placeholder={'• Missing receipt for CH transfer on 12.05\n• VAT code for new supplier?'}
              />
            </div>
          </section>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm text-emerald-900">
              Monthly, quarterly, and annual checklists are <strong>auto-created {PREP_LEAD_DAYS} days before</strong>{' '}
              each filing deadline. Complete preparation items first, then filings. Confirm deadlines with your tax
              advisor.
            </p>
          </div>

          <ComplianceSchedulePanel schedules={activeSchedules} onSelect={selectFilingSchedule} />

          <div className="grid gap-4 sm:grid-cols-3">
            <PeriodNav
              label="Month"
              value={selectedMonth}
              onChange={setSelectedMonth}
              onPrev={() => setSelectedMonth(shiftMonthKey(selectedMonth, -1))}
              onNext={() => setSelectedMonth(shiftMonthKey(selectedMonth, 1))}
              onToday={() => setSelectedMonth(getMonthKey(new Date()))}
              inputType="month"
            />
            <PeriodNav
              label="Quarter"
              value={selectedQuarter}
              onChange={setSelectedQuarter}
              onPrev={() => setSelectedQuarter(shiftQuarterKey(selectedQuarter, -1))}
              onNext={() => setSelectedQuarter(shiftQuarterKey(selectedQuarter, 1))}
              onToday={() => setSelectedQuarter(getQuarterKey(new Date()))}
              inputType="quarter"
            />
            <PeriodNav
              label="Year"
              value={selectedYear}
              onChange={setSelectedYear}
              onPrev={() => setSelectedYear(String(Number(selectedYear) - 1))}
              onNext={() => setSelectedYear(String(Number(selectedYear) + 1))}
              onToday={() => setSelectedYear(getYearKey(new Date()))}
              inputType="number"
            />
          </div>

          <ChecklistPanel
            title="Monthly preparation (≥3 weeks before deadline)"
            subtitle={`${selectedMonth} — start by ${formatDisplayDate(monthlySchedule.prepStart)}`}
            items={MONTHLY_PREP_ITEMS}
            checks={monthlyChecks}
            onToggle={toggleMonthlyCheck}
            showTags
            disabled={!monthlyOpen}
            disabledMessage={
              !monthlyOpen
                ? `Opens on ${formatDisplayDate(monthlySchedule.prepStart)} (${PREP_LEAD_DAYS} days before filing due ${formatDisplayDate(monthlySchedule.filingDeadline)}).`
                : undefined
            }
            bannerExtra={<ComplianceDeadlineBanner schedule={monthlySchedule} />}
          />

          <ChecklistPanel
            title="Month-end close — all entities"
            subtitle={`Close for ${selectedMonth}. Complete before tax filings.`}
            items={MONTHLY_CLOSE_ITEMS}
            checks={monthlyChecks}
            onToggle={toggleMonthlyCheck}
            showTags
            disabled={!monthlyOpen}
          />

          <ChecklistPanel
            title="Netherlands (SnelStart) — monthly controls & ICP"
            subtitle="BTW ledger hygiene, ICP-aangifte (Opgaaf ICP), and NL-specific booking rules."
            items={NL_MONTHLY_ITEMS}
            checks={monthlyChecks}
            onToggle={toggleMonthlyCheck}
            showTags
            disabled={!monthlyOpen}
          />

          <ChecklistPanel
            title="Switzerland (ERPNext) — monthly controls"
            subtitle="MWST ledger hygiene and CH-specific booking rules."
            items={CH_MONTHLY_ITEMS}
            checks={monthlyChecks}
            onToggle={toggleMonthlyCheck}
            showTags
            disabled={!monthlyOpen}
          />

          <ChecklistPanel
            title="Quarterly preparation (≥3 weeks before deadline)"
            subtitle={`${selectedQuarter} — NL due ${formatDisplayDate(quarterlySchedules[0].filingDeadline)}, CH due ${formatDisplayDate(quarterlySchedules[1].filingDeadline)}`}
            items={QUARTERLY_PREP_ITEMS}
            checks={quarterlyChecks}
            onToggle={toggleQuarterlyCheck}
            showTags
            disabled={!quarterlyOpen}
            disabledMessage={
              !quarterlyOpen
                ? `Opens on ${formatDisplayDate(quarterlySchedules[0].prepStart)} (NL) / ${formatDisplayDate(quarterlySchedules[1].prepStart)} (CH).`
                : undefined
            }
            bannerExtra={
              <div className="space-y-2">
                {quarterlySchedules.map((schedule) => (
                  <ComplianceDeadlineBanner key={schedule.filingLabel} schedule={schedule} />
                ))}
              </div>
            }
          />

          <ChecklistPanel
            title="Netherlands — BTW & periodic filings"
            subtitle={`Quarter ${selectedQuarter}. For quarterly BTW filers only — monthly filers complete BTW and ICP in the monthly checklist.`}
            items={NL_QUARTERLY_ITEMS}
            checks={quarterlyChecks}
            onToggle={toggleQuarterlyCheck}
            showTags
            disabled={!quarterlyOpen}
          />

          <ChecklistPanel
            title="Switzerland — MWST periodic return"
            subtitle={`Quarter ${selectedQuarter}. Filing frequency may be quarterly or semi-annual per ESTV agreement.`}
            items={CH_QUARTERLY_ITEMS}
            checks={quarterlyChecks}
            onToggle={toggleQuarterlyCheck}
            showTags
            disabled={!quarterlyOpen}
          />

          <ChecklistPanel
            title="Annual preparation (≥3 weeks before deadline)"
            subtitle={`FY ${selectedYear} — NL due ${formatDisplayDate(annualSchedules[0].filingDeadline)}, CH due ${formatDisplayDate(annualSchedules[1].filingDeadline)}`}
            items={ANNUAL_PREP_ITEMS}
            checks={annualChecks}
            onToggle={toggleAnnualCheck}
            showTags
            disabled={!annualOpen}
            disabledMessage={
              !annualOpen
                ? `Opens on ${formatDisplayDate(annualSchedules[0].prepStart)} (NL) / ${formatDisplayDate(annualSchedules[1].prepStart)} (CH).`
                : undefined
            }
            bannerExtra={
              <div className="space-y-2">
                {annualSchedules.map((schedule) => (
                  <ComplianceDeadlineBanner key={schedule.filingLabel} schedule={schedule} />
                ))}
              </div>
            }
          />

          <ChecklistPanel
            title="Netherlands — annual obligations"
            subtitle={`Fiscal year ${selectedYear}.`}
            items={NL_ANNUAL_ITEMS}
            checks={annualChecks}
            onToggle={toggleAnnualCheck}
            showTags
            disabled={!annualOpen}
          />

          <ChecklistPanel
            title="Switzerland — annual obligations"
            subtitle={`Fiscal year ${selectedYear}.`}
            items={CH_ANNUAL_ITEMS}
            checks={annualChecks}
            onToggle={toggleAnnualCheck}
            onReset={resetCompliancePeriod}
            showTags
            disabled={!annualOpen}
            footerExtra={
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Compliance notes for this period</span>
                <textarea
                  value={state.complianceNotes[complianceNoteKey] ?? ''}
                  onChange={(e) =>
                    patch({ complianceNotes: { ...state.complianceNotes, [complianceNoteKey]: e.target.value } })
                  }
                  rows={3}
                  placeholder="Filing references, advisor confirmations, deadline extensions, nil-return notes…"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            }
          />

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Filing deadlines reference</h2>
            <p className="text-sm text-slate-600">
              Static reference — always confirm current deadlines with Belastingdienst (NL) and ESTV / canton (CH).
            </p>
            <div className="grid gap-4 lg:grid-cols-3">
              {COMPLIANCE_REFERENCE.map((section) => (
                <div key={section.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">{section.title}</h3>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'requests' && (
        <InfoRequestsTable
          requests={state.infoRequests}
          onChange={(infoRequests) => patch({ infoRequests })}
        />
      )}

      {activeTab === 'updates' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Weekly status log</h2>
          <p className="text-sm text-slate-600">History of saved weekly updates. Newest first.</p>
          {state.weeklyUpdates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
              No updates saved yet. Use the Weekly tab to write and save your first update.
            </div>
          ) : (
            <div className="space-y-3">
              {state.weeklyUpdates.map((update) => (
                <article key={update.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-slate-900">Week {update.weekKey}</h3>
                    <time className="text-xs text-slate-500">{new Date(update.submittedAt).toLocaleString()}</time>
                  </div>
                  <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                    {(
                      [
                        ['Work done', update.workDone],
                        ['Reconciliation', update.reconciliation],
                        ['Overdue items', update.overdueItems],
                        ['Open questions', update.openQuestions],
                      ] as const
                    ).map(([label, text]) => (
                      <div key={label}>
                        <dt className="font-medium text-slate-700">{label}</dt>
                        <dd className="mt-0.5 text-slate-600 whitespace-pre-wrap">{text || '—'}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWeek(update.weekKey);
                      setActiveTab('weekly');
                    }}
                    className="mt-3 text-xs font-medium text-emerald-700 hover:text-emerald-900"
                  >
                    Edit in Weekly tab →
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sop' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Bookkeeping manual (SOP)</h2>
            <p className="text-sm text-slate-600">
              Build and maintain process documentation over time. Edits save automatically.
            </p>
          </div>
          {state.sopSections.map((section, index) => (
            <section key={section.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-2">
              <input
                value={section.title}
                onChange={(e) => {
                  const sopSections = [...state.sopSections];
                  sopSections[index] = {
                    ...section,
                    title: e.target.value,
                    updatedAt: new Date().toISOString(),
                  };
                  patch({ sopSections });
                }}
                className="w-full text-base font-semibold text-slate-900 border-0 border-b border-transparent focus:border-emerald-500 focus:ring-0 px-0"
              />
              <textarea
                value={section.content}
                onChange={(e) => {
                  const sopSections = [...state.sopSections];
                  sopSections[index] = {
                    ...section,
                    content: e.target.value,
                    updatedAt: new Date().toISOString(),
                  };
                  patch({ sopSections });
                }}
                rows={5}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y"
              />
              <p className="text-xs text-slate-500">
                Last updated {new Date(section.updatedAt).toLocaleString()}
              </p>
            </section>
          ))}
          <button
            type="button"
            onClick={() =>
              patch({
                sopSections: [
                  ...state.sopSections,
                  {
                    id: crypto.randomUUID(),
                    title: 'New section',
                    content: '',
                    updatedAt: new Date().toISOString(),
                  },
                ],
              })
            }
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            + Add section
          </button>
        </div>
      )}
    </TrackerShell>
  );
}
