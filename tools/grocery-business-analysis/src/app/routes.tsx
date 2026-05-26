import { createHashRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Home } from "./pages/Home";
import { CostAnalysis } from "./pages/CostAnalysis";
import { Comparison } from "./pages/Comparison";
import { ROICalculator } from "./pages/ROICalculator";
import { MarketAnalysis } from "./pages/MarketAnalysis";
import { Settings } from "./pages/Settings";
import { EuExport } from "./pages/EuExport";

/** Hash routing so the tool works inside an iframe at .../index.html without basename mismatches. */
export const router = createHashRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "cost-analysis", Component: CostAnalysis },
      { path: "comparison", Component: Comparison },
      { path: "eu-export", Component: EuExport },
      { path: "roi-calculator", Component: ROICalculator },
      { path: "market-analysis", Component: MarketAnalysis },
      { path: "settings", Component: Settings },
    ],
  },
]);