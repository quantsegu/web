import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  DEFAULT_DELIVERY_MATRIX,
  HUB_IDS,
  HubId,
  DeliveryRates,
} from '../constants/hubs';

export interface FulfillmentCenter {
  location: HubId;
  warehouseCostPerSqm: number;
  warehouseSizeNeeded: number;
  monthlyLaborCost: number;
  employees: number;
  utilitiesMonthlyCost: number;
  insuranceMonthlyCost: number;
  vatRate: number;
}

export interface InitialInvestment {
  inventoryInitial: number;
  warehouseSetup: number;
  technology: number;
  legal: number;
  marketing: number;
  workingCapital: number;
}

export interface BusinessSettings {
  fulfillment: Record<HubId, FulfillmentCenter>;
  deliveryCosts: Record<HubId, DeliveryRates>;
  initialInvestment: Record<HubId, InitialInvestment>;
  averageOrderValue: number;
  costOfGoodsPercentage: number;
  marketingCostPerOrder: number;
  platformCosts: number;
  packagingCostPerOrder: number;
  paymentProcessingRate: number;
  paymentProcessingFixed: number;
}

const defaultSettings: BusinessSettings = {
  fulfillment: {
    poland: {
      location: 'poland',
      warehouseCostPerSqm: 45,
      warehouseSizeNeeded: 400,
      monthlyLaborCost: 1800,
      employees: 6,
      utilitiesMonthlyCost: 400,
      insuranceMonthlyCost: 350,
      vatRate: 0.23,
    },
    romania: {
      location: 'romania',
      warehouseCostPerSqm: 35,
      warehouseSizeNeeded: 400,
      monthlyLaborCost: 1200,
      employees: 6,
      utilitiesMonthlyCost: 350,
      insuranceMonthlyCost: 300,
      vatRate: 0.19,
    },
    czech: {
      location: 'czech',
      warehouseCostPerSqm: 55,
      warehouseSizeNeeded: 350,
      monthlyLaborCost: 2200,
      employees: 5,
      utilitiesMonthlyCost: 450,
      insuranceMonthlyCost: 380,
      vatRate: 0.21,
    },
    hungary: {
      location: 'hungary',
      warehouseCostPerSqm: 40,
      warehouseSizeNeeded: 350,
      monthlyLaborCost: 1400,
      employees: 5,
      utilitiesMonthlyCost: 380,
      insuranceMonthlyCost: 320,
      vatRate: 0.27,
    },
    germany: {
      location: 'germany',
      warehouseCostPerSqm: 80,
      warehouseSizeNeeded: 400,
      monthlyLaborCost: 3200,
      employees: 5,
      utilitiesMonthlyCost: 500,
      insuranceMonthlyCost: 400,
      vatRate: 0.19,
    },
    italy: {
      location: 'italy',
      warehouseCostPerSqm: 70,
      warehouseSizeNeeded: 380,
      monthlyLaborCost: 2800,
      employees: 5,
      utilitiesMonthlyCost: 480,
      insuranceMonthlyCost: 380,
      vatRate: 0.22,
    },
    swiss: {
      location: 'swiss',
      warehouseCostPerSqm: 190,
      warehouseSizeNeeded: 300,
      monthlyLaborCost: 5200,
      employees: 5,
      utilitiesMonthlyCost: 750,
      insuranceMonthlyCost: 550,
      vatRate: 0.081,
    },
  },
  deliveryCosts: DEFAULT_DELIVERY_MATRIX,
  averageOrderValue: 42,
  costOfGoodsPercentage: 0.4,
  marketingCostPerOrder: 6,
  platformCosts: 1200,
  packagingCostPerOrder: 1.8,
  paymentProcessingRate: 0.029,
  paymentProcessingFixed: 0.25,
  initialInvestment: {
    poland: {
      inventoryInitial: 18000,
      warehouseSetup: 10000,
      technology: 7000,
      legal: 2500,
      marketing: 8000,
      workingCapital: 12000,
    },
    romania: {
      inventoryInitial: 15000,
      warehouseSetup: 7000,
      technology: 7000,
      legal: 2000,
      marketing: 8000,
      workingCapital: 10000,
    },
    czech: {
      inventoryInitial: 17000,
      warehouseSetup: 9000,
      technology: 7500,
      legal: 2800,
      marketing: 8500,
      workingCapital: 11000,
    },
    hungary: {
      inventoryInitial: 16000,
      warehouseSetup: 8000,
      technology: 7000,
      legal: 2400,
      marketing: 8000,
      workingCapital: 10500,
    },
    germany: {
      inventoryInitial: 20000,
      warehouseSetup: 8000,
      technology: 8000,
      legal: 3000,
      marketing: 10000,
      workingCapital: 12000,
    },
    italy: {
      inventoryInitial: 19000,
      warehouseSetup: 7500,
      technology: 7500,
      legal: 3200,
      marketing: 9500,
      workingCapital: 11500,
    },
    swiss: {
      inventoryInitial: 25000,
      warehouseSetup: 15000,
      technology: 8000,
      legal: 5000,
      marketing: 10000,
      workingCapital: 15000,
    },
  },
};

function mergeWithDefaults(partial: Partial<BusinessSettings>): BusinessSettings {
  const merged = { ...defaultSettings, ...partial };
  merged.fulfillment = { ...defaultSettings.fulfillment, ...partial.fulfillment };
  merged.deliveryCosts = { ...defaultSettings.deliveryCosts, ...partial.deliveryCosts };
  merged.initialInvestment = { ...defaultSettings.initialInvestment, ...partial.initialInvestment };
  for (const hub of HUB_IDS) {
    merged.fulfillment[hub] = { ...defaultSettings.fulfillment[hub], ...merged.fulfillment[hub] };
    merged.deliveryCosts[hub] = { ...defaultSettings.deliveryCosts[hub], ...merged.deliveryCosts[hub] };
    merged.initialInvestment[hub] = {
      ...defaultSettings.initialInvestment[hub],
      ...merged.initialInvestment[hub],
    };
  }
  return merged;
}

interface BusinessContextType {
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  resetSettings: () => void;
  loadedFromURL: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [loadedFromURL, setLoadedFromURL] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedSettings = params.get('settings');

    if (encodedSettings) {
      try {
        const decodedSettings = JSON.parse(atob(encodedSettings));
        setSettings(mergeWithDefaults(decodedSettings));
        setLoadedFromURL(true);
      } catch (error) {
        console.error('Failed to load settings from URL:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => mergeWithDefaults({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setLoadedFromURL(false);
  };

  return (
    <BusinessContext.Provider value={{ settings, updateSettings, resetSettings, loadedFromURL }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessSettings() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusinessSettings must be used within a BusinessProvider');
  }
  return context;
}

export { HUB_IDS, defaultSettings };
