import { Link, Outlet, useLocation } from "react-router";
import { Building2, TrendingUp, BarChart3, Calculator, MapPin, Settings, X, Globe2 } from "lucide-react";
import { useBusinessSettings } from "../context/BusinessContext";
import { useState } from "react";

export function RootLayout() {
  const location = useLocation();
  const { loadedFromURL } = useBusinessSettings();
  const [showBanner, setShowBanner] = useState(true);
  
  const navItems = [
    { path: "/", label: "Overview", icon: Building2 },
    { path: "/cost-analysis", label: "Cost Analysis", icon: BarChart3 },
    { path: "/comparison", label: "Comparison", icon: MapPin },
    { path: "/eu-export", label: "EU Export", icon: Globe2 },
    { path: "/roi-calculator", label: "ROI Calculator", icon: Calculator },
    { path: "/market-analysis", label: "Market Analysis", icon: TrendingUp },
    { path: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Settings Banner */}
      {loadedFromURL && showBanner && (
        <div className="bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">Custom settings loaded from shared link</p>
                <p className="text-xs text-indigo-100">You're viewing someone else's business scenario</p>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Grocery Business Analysis</h1>
                <p className="text-xs text-gray-500">CEE + Germany • Italy • Switzerland</p>
              </div>
            </div>
            <a
              href="/wealth-tools"
              target="_parent"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← All tools
            </a>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            Financial analysis tool for online grocery & pooja store business planning • All figures in EUR unless noted
          </p>
        </div>
      </footer>
    </div>
  );
}