import type { ReactNode } from 'react';
import { universeUi } from './universeUi';
import type { WorkedExample } from '../../lib/pricingMath';

export function DetailSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 py-8 border-t border-saffron-500/15 first:border-t-0">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h2>
      {intro && <p className={`${universeUi.proseMuted} mb-5 max-w-3xl`}>{intro}</p>}
      {children}
    </section>
  );
}

export function JumpNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav
      className="sticky top-16 z-40 bg-bjp-navy/95 backdrop-blur-md border-b border-saffron-500/15 overflow-x-auto"
      aria-label="Page sections"
    >
      <ul className="flex gap-1 px-4 sm:px-6 lg:px-8 py-2 max-w-7xl mx-auto text-xs sm:text-sm">
        {items.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              className="block px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-saffron-500/10 transition-colors"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function WorkedExampleCard({ example }: { example: WorkedExample }) {
  return (
    <div className={`${universeUi.panel} p-5 sm:p-6`}>
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-saffron-400/90 mb-1">
        Worked example · hypothetical inputs
      </p>
      <h3 className="text-white font-semibold text-lg mb-2">{example.title}</h3>
      <p className={`${universeUi.proseMuted} mb-4`}>{example.intro}</p>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <p className={universeUi.label}>Inputs</p>
          <dl className="mt-2 space-y-1.5 text-sm">
            {example.inputs.map((i) => (
              <div key={i.label} className="flex justify-between gap-4">
                <dt className="text-gray-400">{i.label}</dt>
                <dd className="text-white tabular-nums text-right">{i.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <p className={universeUi.label}>Calculation</p>
          <dl className="mt-2 space-y-1.5 text-sm">
            {example.steps.map((s) => (
              <div key={s.label} className="flex justify-between gap-4">
                <dt className="text-gray-400">{s.label}</dt>
                <dd className="text-white tabular-nums text-right">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-saffron-500/15 flex flex-wrap justify-between gap-2 items-baseline">
        <p className="text-saffron-200 text-sm">{example.result.label}</p>
        <p className="text-white text-xl font-bold tabular-nums">{example.result.value}</p>
      </div>
      <p className="text-xs text-gray-500 mt-3 leading-relaxed">{example.note}</p>
    </div>
  );
}

export function RedFlags({ items }: { items: string[] }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-3">
      {items.map((f) => (
        <li key={f} className={`${universeUi.panel} p-4 border-l-2 border-red-400/50 text-sm text-gray-300`}>
          {f}
        </li>
      ))}
    </ul>
  );
}

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <div className={`${universeUi.panel} p-5 mt-8`}>
      <h3 className="text-white font-semibold mb-2 text-sm">Methodology & disclaimer</h3>
      {children}
      <p className={universeUi.proseMuted}>
        Educational and general in nature. Worked examples use hypothetical inputs and are not quotes or forecasts. Scores are
        editorial, ordinal judgements for comparison on this site. Nothing here is investment, legal or tax advice, and nothing
        recommends a product. Consult a qualified professional before you invest.
      </p>
    </div>
  );
}
