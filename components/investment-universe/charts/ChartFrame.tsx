import { useState, type ReactNode } from 'react';
import { universeUi } from '../universeUi';

export interface ChartTable {
  head: string[];
  rows: (string | number)[][];
}

interface ChartFrameProps {
  title: string;
  subtitle?: string;
  source?: string;
  note?: string;
  table: ChartTable;
  children: ReactNode;
}

/** Figure wrapper: title, caption, source line, and a "view as table" toggle for every chart. */
export default function ChartFrame({ title, subtitle, source, note, table, children }: ChartFrameProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <figure className={universeUi.mapFrame}>
      <figcaption className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-sm sm:text-base">{title}</h3>
          {subtitle && <p className={universeUi.proseMuted}>{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-pressed={showTable}
          className="text-xs text-saffron-300 hover:text-white border border-saffron-500/25 rounded px-2 py-1 shrink-0 transition-colors"
        >
          {showTable ? 'View chart' : 'View as table'}
        </button>
      </figcaption>

      {showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr>
                {table.head.map((h) => (
                  <th key={h} className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-saffron-300 border-b border-saffron-500/20">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-2 py-1.5 text-gray-300 border-b border-saffron-500/10 tabular-nums">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}

      {(source || note) && (
        <p className="mt-3 text-[0.7rem] leading-relaxed text-gray-500">
          {note && <span>{note} </span>}
          {source && <span>Source: {source}</span>}
        </p>
      )}
    </figure>
  );
}
