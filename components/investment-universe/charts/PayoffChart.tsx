import { useMemo, useState } from 'react';
import { BRAND_BAR, INK } from './chartTokens';

export interface PayoffMark {
  x: number;
  label: string;
}

interface PayoffChartProps {
  fn: (x: number) => number;
  /** underlying at maturity, % of initial level */
  xDomain?: [number, number];
  yDomain: [number, number];
  marks?: PayoffMark[];
  /** dashed comparison line: direct investment in the underlying */
  showDirect?: boolean;
  yLabel: string;
  color?: string;
  ariaLabel: string;
  compact?: boolean;
}

/** Hand-drawn payoff diagram generated from the product formula (own drawing, not the SSPA map artwork). */
export default function PayoffChart({
  fn,
  xDomain = [40, 160],
  yDomain,
  marks = [],
  showDirect = false,
  yLabel,
  color = BRAND_BAR,
  ariaLabel,
  compact = false,
}: PayoffChartProps) {
  const [cursor, setCursor] = useState<number | null>(null);
  const W = 360;
  const H = compact ? 170 : 220;
  const padL = 34;
  const padR = 10;
  const padT = 12;
  const padB = 28;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;
  const sx = (x: number) => padL + ((x - x0) / (x1 - x0)) * plotW;
  const sy = (y: number) => padT + plotH - ((Math.min(Math.max(y, y0), y1) - y0) / (y1 - y0)) * plotH;

  const path = useMemo(() => {
    let d = '';
    let prev: number | null = null;
    for (let x = x0; x <= x1 + 1e-9; x += 0.5) {
      const v = fn(x);
      const jump = prev !== null && Math.abs(v - prev) > (y1 - y0) * 0.06;
      d += `${d === '' || jump ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(v).toFixed(1)} `;
      prev = v;
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, x0, x1, y0, y1]);

  const xt: number[] = [];
  for (let t = Math.ceil(x0 / 20) * 20; t <= x1; t += 20) xt.push(t);
  const yStep = (y1 - y0) / 4;
  const yt = [0, 1, 2, 3, 4].map((i) => y0 + yStep * i);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const x = x0 + ((px - padL) / plotW) * (x1 - x0);
    setCursor(Math.min(x1, Math.max(x0, x)));
  };

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto touch-none"
        role="img"
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerLeave={() => setCursor(null)}
      >
        {yt.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={sy(t)} y2={sy(t)} stroke={INK.grid} strokeWidth={0.8} />
            <text x={padL - 5} y={sy(t) + 3} textAnchor="end" fontSize={9} fill={INK.muted}>
              {Math.round(t)}
            </text>
          </g>
        ))}
        {xt.map((t) => (
          <text key={t} x={sx(t)} y={H - 12} textAnchor="middle" fontSize={9} fill={INK.muted}>
            {t}
          </text>
        ))}
        <text x={W - padR} y={H - 1} textAnchor="end" fontSize={9} fill={INK.muted}>
          underlying at maturity, % of initial level
        </text>
        <text x={padL} y={9} fontSize={9} fill={INK.muted}>
          {yLabel}
        </text>
        <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={INK.axis} strokeWidth={1} />
        <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke={INK.axis} strokeWidth={1} />
        {marks.map((m) => (
          <g key={m.label + m.x}>
            <line x1={sx(m.x)} x2={sx(m.x)} y1={padT} y2={padT + plotH} stroke={INK.secondary} strokeDasharray="3 3" strokeWidth={0.8} opacity={0.6} />
            <text x={sx(m.x) + 3} y={padT + 9} fontSize={8.5} fill={INK.secondary}>
              {m.label}
            </text>
          </g>
        ))}
        {showDirect && (
          <path
            d={`M${sx(x0)},${sy(x0)} L${sx(x1)},${sy(x1)}`}
            stroke={INK.muted}
            strokeDasharray="4 3"
            strokeWidth={1}
            fill="none"
          />
        )}
        <path d={path} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {cursor !== null && (
          <g>
            <line x1={sx(cursor)} x2={sx(cursor)} y1={padT} y2={padT + plotH} stroke={INK.primary} strokeWidth={0.8} opacity={0.5} />
            <circle cx={sx(cursor)} cy={sy(fn(cursor))} r={4} fill={color} stroke={INK.surface} strokeWidth={2} />
          </g>
        )}
      </svg>
      <p className="text-xs text-saffron-200 min-h-[1.1rem]" aria-live="polite">
        {cursor !== null
          ? `Underlying ${cursor.toFixed(0)}% → ${yLabel.toLowerCase()} ${fn(cursor).toFixed(1)}`
          : 'Move over the chart to read values.'}
        {showDirect && <span className="text-gray-500"> · dashed = direct holding</span>}
      </p>
    </div>
  );
}
