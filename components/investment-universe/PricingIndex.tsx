import { Link } from 'react-router-dom';
import SectionHeader from '../SectionHeader';
import { INVESTMENT_CATEGORIES } from '../../lib/investmentUniverse';
import { PRICING_DETAILS, type CategoryId } from '../../lib/investmentPricing';
import { SSPA_GROUPS, SSPA_GROUP_ORDER } from '../../lib/sspa';
import { universeUi } from './universeUi';

const BASE = '/wealth-tools/investment-universe';

/** One place that links to every pricing & valuation page (16 asset types + 5 SSPA families). */
export default function PricingIndex() {
  return (
    <section id="pricing-index" className={universeUi.sectionAlt}>
      <div className={universeUi.container}>
        <SectionHeader
          title="Pricing & valuation, asset by asset"
          subtitle="Every asset type and every SSPA structured-product family has its own page: how the price forms, which valuation methods fit, charts, a worked example, and red flags."
        />

        <h3 className="text-white font-semibold mb-3">Asset types</h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {INVESTMENT_CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                to={`${BASE}/${c.id}`}
                className={`${universeUi.panel} block p-4 h-full hover:border-saffron-400/50 transition-colors`}
              >
                <p className="text-white text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-gray-400 mt-1 leading-snug">{PRICING_DETAILS[c.id as CategoryId].headline}</p>
                <p className="text-saffron-300 text-xs mt-2">Pricing &amp; valuation →</p>
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="text-white font-semibold mb-1">SSPA structured-product families</h3>
        <p className={`${universeUi.proseMuted} mb-3`}>
          Capital protection, yield enhancement, participation, leverage, and additional credit risk.
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SSPA_GROUP_ORDER.map((id) => {
            const g = SSPA_GROUPS[id];
            return (
              <li key={id}>
                <Link
                  to={`${BASE}/${id}`}
                  className={`${universeUi.panel} block p-4 h-full hover:border-saffron-400/50 transition-colors`}
                >
                  <p className="text-white text-sm font-semibold">{g.name}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">{g.tagline}</p>
                  <p className="text-saffron-300 text-xs mt-2">Pricing &amp; valuation →</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
