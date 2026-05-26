import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Trophy, Truck, TrendingUp, Globe2 } from "lucide-react";
import { useBusinessSettings } from "../context/BusinessContext";
import {
  EU_WIDE_ORDER_DISTRIBUTION,
  HUB_IDS,
  HUB_META,
  normalizeOrderDistribution,
  CEE_HUB_IDS,
  WESTERN_HUB_IDS,
} from "../constants/hubs";
import { rankHubsForEuExport } from "../utils/calculations";
const CHART_COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#818cf8", "#4f46e5", "#7c3aed"];

export function EuExport() {
  const { settings } = useBusinessSettings();
  const [ordersPerMonth, setOrdersPerMonth] = useState(600);
  const [distribution, setDistribution] = useState({ ...EU_WIDE_ORDER_DISTRIBUTION });

  const orderDistribution = useMemo(() => normalizeOrderDistribution(distribution), [distribution]);
  const rankings = useMemo(
    () => rankHubsForEuExport(settings, ordersPerMonth, orderDistribution),
    [settings, ordersPerMonth, orderDistribution]
  );

  const winner = rankings[0];
  const chartData = rankings.map((r) => ({
    hub: HUB_META[r.hub].label,
    hubId: r.hub,
    netProfit: Math.round(r.results.netProfit),
    delivery: Math.round(r.results.avgDeliveryPerOrder * 10) / 10,
  }));

  const ceeBest = rankings.find((r) => CEE_HUB_IDS.includes(r.hub as (typeof CEE_HUB_IDS)[number]));
  const westernBest = rankings.find((r) =>
    WESTERN_HUB_IDS.includes(r.hub as (typeof WESTERN_HUB_IDS)[number])
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Best hub for EU-wide export</h2>
        <p className="text-gray-600 max-w-3xl">
          Same monthly volume and destination mix across all seven markets — rank fulfillment hubs by
          net profit, delivery efficiency, and break-even. Includes CEE (Poland, Romania, Czech,
          Hungary) and Western hubs (Germany, Italy, Switzerland).
        </p>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wide">Recommended hub</p>
            <h3 className="text-2xl font-bold mt-1">
              {HUB_META[winner.hub].flag} {HUB_META[winner.hub].label}
            </h3>
            <p className="text-indigo-100 mt-2 text-sm">
              €{Math.round(winner.results.netProfit).toLocaleString()}/month net at {ordersPerMonth} orders ·{" "}
              €{winner.results.avgDeliveryPerOrder.toFixed(2)} avg delivery/order · break-even{" "}
              {Math.ceil(winner.results.breakEvenOrders)} orders
            </p>
            {winner.hub === "swiss" && (
              <p className="text-amber-200 text-xs mt-2">
                Swiss hub includes customs on EU shipments — compare with Germany or Poland if EU volume dominates.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Best CEE hub</p>
          <p className="text-lg font-bold mt-1">
            {ceeBest && `${HUB_META[ceeBest.hub].flag} ${HUB_META[ceeBest.hub].label}`}
          </p>
          <p className="text-sm text-gray-600">
            €{ceeBest ? Math.round(ceeBest.results.netProfit).toLocaleString() : "—"} net / month
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Best Western hub</p>
          <p className="text-lg font-bold mt-1">
            {westernBest && `${HUB_META[westernBest.hub].flag} ${HUB_META[westernBest.hub].label}`}
          </p>
          <p className="text-sm text-gray-600">
            €{westernBest ? Math.round(westernBest.results.netProfit).toLocaleString() : "—"} net / month
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly orders (EU-wide): {ordersPerMonth}
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={ordersPerMonth}
            onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Destination mix (% of orders)</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {HUB_IDS.map((market) => (
              <div key={market}>
                <label className="text-xs text-gray-600 block mb-1">
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
                  className="w-full px-2 py-1.5 border rounded-lg text-sm"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDistribution({ ...EU_WIDE_ORDER_DISTRIBUTION })}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Reset to default EU footprint
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Net profit by fulfillment hub</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="hub" width={100} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => `€${v}`} />
            <Bar dataKey="netProfit" name="Net profit €">
              {chartData.map((entry, i) => (
                <Cell key={entry.hubId} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Rank</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Hub</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Region</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Net profit</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Margin</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Delivery/order</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Break-even</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rankings.map((row, index) => (
              <tr key={row.hub} className={index === 0 ? "bg-indigo-50/50" : ""}>
                <td className="px-4 py-3 font-medium">{index + 1}</td>
                <td className="px-4 py-3">
                  {HUB_META[row.hub].flag} {HUB_META[row.hub].label}
                </td>
                <td className="px-4 py-3 text-gray-600 capitalize">{HUB_META[row.hub].region}</td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    row.results.netProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  €{Math.round(row.results.netProfit).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">{row.results.profitMargin.toFixed(1)}%</td>
                <td className="px-4 py-3 text-right">€{row.results.avgDeliveryPerOrder.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{Math.ceil(row.results.breakEvenOrders)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="flex gap-2 bg-gray-50 border rounded-lg p-4">
          <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
          <p>
            <strong className="text-gray-900">EU export lens:</strong> Germany and Poland often win on
            balance of low fixed costs and central delivery rates; Switzerland penalized on EU volume due to customs.
          </p>
        </div>
        <div className="flex gap-2 bg-gray-50 border rounded-lg p-4">
          <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
          <p>
            <strong className="text-gray-900">Tune in Settings:</strong> Edit the 7×7 delivery matrix and
            warehouse costs — rankings update instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
