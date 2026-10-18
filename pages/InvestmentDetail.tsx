import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AssetDetail from '../components/investment-universe/AssetDetail';
import SspaDetail from '../components/investment-universe/SspaDetail';
import { universeUi } from '../components/investment-universe/universeUi';
import { INVESTMENT_CATEGORIES } from '../lib/investmentUniverse';
import { SSPA_GROUPS, isSspaGroupId } from '../lib/sspa';

/** One route, one template: /wealth-tools/investment-universe/:slug (asset category or SSPA product family). */
export default function InvestmentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const category = INVESTMENT_CATEGORIES.find((c) => c.id === slug);
  const group = isSspaGroupId(slug) ? SSPA_GROUPS[slug] : undefined;

  useEffect(() => {
    const name = category?.name ?? group?.name;
    const previous = document.title;
    if (name) document.title = `${name}: pricing & valuation | Investment Universe`;
    return () => {
      document.title = previous;
    };
  }, [category, group]);

  if (!category && !group) return <Navigate to="/wealth-tools/investment-universe" replace />;

  return (
    <div className={universeUi.page}>
      <Navbar />
      {category ? <AssetDetail category={category} /> : <SspaDetail group={group!} />}
      <Footer />
    </div>
  );
}
