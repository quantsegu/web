import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { calculateFinancials, buildScenario } from "../utils/calculations";
import { useBusinessSettings } from "../context/BusinessContext";
import { HUB_META, HUB_IDS } from "../constants/hubs";
import type { HubId } from "../constants/hubs";
import { Link } from "react-router";

const CEE_COMPARE: [HubId, HubId] = ["poland", "romania"];
const WESTERN_HUBS: HubId[] = ["germany", "italy", "swiss"];

export function Comparison() {
  const { settings } = useBusinessSettings();
  const [ordersPerMonth, setOrdersPerMonth] = useState(500);

  const ceeResults = CEE_COMPARE.map((hub) => ({
    hub,
    results: calculateFinancials(buildScenario(settings, hub, ordersPerMonth)),
  }));

  const westernResults = WESTERN_HUBS.map((hub) => ({
    hub,
    results: calculateFinancials(buildScenario(settings, hub, ordersPerMonth)),
  }));

  const chartData = [];
  for (let orders = 100; orders <= 1500; orders += 100) {
    const row: Record<string, number> = { orders };
    for (const hub of [...CEE_COMPARE, ...WESTERN_HUBS]) {
      row[hub] = Math.round(
        calculateFinancials(buildScenario(settings, hub, orders)).netProfit
      );
    }
    chartData.push(row);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hub comparison</h2>
        <p className="text-gray-600">
          CEE vs Western Europe fulfillment at the same order volume. For ranking all seven hubs on EU-wide
          export, use{" "}
          <Link to="/eu-export" className="text-indigo-600 font-medium hover:underline">
            EU Export Optimizer
          </Link>
          .
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
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

      {/* Western Europe */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Western Europe — Germany, Italy, Switzerland</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {westernResults.map(({ hub, results }) => (
            <div
              key={hub}
              className="border-2 border-indigo-100 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-white"
            >
              <h4 className="font-bold text-gray-900 mb-3">
                {HUB_META[hub].flag} {HUB_META[hub].label}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-medium">€{results.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fixed costs</span>
                  <span>€{Math.round(results.fixedCosts).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span>€{Math.round(results.variableCosts.delivery).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-medium">
                  <span>Net profit</span>
                  <span className={results.netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                    €{Math.round(results.netProfit).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{HUB_META[hub].vatLabel}</p>
                {hub === "swiss" && (
                  <p className="text-xs text-amber-700">Customs applied on EU destinations in model</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CEE */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Central & Eastern Europe — Poland vs Romania</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {ceeResults.map(({ hub, results }) => (
            <div key={hub} className="border border-gray-200 rounded-xl p-6 bg-white">
              <h4 className="font-bold text-gray-900 mb-3">
                {HUB_META[hub].flag} {HUB_META[hub].label}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Net profit</span>
                  <span className={`font-bold ${results.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    €{Math.round(results.netProfit).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margin</span>
                  <span>{results.profitMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Break-even orders</span>
                  <span>{Math.ceil(results.breakEvenOrders)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Net profit by volume (all hubs)</h3>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="orders" />
            <YAxis />
            <Tooltip formatter={(v: number) => `€${v}`} />
            <Legend />
            {HUB_IDS.map((hub, i) => (
              <Line
                key={hub}
                type="monotone"
                dataKey={hub}
                stroke={["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#1f2937", "#ea580c", "#dc2626"][i]}
                name={`${HUB_META[hub].flag} ${HUB_META[hub].label}`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
