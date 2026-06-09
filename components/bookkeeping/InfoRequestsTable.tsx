import {
  ENTITIES,
  type InfoRequest,
  type InfoRequestStatus,
  createInfoRequest,
} from '../../lib/bookkeepingTracker';

const STATUSES: InfoRequestStatus[] = ['Open', 'Waiting', 'Resolved', 'Not needed'];

interface InfoRequestsTableProps {
  requests: InfoRequest[];
  onChange: (requests: InfoRequest[]) => void;
}

function updateRow(requests: InfoRequest[], id: string, patch: Partial<InfoRequest>): InfoRequest[] {
  return requests.map((r) => (r.id === id ? { ...r, ...patch } : r));
}

export default function InfoRequestsTable({ requests, onChange }: InfoRequestsTableProps) {
  const openCount = requests.filter((r) => r.status === 'Open' || r.status === 'Waiting').length;

  const addRow = () => onChange([createInfoRequest(), ...requests]);
  const removeRow = (id: string) => onChange(requests.filter((r) => r.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Information request list</h2>
          <p className="text-sm text-slate-600">
            Living list of missing documents and questions. {openCount} open or waiting.
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="shrink-0 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + Add item
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          No items yet. Add missing invoices, unclear transfers, or questions as they arise.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[1100px] w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600">
                <th className="px-3 py-2 font-semibold">Added</th>
                <th className="px-3 py-2 font-semibold">Entity</th>
                <th className="px-3 py-2 font-semibold">Account / area</th>
                <th className="px-3 py-2 font-semibold min-w-[180px]">Description</th>
                <th className="px-3 py-2 font-semibold">Value</th>
                <th className="px-3 py-2 font-semibold">Requested from</th>
                <th className="px-3 py-2 font-semibold">Requested</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Booking ref</th>
                <th className="px-3 py-2 font-semibold w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((row) => (
                <tr key={row.id} className="align-top hover:bg-slate-50/80">
                  <td className="px-2 py-2">
                    <input
                      type="date"
                      value={row.dateAdded}
                      onChange={(e) => onChange(updateRow(requests, row.id, { dateAdded: e.target.value }))}
                      className="w-[7.5rem] rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select
                      value={row.entity}
                      onChange={(e) => onChange(updateRow(requests, row.id, { entity: e.target.value }))}
                      className="w-36 rounded border border-slate-300 px-2 py-1 text-xs"
                    >
                      {ENTITIES.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input
                      value={row.accountArea}
                      onChange={(e) => onChange(updateRow(requests, row.id, { accountArea: e.target.value }))}
                      placeholder="e.g. Bank NL – transfer 14.05"
                      className="w-full min-w-[120px] rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <textarea
                      value={row.description}
                      onChange={(e) => onChange(updateRow(requests, row.id, { description: e.target.value }))}
                      rows={2}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs resize-y"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      value={row.value}
                      onChange={(e) => onChange(updateRow(requests, row.id, { value: e.target.value }))}
                      placeholder="CHF / EUR"
                      className="w-24 rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      value={row.requestedFrom}
                      onChange={(e) => onChange(updateRow(requests, row.id, { requestedFrom: e.target.value }))}
                      placeholder="You / accountant"
                      className="w-28 rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="date"
                      value={row.dateRequested}
                      onChange={(e) => onChange(updateRow(requests, row.id, { dateRequested: e.target.value }))}
                      className="w-[7.5rem] rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        onChange(updateRow(requests, row.id, { status: e.target.value as InfoRequestStatus }))
                      }
                      className={`rounded border px-2 py-1 text-xs font-medium ${
                        row.status === 'Open'
                          ? 'border-amber-300 bg-amber-50 text-amber-900'
                          : row.status === 'Waiting'
                            ? 'border-blue-300 bg-blue-50 text-blue-900'
                            : row.status === 'Resolved'
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                              : 'border-slate-300 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input
                      value={row.bookingRef}
                      onChange={(e) => onChange(updateRow(requests, row.id, { bookingRef: e.target.value }))}
                      placeholder="SnelStart / ERPNext ref"
                      className="w-32 rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="text-slate-400 hover:text-red-600 text-lg leading-none"
                      title="Remove"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
