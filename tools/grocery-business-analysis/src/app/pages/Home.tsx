import { Link } from "react-router";
import { TrendingUp, Package, Truck, Globe2 } from "lucide-react";
import { calculateFinancials, buildScenario, rankHubsForEuExport } from "../utils/calculations";
import { useBusinessSettings } from "../context/BusinessContext";
import { EU_WIDE_ORDER_DISTRIBUTION, HUB_META } from "../constants/hubs";

export function Home() {
  const { settings } = useBusinessSettings();

  const euRankings = rankHubsForEuExport(settings, 500, EU_WIDE_ORDER_DISTRIBUTION);
  const topHub = euRankings[0];

  const westernPreview = (["germany", "italy", "swiss"] as const).map((hub) => ({
    hub,
    results: calculateFinancials(buildScenario(settings, hub, 500)),
  }));

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-3">Online Grocery & Pooja Store Business Analysis</h2>
        <p className="text-indigo-100 text-lg max-w-3xl">
          Model fulfillment across seven hubs — Poland, Romania, Czech Republic, Hungary, Germany,
          Italy, and Switzerland — and find the best location for EU-wide export.
        </p>
        <Link
          to="/eu-export"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium text-sm hover:bg-indigo-50"
        >
          <Globe2 className="w-4 h-4" />
          EU Export Optimizer
        </Link>
      </div>

      <div className="bg-white border-2 border-indigo-200 rounded-xl p-6">
        <p className="text-sm text-indigo-600 font-medium uppercase tracking-wide">Best hub for EU-wide export (500 orders)</p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">
          {HUB_META[topHub.hub].flag} {HUB_META[topHub.hub].label} — €
          {Math.round(topHub.results.netProfit).toLocaleString()}/month net
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Ranked across all seven hubs with the default EU destination mix.{" "}
          <Link to="/eu-export" className="text-indigo-600 hover:underline">
            Adjust mix & volume →
          </Link>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">EU market opportunity</p>
              <p className="text-2xl font-bold text-gray-900">€4.8M</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Estimated annual Indian grocery demand across all seven markets</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Target diaspora</p>
              <p className="text-2xl font-bold text-gray-900">~380K</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">CEE + Germany, Italy, and Switzerland combined</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Fulfillment hubs</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">CEE cost bases + Western market access; Swiss customs modeled</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">Western Europe snapshot (500 orders, domestic mix)</h3>
        </div>
        <div className="p-6 grid md:grid-cols-3 gap-4">
          {westernPreview.map(({ hub, results }) => (
            <div key={hub} className="border rounded-lg p-4">
              <h4 className="font-medium">
                {HUB_META[hub].flag} {HUB_META[hub].label}
              </h4>
              <p
                className={`text-lg font-bold mt-2 ${
                  results.netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                €{Math.round(results.netProfit).toLocaleString()} net
              </p>
              <p className="text-xs text-gray-500 mt-1">{results.profitMargin.toFixed(1)}% margin</p>
            </div>
          ))}
        </div>
        <div className="px-6 pb-4">
          <Link to="/comparison" className="text-sm text-indigo-600 font-medium hover:underline">
            Full CEE + Western comparison →
          </Link>
        </div>
      </div>
    </div>
  );
}
