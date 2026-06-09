import type { ReactNode } from 'react';

const TABS = [
  { id: 'role', label: 'Role' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'requests', label: 'Info requests' },
  { id: 'updates', label: 'Status log' },
  { id: 'sop', label: 'Manual' },
] as const;

export type TrackerTab = (typeof TABS)[number]['id'];

interface TrackerShellProps {
  activeTab: TrackerTab;
  onTabChange: (tab: TrackerTab) => void;
  onExport: () => void;
  onImport: (json: string) => void;
  children: ReactNode;
}

export default function TrackerShell({
  activeTab,
  onTabChange,
  onExport,
  onImport,
  children,
}: TrackerShellProps) {
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') onImport(reader.result);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Internal ops</p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Bookkeeping tracker</h1>
            <p className="text-sm text-slate-600">SnelStart (NL) · ERPNext (CH) — checklists & weekly status</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onExport}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
            >
              Export backup
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
            >
              Import backup
            </button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto pb-0 scrollbar-thin">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 text-xs text-slate-500">
        Data is stored locally in this browser. Export regularly for backup.
      </footer>
    </div>
  );
}
