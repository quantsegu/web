import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  calculateFinancials,
  calculateROI,
  calculateInitialInvestment,
  buildScenario,
} from "../utils/calculations";
import { useBusinessSettings } from "../context/BusinessContext";
import { HUB_IDS, HUB_META, HubId } from "../constants/hubs";
import { TrendingUp, DollarSign, Clock, Calculator } from "lucide-react";

export function ROICalculator() {
  const { settings } = useBusinessSettings();
  const [location, setLocation] = useState<HubId>('romania');
  const [ordersPerMonth, setOrdersPerMonth] = useState(500);
  const [monthsToProject, setMonthsToProject] = useState(24);
  const [customInvestment, setCustomInvestment] = useState(
    calculateInitialInvestment(settings.initialInvestment.romania)
  );

  const scenario = buildScenario(settings, location, ordersPerMonth);
  const monthlyResults = calculateFinancials(scenario);
  const roiMetrics = calculateROI(customInvestment, monthlyResults.netProfit, monthsToProject);

  const chartData = [];
  let cumulativeProfit = -customInvestment;
  for (let month = 0; month <= monthsToProject; month++) {
    if (month === 0) {
      chartData.push({ month: 0, cumulative: -customInvestment, breakEven: 0 });
    } else {
      cumulativeProfit += monthlyResults.netProfit;
      chartData.push({ month, cumulative: Math.round(cumulativeProfit), breakEven: 0 });
    }
  }

  const breakdown = settings.initialInvestment[location];
  const investmentChartData = Object.entries(breakdown).map(([key, value]) => ({
    category: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
    amount: value,
  }));

  const handleLocationChange = (newLocation: HubId) => {
    setLocation(newLocation);
    setCustomInvestment(calculateInitialInvestment(settings.initialInvestment[newLocation]));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ROI Calculator</h2>
        <p className="text-gray-600">
          Project return on investment for a CEE fulfillment hub over your chosen horizon
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fulfillment hub</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HUB_IDS.map((hub) => (
              <button
                key={hub}
                type="button"
                onClick={() => handleLocationChange(hub)}
                className={`py-3 px-4 rounded-lg border-2 text-sm font-medium ${
                  location === hub
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {HUB_META[hub].flag} {HUB_META[hub].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly orders: {ordersPerMonth}
            </label>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={ordersPerMonth}
              onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Projection: {monthsToProject} months
            </label>
            <input
              type="range"
              min="6"
              max="60"
              step="6"
              value={monthsToProject}
              onChange={(e) => setMonthsToProject(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Initial investment (€)</label>
            <input
              type="number"
              value={customInvestment}
              onChange={(e) => setCustomInvestment(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Monthly net profit', value: `€${Math.round(monthlyResults.netProfit)}` },
          { icon: TrendingUp, label: `${monthsToProject}mo ROI`, value: `${roiMetrics.roi.toFixed(0)}%` },
          { icon: Clock, label: 'Payback', value: `${roiMetrics.paybackPeriod.toFixed(1)} mo` },
          { icon: Calculator, label: 'Total profit', value: `€${Math.round(roiMetrics.totalProfit)}` },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <card.icon className="w-8 h-8 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-lg font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold mb-4">Cumulative profit — {HUB_META[location].label}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cumulative" stroke="#6366f1" name="Cumulative €" />
            <Line type="monotone" dataKey="breakEven" stroke="#94a3b8" name="Break-even" strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold mb-4">Initial investment breakdown</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={investmentChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
