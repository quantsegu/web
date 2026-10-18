import { useState } from 'react';
import { INK } from './chartTokens';

export interface StackSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
}

interface StackedColumnsProps {
  categories: string[];
  series: StackSeries[];
  unit: string;
  ariaLabel: string;
  digits?: number;
}

/** Stacked columns with a 2px surface gap between segments, total labels, legend and a hover readout. */
export default function StackedColumns({ categories, series, unit, ariaLabel, digits = 1 }: StackedColumnsProps) {
  const [hover, setHover] = useState<{ col: number; key?: string } | null>(null);

  const W = 560;
  const H = 280;
  const padL = 36;
  const padR = 8;
  const padT = 22;
  const padB = 28;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const totals = categories.map((_, i) => series.reduce((s, x) => s + x.values[i], 0));
  const maxTotal = Math.max(...totals);
  const step = maxTotal > 60 ? 20 : 10;
  const yMax = Math.ceil(maxTotal / step) * step;
  const ticks: number[] = [];
  for (let t = 0; t <= yMax; t += step) ticks.push(t);
  const colW = plotW / categories.length;
  const barW = Math.min(52, colW * 0.6);
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;

  const readout = (() => {
    if (!hover) return 'Hover or tap a column for values.';
    const total = totals[hover.col];
    if (hover.key) {
      const s = series.find((x) => x.key === hover.key)!;
      const v = s.values[hover.col];
      return `${categories[hover.col]} · ${s.label}: ${v.toFixed(digits)} ${unit} (${((v / total) * 100).toFixed(0)}% of ${total.toFixed(digits)})`;
    }
    return `${categories[hover.col]} · total ${total.toFixed(digits)} ${unit}`;
  })();

  return (
    <div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-2" aria-label="Legend">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5 text-xs text-gray-300">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} aria-hidden />
            {s.label}
          </li>
        ))}
      </ul>
      <p className="text-xs text-saffron-200 min-h-[1.25rem] mb-1" aria-live="polite">
        {readout}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke={t === 0 ? INK.axis : INK.grid} strokeWidth={1} />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill={INK.muted}>
              {t}
            </text>
          </g>
        ))}
        {categories.map((cat, i) => {
          const cx = padL + colW * i + colW / 2;
          let acc = 0;
          return (
            <g
              key={cat}
              opacity={hover && hover.col !== i ? 0.45 : 1}
              onMouseEnter={() => setHover({ col: i })}
              onMouseLeave={() => setHover(null)}
            >
              <rect x={cx - colW / 2} y={padT} width={colW} height={plotH} fill="transparent" />
              {series.map((s) => {
                const v = s.values[i];
                const y0 = y(acc);
                const y1 = y(acc + v);
                acc += v;
                const h = Math.max(0, y0 - y1 - 2);
                if (h <= 0) return null;
                return (
                  <rect
                    key={s.key}
                    x={cx - barW / 2}
                    y={y1}
                    width={barW}
                    height={h}
                    fill={s.color}
                    onMouseEnter={() => setHover({ col: i, key: s.key })}
                    onClick={() => setHover({ col: i, key: s.key })}
                  >
                    <title>{`${cat} · ${s.label}: ${v.toFixed(digits)} ${unit}`}</title>
                  </rect>
                );
              })}
              <text x={cx} y={y(totals[i]) - 6} textAnchor="middle" fontSize={11} fill={INK.primary} fontWeight={600}>
                {totals[i].toFixed(digits)}
              </text>
              <text x={cx} y={H - 8} textAnchor="middle" fontSize={10.5} fill={INK.secondary}>
                {cat}
              </text>
            </g>
          );
        })}
        <text x={padL} y={12} fontSize={10} fill={INK.muted}>
          {unit}
        </text>
      </svg>
    </div>
  );
}
