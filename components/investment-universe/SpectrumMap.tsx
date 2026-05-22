import type { InvestmentCategory } from '../../lib/investmentUniverse';
import { universeUi } from './universeUi';

export type SpectrumAxis = 'riskLiquidity' | 'coreAlt' | 'incomeGrowth' | 'complexityAccess';

interface SpectrumMapProps {
  title: string;
  subtitle: string;
  xLabel: string;
  yLabel: string;
  categories: InvestmentCategory[];
  getX: (c: InvestmentCategory) => number;
  getY: (c: InvestmentCategory) => number;
}

const COLORS: Record<InvestmentCategory['group'], string> = {
  traditional: '#FF9933',
  alternative: '#1AA00A',
  niche: '#7eb0e0',
};

export default function SpectrumMap({
  title,
  subtitle,
  xLabel,
  yLabel,
  categories,
  getX,
  getY,
}: SpectrumMapProps) {
  const w = 100;
  const h = 100;
  const pad = 8;

  return (
    <figure className={universeUi.mapFrame}>
      <figcaption className="mb-4">
        <h3 className="text-white font-semibold text-sm sm:text-base">{title}</h3>
        <p className={universeUi.proseMuted}>{subtitle}</p>
      </figcaption>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full max-h-[280px] text-gray-500"
        role="img"
        aria-label={`${title}: ${categories.length} categories plotted`}
      >
        <rect x={pad} y={pad} width={w - pad * 2} height={h - pad * 2} fill="rgba(10,22,40,0.5)" rx="1" />
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="rgba(255,153,51,0.35)" strokeWidth="0.3" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="rgba(255,153,51,0.35)" strokeWidth="0.3" />
        {categories.map((c) => {
          const x = pad + (getX(c) / 100) * (w - pad * 2);
          const y = h - pad - (getY(c) / 100) * (h - pad * 2);
          return (
            <g key={c.id}>
              <circle
                cx={x}
                cy={y}
                r="2.2"
                fill={COLORS[c.group]}
                opacity="0.9"
              >
                <title>
                  {c.name}: {xLabel} {getX(c)}, {yLabel} {getY(c)}
                </title>
              </circle>
            </g>
          );
        })}
        <text x={w / 2} y={h - 2} textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.5)">
          {xLabel} →
        </text>
        <text
          x={3}
          y={h / 2}
          textAnchor="middle"
          fontSize="3"
          fill="rgba(255,255,255,0.5)"
          transform={`rotate(-90 3 ${h / 2})`}
        >
          {yLabel} →
        </text>
      </svg>
      <ul className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400" aria-hidden="true">
        <li className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF9933]" /> Traditional
        </li>
        <li className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1AA00A]" /> Alternative
        </li>
        <li className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#7eb0e0]" /> Niche
        </li>
      </ul>
      <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 text-[0.65rem] text-gray-500">
        {categories.map((c) => (
          <li key={c.id}>
            <span className="text-saffron-300/90">{c.name}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
