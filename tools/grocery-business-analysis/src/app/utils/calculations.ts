import { FulfillmentCenter, BusinessSettings } from '../context/BusinessContext';
import {
  DeliveryRates,
  HUB_IDS,
  HubId,
  MarketId,
  OrderDistribution,
  defaultOrderDistribution,
  isSwissBorderCrossing,
} from '../constants/hubs';

export interface MonthlyScenario {
  fulfillmentCenter: FulfillmentCenter;
  ordersPerMonth: number;
  orderDistribution: OrderDistribution;
  averageOrderValue: number;
  costOfGoodsPercentage: number;
  marketingCostPerOrder: number;
  platformCosts: number;
  packagingCostPerOrder: number;
  paymentProcessingRate: number;
  paymentProcessingFixed: number;
  deliveryCosts: DeliveryRates;
}

export interface FinancialResults {
  revenue: number;
  fixedCosts: number;
  variableCosts: {
    costOfGoods: number;
    delivery: number;
    marketing: number;
    packaging: number;
    payment: number;
  };
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  breakEvenOrders: number;
  avgDeliveryPerOrder: number;
}

export function calculateMonthlyFixedCosts(
  fc: FulfillmentCenter,
  platformCosts: number
): number {
  const warehouseMonthlyCost = (fc.warehouseCostPerSqm * fc.warehouseSizeNeeded) / 12;
  const laborCosts = fc.monthlyLaborCost * fc.employees;
  return (
    warehouseMonthlyCost +
    laborCosts +
    fc.utilitiesMonthlyCost +
    fc.insuranceMonthlyCost +
    platformCosts
  );
}

export function calculateDeliveryCost(
  deliveryCosts: DeliveryRates,
  fulfillmentLocation: HubId,
  deliveryMarket: MarketId,
  orderValue: number
): number {
  let deliveryCost = deliveryCosts[deliveryMarket] ?? 0;

  if (fulfillmentLocation !== deliveryMarket) {
    deliveryCost += orderValue * deliveryCosts.crossBorderSurcharge;
  }

  if (isSwissBorderCrossing(fulfillmentLocation, deliveryMarket)) {
    deliveryCost += orderValue * deliveryCosts.customsDuty;
  }

  return deliveryCost;
}

export function calculateFinancials(scenario: MonthlyScenario): FinancialResults {
  const {
    fulfillmentCenter,
    ordersPerMonth,
    orderDistribution,
    averageOrderValue,
    costOfGoodsPercentage,
    marketingCostPerOrder,
    platformCosts,
    packagingCostPerOrder,
    paymentProcessingRate,
    paymentProcessingFixed,
    deliveryCosts,
  } = scenario;

  const revenue = ordersPerMonth * averageOrderValue;
  const fixedCosts = calculateMonthlyFixedCosts(fulfillmentCenter, platformCosts);
  const costOfGoods = revenue * costOfGoodsPercentage;

  let deliveryCost = 0;
  for (const market of HUB_IDS) {
    const marketOrders = ordersPerMonth * ((orderDistribution[market] ?? 0) / 100);
    deliveryCost +=
      marketOrders *
      calculateDeliveryCost(
        deliveryCosts,
        fulfillmentCenter.location,
        market,
        averageOrderValue
      );
  }

  const marketingCost = ordersPerMonth * marketingCostPerOrder;
  const packagingCost = ordersPerMonth * packagingCostPerOrder;
  const paymentProcessing =
    revenue * paymentProcessingRate + ordersPerMonth * paymentProcessingFixed;

  const totalVariableCosts =
    costOfGoods + deliveryCost + marketingCost + packagingCost + paymentProcessing;
  const totalCosts = fixedCosts + totalVariableCosts;

  const grossProfit = revenue - costOfGoods;
  const netProfit = revenue - totalCosts;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  const variableCostPerOrder = ordersPerMonth > 0 ? totalVariableCosts / ordersPerMonth : 0;
  const contributionMargin = averageOrderValue - variableCostPerOrder;
  const breakEvenOrders =
    contributionMargin > 0 ? fixedCosts / contributionMargin : Infinity;

  return {
    revenue,
    fixedCosts,
    variableCosts: {
      costOfGoods,
      delivery: deliveryCost,
      marketing: marketingCost,
      packaging: packagingCost,
      payment: paymentProcessing,
    },
    totalCosts,
    grossProfit,
    netProfit,
    profitMargin,
    breakEvenOrders,
    avgDeliveryPerOrder: ordersPerMonth > 0 ? deliveryCost / ordersPerMonth : 0,
  };
}

export function calculateROI(
  initialInvestment: number,
  monthlyProfit: number,
  months: number
): {
  totalProfit: number;
  roi: number;
  paybackPeriod: number;
} {
  const totalProfit = monthlyProfit * months;
  const roi = ((totalProfit - initialInvestment) / initialInvestment) * 100;
  const paybackPeriod = monthlyProfit > 0 ? initialInvestment / monthlyProfit : Infinity;

  return { totalProfit, roi, paybackPeriod };
}

export function calculateInitialInvestment(investment: {
  inventoryInitial: number;
  warehouseSetup: number;
  technology: number;
  legal: number;
  marketing: number;
  workingCapital: number;
}): number {
  return Object.values(investment).reduce((sum, val) => sum + val, 0);
}

export function buildScenario(
  settings: BusinessSettings,
  hub: HubId,
  ordersPerMonth: number,
  orderDistribution?: OrderDistribution
): MonthlyScenario {
  return {
    fulfillmentCenter: settings.fulfillment[hub],
    ordersPerMonth,
    orderDistribution: orderDistribution ?? defaultOrderDistribution(hub),
    averageOrderValue: settings.averageOrderValue,
    costOfGoodsPercentage: settings.costOfGoodsPercentage,
    marketingCostPerOrder: settings.marketingCostPerOrder,
    platformCosts: settings.platformCosts,
    packagingCostPerOrder: settings.packagingCostPerOrder,
    paymentProcessingRate: settings.paymentProcessingRate,
    paymentProcessingFixed: settings.paymentProcessingFixed,
    deliveryCosts: settings.deliveryCosts[hub],
  };
}

export interface HubRanking {
  hub: HubId;
  results: FinancialResults;
  initialInvestment: number;
}

/** Rank every hub for EU-wide export (same order mix, same volume). */
export function rankHubsForEuExport(
  settings: BusinessSettings,
  ordersPerMonth: number,
  orderDistribution: OrderDistribution
): HubRanking[] {
  return HUB_IDS.map((hub) => ({
    hub,
    results: calculateFinancials(buildScenario(settings, hub, ordersPerMonth, orderDistribution)),
    initialInvestment: calculateInitialInvestment(settings.initialInvestment[hub]),
  })).sort((a, b) => b.results.netProfit - a.results.netProfit);
}
