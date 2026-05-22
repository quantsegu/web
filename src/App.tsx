import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from '../pages/Home';
import Software from '../pages/Software';
import Profile from '../pages/Profile';
import BJP from '../pages/BJP';
import WealthTools from '../pages/WealthTools';
import RetirementPlannerFrame from '../components/RetirementPlannerFrame';

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
        <Route path="/wealth-tools/retirement-income-planner" element={<RetirementPlannerFrame />} />
        <Route
          path="/wealth-tools/retirement-income-planner.html"
          element={<Navigate to="/wealth-tools/retirement-income-planner" replace />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bjp" element={<BJP />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
