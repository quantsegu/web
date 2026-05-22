import { COMPARISON_ROWS, type InvestmentCategory } from '../../lib/investmentUniverse';
import { universeUi } from './universeUi';

interface ComparisonTableProps {
  categories: InvestmentCategory[];
}

export default function ComparisonTable({ categories }: ComparisonTableProps) {
  return (
    <div className={universeUi.tableWrap} role="region" aria-label="Investment category comparison table">
      <table className={universeUi.table}>
        <caption className="sr-only">
          Comparison of investment categories across liquidity, risk, role, and complexity
        </caption>
        <thead>
          <tr>
            <th scope="col" className={`${universeUi.th} text-left`}>
              Dimension
            </th>
            {categories.map((c) => (
              <th key={c.id} scope="col" className={universeUi.th}>
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row" className={`${universeUi.td} ${universeUi.tdCategory} bg-bjp-navy/50`}>
                {row.label}
              </th>
              {categories.map((c) => {
                const val =
                  row.key === 'name' ? c.name : String(c[row.key as keyof InvestmentCategory] ?? '—');
                return (
                  <td key={c.id} className={universeUi.td}>
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
