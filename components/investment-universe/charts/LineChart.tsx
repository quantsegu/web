import { INK } from './chartTokens';

export interface LineSeries {
  label: string;
  color: string;
  values: number[];
}

interface LineChartProps {
  series: LineSeries[];
  xLabel: string;
  ariaLabel: string;
}

/** Minimal multi-series line chart: 2px lines, direct end labels, legend. */
export default function LineChart({ series, xLabel, ariaLabel }: LineChartProps) {
  const W = 560;
  const H = 240;
  const padL = 40;
  const padR = 90;
  const padT = 14;
  const padB = 30;
  const n = series[0].values.length;
  const all = series.flatMap((s) => s.values);
  const lo = Math.floor(Math.min(...all) / 10) * 10;
  const hi = Math.ceil(Math.max(...all) / 10) * 10;
  const sx = (i: number) => padL + (i / (n - 1)) * (W - padL - padR);
  const sy = (v: number) => padT + (H - padT - padB) - ((v - lo) / (hi - lo)) * (H - padT - padB);
  const ticks: number[] = [];
  const step = (hi - lo) / 4;
  for (let i = 0; i <= 4; i += 1) ticks.push(lo + step * i);

  return (
    <div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-2" aria-label="Legend">
        {series.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5 text-xs text-gray-300">
            <span className="w-3 h-0.5 rounded" style={{ background: s.color }} aria-hidden />
            {s.label}
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={sy(t)} y2={sy(t)} stroke={INK.grid} strokeWidth={0.8} />
            <text x={padL - 6} y={sy(t) + 3} textAnchor="end" fontSize={10} fill={INK.muted}>
              {Math.round(t)}
            </text>
          </g>
        ))}
        {series.map((s) => (
          <g key={s.label}>
            <path
              d={s.values.map((v, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')}
              stroke={s.color}
              strokeWidth={2}
              fill="none"
              strokeLinejoin="round"
            />
            <text x={sx(n - 1) + 6} y={sy(s.values[n - 1]) + 3} fontSize={10.5} fill={INK.primary}>
              {s.values[n - 1].toFixed(0)}
            </text>
          </g>
        ))}
        <text x={(padL + W - padR) / 2} y={H - 6} textAnchor="middle" fontSize={10} fill={INK.muted}>
          {xLabel}
        </text>
      </svg>
    </div>
  );
}
