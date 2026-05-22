import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from '../pages/Home';
import Software from '../pages/Software';
import Profile from '../pages/Profile';
import BJP from '../pages/BJP';
import IndianCommunities from '../pages/IndianCommunities';
import WealthTools from '../pages/WealthTools';
import InvestmentUniverse from '../pages/InvestmentUniverse';
import WealthToolFrame from '../components/WealthToolFrame';

function LegacyHashRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash.replace('#', '').trim();
    if (!hash) return;

    const legacyRoutes: Record<string, string> = {
      software: '/software',
      'wealth-tools': '/wealth-tools',
      profile: '/profile',
      'bjp-support': '/bjp',
    };

    const target = legacyRoutes[hash];
    if (target) {
      navigate(target, { replace: true });
    }
  }, [location.hash, navigate]);

  return null;
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname !== '/' || !hash) return;
    const id = hash.replace('#', '');
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default function App() {
  const shaderProps = {
    speed: 0.8,
    lineCount: 8,
    amplitude: 0.12,
    yOffset: 0.15,
    opacity: 0.6,
  };

  return (
    <BrowserRouter>
      <LegacyHashRedirect />
      <ScrollToTop />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home {...shaderProps} />} />
        <Route path="/software" element={<Software />} />
        <Route path="/wealth-tools" element={<WealthTools />} />
        <Route path="/investment-universe" element={<InvestmentUniverse />} />
        <Route
          path="/investment-universe.html"
          element={<Navigate to="/investment-universe" replace />}
        />
        <Route
          path="/wealth-tools/retirement-income-planner"
          element={<WealthToolFrame src="/wealth-tools/retirement-income-planner.html" title="Retirement Income Planner" />}
        />
        <Route
          path="/wealth-tools/retirement-income-planner.html"
          element={<Navigate to="/wealth-tools/retirement-income-planner" replace />}
        />
        <Route
          path="/wealth-tools/tax-drag-calculator"
          element={<WealthToolFrame src="/wealth-tools/tax-drag-calculator.html" title="Tax Drag Calculator" />}
        />
        <Route
          path="/wealth-tools/tax-drag-calculator.html"
          element={<Navigate to="/wealth-tools/tax-drag-calculator" replace />}
        />
        <Route
          path="/wealth-tools/wealth-preservation-planner"
          element={<WealthToolFrame src="/wealth-tools/wealth-preservation-planner.html" title="Wealth Preservation Planner" />}
        />
        <Route
          path="/wealth-tools/wealth-preservation-planner.html"
          element={<Navigate to="/wealth-tools/wealth-preservation-planner" replace />}
        />
        <Route
          path="/wealth-tools/portfolio-efficiency-scorecard"
          element={<WealthToolFrame src="/wealth-tools/portfolio-efficiency-scorecard.html" title="Portfolio Efficiency Scorecard" />}
        />
        <Route
          path="/wealth-tools/portfolio-efficiency-scorecard.html"
          element={<Navigate to="/wealth-tools/portfolio-efficiency-scorecard" replace />}
        />
        <Route
          path="/wealth-tools/additional-mortgage-capacity"
          element={<WealthToolFrame src="/wealth-tools/additional-mortgage-capacity.html" title="Additional Mortgage Capacity" />}
        />
        <Route
          path="/wealth-tools/additional-mortgage-capacity.html"
          element={<Navigate to="/wealth-tools/additional-mortgage-capacity" replace />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bjp" element={<BJP />} />
        <Route path="/communities" element={<IndianCommunities />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
