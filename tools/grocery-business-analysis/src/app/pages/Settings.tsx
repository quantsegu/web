import { useState } from "react";
import { useBusinessSettings } from "../context/BusinessContext";
import { Settings as SettingsIcon, RotateCcw, Save, Download, Upload, Copy, Share2, Check } from "lucide-react";
import { HUB_IDS, HUB_META, HubId, MarketId } from "../constants/hubs";
import type { FulfillmentCenter, InitialInvestment } from "../context/BusinessContext";

const FULFILLMENT_FIELDS: { key: keyof FulfillmentCenter; label: string }[] = [
  { key: 'warehouseCostPerSqm', label: 'Warehouse cost per sqm (€/year)' },
  { key: 'warehouseSizeNeeded', label: 'Warehouse size (sqm)' },
  { key: 'monthlyLaborCost', label: 'Monthly labor cost per employee (€)' },
  { key: 'employees', label: 'Employees' },
  { key: 'utilitiesMonthlyCost', label: 'Monthly utilities (€)' },
  { key: 'insuranceMonthlyCost', label: 'Monthly insurance (€)' },
];

export function Settings() {
  const { settings, updateSettings, resetSettings } = useBusinessSettings();
  const [activeHub, setActiveHub] = useState<HubId>('poland');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Reset all values to defaults?')) {
      resetSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grocery-business-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        updateSettings(JSON.parse(e.target?.result as string));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleShareURL = () => {
    const encodedSettings = btoa(JSON.stringify(settings));
    const shareURL = `${window.location.origin}${window.location.pathname}?settings=${encodedSettings}`;
    navigator.clipboard.writeText(shareURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert('Shareable URL copied to clipboard.');
    });
  };

  const updateFulfillment = (hub: HubId, key: keyof FulfillmentCenter, value: number) => {
    updateSettings({
      fulfillment: {
        ...settings.fulfillment,
        [hub]: { ...settings.fulfillment[hub], [key]: value },
      },
    });
  };

  const updateDeliveryRate = (
    fromHub: HubId,
    toMarket: MarketId | 'crossBorderSurcharge' | 'customsDuty',
    value: number
  ) => {
    const rates = { ...settings.deliveryCosts[fromHub] };
    if (toMarket === 'crossBorderSurcharge') {
      rates.crossBorderSurcharge = value;
    } else if (toMarket === 'customsDuty') {
      rates.customsDuty = value;
    } else {
      rates[toMarket] = value;
    }
    updateSettings({
      deliveryCosts: { ...settings.deliveryCosts, [fromHub]: rates },
    });
  };

  const updateInvestment = (hub: HubId, key: keyof InitialInvestment, value: number) => {
    updateSettings({
      initialInvestment: {
        ...settings.initialInvestment,
        [hub]: { ...settings.initialInvestment[hub], [key]: value },
      },
    });
  };

  const fc = settings.fulfillment[activeHub];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Settings</h2>
          <p className="text-gray-600">Hub costs, delivery matrix, and global assumptions (all EUR)</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          Settings updated across all pages.
        </div>
      )}

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Share & export</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <button type="button" onClick={handleExport} className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-lg">
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-lg cursor-pointer">
            <Upload className="w-4 h-4" />
            Import JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard.writeText(JSON.stringify(settings, null, 2)).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              })
            }
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-lg"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            Copy JSON
          </button>
          <button type="button" onClick={handleShareURL} className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg">
            <Share2 className="w-4 h-4" />
            Share link
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          <h3 className="font-semibold">Fulfillment hub costs</h3>
        </div>
        <div className="flex border-b overflow-x-auto">
          {HUB_IDS.map((hub) => (
            <button
              key={hub}
              type="button"
              onClick={() => setActiveHub(hub)}
              className={`flex-1 min-w-[120px] px-4 py-3 font-medium text-sm ${
                activeHub === hub ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
              }`}
            >
              {HUB_META[hub].flag} {HUB_META[hub].label}
            </button>
          ))}
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {FULFILLMENT_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <input
                type="number"
                value={fc[key] as number}
                onChange={(e) => updateFulfillment(activeHub, key, Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">VAT rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={fc.vatRate * 100}
              onChange={(e) => updateFulfillment(activeHub, 'vatRate', Number(e.target.value) / 100)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Delivery cost matrix (€ per order)</h3>
        <div className="space-y-8">
          {HUB_IDS.map((fromHub) => (
            <div key={fromHub}>
              <h4 className="font-medium mb-3">
                From {HUB_META[fromHub].flag} {HUB_META[fromHub].label}
              </h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                {HUB_IDS.map((toMarket) => (
                  <div key={toMarket}>
                    <label className="text-xs text-gray-600 block mb-1">
                      To {HUB_META[toMarket].label}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.deliveryCosts[fromHub][toMarket]}
                      onChange={(e) => updateDeliveryRate(fromHub, toMarket, Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Cross-border surcharge (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.deliveryCosts[fromHub].crossBorderSurcharge * 100}
                    onChange={(e) =>
                      updateDeliveryRate(fromHub, 'crossBorderSurcharge', Number(e.target.value) / 100)
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Swiss customs (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.deliveryCosts[fromHub].customsDuty * 100}
                    onChange={(e) =>
                      updateDeliveryRate(fromHub, 'customsDuty', Number(e.target.value) / 100)
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-semibold mb-4">Order & product settings</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { key: 'averageOrderValue' as const, label: 'Average order value (€)', pct: false },
            { key: 'costOfGoodsPercentage' as const, label: 'Cost of goods (%)', pct: true },
            { key: 'marketingCostPerOrder' as const, label: 'Marketing per order (€)', pct: false },
            { key: 'platformCosts' as const, label: 'Platform costs / month (€)', pct: false },
            { key: 'packagingCostPerOrder' as const, label: 'Packaging per order (€)', pct: false },
            { key: 'paymentProcessingRate' as const, label: 'Payment processing (%)', pct: true },
          ].map(({ key, label, pct }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <input
                type="number"
                step={pct ? 0.01 : 1}
                value={pct ? settings[key] * 100 : settings[key]}
                onChange={(e) =>
                  updateSettings({
                    [key]: pct ? Number(e.target.value) / 100 : Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment fixed fee (€)</label>
            <input
              type="number"
              step="0.01"
              value={settings.paymentProcessingFixed}
              onChange={(e) => updateSettings({ paymentProcessingFixed: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="font-semibold">Initial investment by hub (€)</h3>
        </div>
        <div className="flex border-b overflow-x-auto">
          {HUB_IDS.map((hub) => (
            <button
              key={hub}
              type="button"
              onClick={() => setActiveHub(hub)}
              className={`flex-1 min-w-[100px] px-4 py-2 text-sm ${
                activeHub === hub ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600'
              }`}
            >
              {HUB_META[hub].flag}
            </button>
          ))}
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {Object.entries(settings.initialInvestment[activeHub]).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) =>
                  updateInvestment(activeHub, key as keyof InitialInvestment, Number(e.target.value))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
