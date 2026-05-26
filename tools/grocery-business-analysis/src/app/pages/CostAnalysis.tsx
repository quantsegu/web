import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { calculateFinancials, buildScenario } from "../utils/calculations";
import { useBusinessSettings } from "../context/BusinessContext";
import { HUB_IDS, HUB_META, HubId, normalizeOrderDistribution } from "../constants/hubs";
import { Info } from "lucide-react";

export function CostAnalysis() {
  const { settings } = useBusinessSettings();
  const [location, setLocation] = useState<HubId>('poland');
  const [ordersPerMonth, setOrdersPerMonth] = useState(500);
  const defaults = buildScenario(settings, location, ordersPerMonth).orderDistribution;
  const [distribution, setDistribution] = useState(defaults);

  const orderDistribution = normalizeOrderDistribution(distribution);
  const scenario = buildScenario(settings, location, ordersPerMonth, orderDistribution);
  const results = calculateFinancials(scenario);

  const costBreakdownData = [
    { name: 'Cost of Goods', value: results.variableCosts.costOfGoods, color: '#ef4444' },
    { name: 'Fixed Costs', value: results.fixedCosts, color: '#f97316' },
    { name: 'Delivery', value: results.variableCosts.delivery, color: '#eab308' },
    { name: 'Marketing', value: results.variableCosts.marketing, color: '#a855f7' },
    { name: 'Packaging', value: results.variableCosts.packaging, color: '#06b6d4' },
    { name: 'Payment Processing', value: results.variableCosts.payment, color: '#8b5cf6' },
  ];

  const perOrderCosts = [
    { category: 'Product Cost', amount: (results.variableCosts.costOfGoods / ordersPerMonth).toFixed(2) },
    { category: 'Delivery', amount: (results.variableCosts.delivery / ordersPerMonth).toFixed(2) },
    { category: 'Marketing', amount: (results.variableCosts.marketing / ordersPerMonth).toFixed(2) },
    { category: 'Fixed Costs', amount: (results.fixedCosts / ordersPerMonth).toFixed(2) },
    {
      category: 'Other',
      amount: ((results.variableCosts.packaging + results.variableCosts.payment) / ordersPerMonth).toFixed(2),
    },
  ];

  const selectHub = (hub: HubId) => {
    setLocation(hub);
    setDistribution(buildScenario(settings, hub, ordersPerMonth).orderDistribution);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Detailed Cost Analysis</h2>
        <p className="text-gray-600">
          Breakdown of costs for any CEE fulfillment hub and shipping mix
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Scenario Configuration</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Fulfillment hub</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HUB_IDS.map((hub) => (
              <button
                key={hub}
                type="button"
                onClick={() => selectHub(hub)}
                className={`py-3 px-4 rounded-lg border-2 transition-all text-sm font-medium ${
                  location === hub
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {HUB_META[hub].flag} {HUB_META[hub].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Orders: {ordersPerMonth}
            </label>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={ordersPerMonth}
              onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Order distribution by destination (%)</label>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {HUB_IDS.map((market) => (
              <div key={market}>
                <label className="text-xs text-gray-600 mb-1 block">
                  {HUB_META[market].flag} {HUB_META[market].label}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={distribution[market]}
                  onChange={(e) =>
                    setDistribution((prev) => ({ ...prev, [market]: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={costBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {costBreakdownData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `€${Math.round(v)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Cost per Order</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={perOrderCosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-900">
          <p className="font-medium mb-1">Summary — {HUB_META[location].label} hub</p>
          <p>
            Revenue €{results.revenue.toLocaleString()} · Net profit{' '}
            <strong className={results.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}>
              €{Math.round(results.netProfit).toLocaleString()}
            </strong>{' '}
            · Break-even {Math.ceil(results.breakEvenOrders)} orders/month
          </p>
        </div>
      </div>
    </div>
  );
}
