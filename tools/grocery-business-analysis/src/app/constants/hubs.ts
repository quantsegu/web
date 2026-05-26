export const CEE_HUB_IDS = ['poland', 'romania', 'czech', 'hungary'] as const;
export const WESTERN_HUB_IDS = ['germany', 'italy', 'swiss'] as const;
export const HUB_IDS = [...CEE_HUB_IDS, ...WESTERN_HUB_IDS] as const;

export type HubId = (typeof HUB_IDS)[number];
export type MarketId = HubId;

export const CHF_TO_EUR = 1.05;

export const HUB_META: Record<
  HubId,
  { label: string; flag: string; vatLabel: string; region: 'cee' | 'western'; currencyNote?: string }
> = {
  poland: { label: 'Poland', flag: '🇵🇱', vatLabel: '23% VAT', region: 'cee' },
  romania: { label: 'Romania', flag: '🇷🇴', vatLabel: '19% VAT', region: 'cee' },
  czech: { label: 'Czech Republic', flag: '🇨🇿', vatLabel: '21% VAT', region: 'cee' },
  hungary: { label: 'Hungary', flag: '🇭🇺', vatLabel: '27% VAT', region: 'cee' },
  germany: { label: 'Germany', flag: '🇩🇪', vatLabel: '19% VAT', region: 'western' },
  italy: { label: 'Italy', flag: '🇮🇹', vatLabel: '22% VAT', region: 'western' },
  swiss: {
    label: 'Switzerland',
    flag: '🇨🇭',
    vatLabel: '8.1% VAT',
    region: 'western',
    currencyNote: 'Costs stored in EUR (≈ CHF ÷ 1.05)',
  },
};

export type DeliveryRates = Record<MarketId, number> & {
  /** Extra cost as fraction of order value for cross-border EU delivery */
  crossBorderSurcharge: number;
  /** Applied when shipping across the Swiss–EU border (either direction) */
  customsDuty: number;
};

export type OrderDistribution = Record<MarketId, number>;

/** Weighted mix for “export to whole EU footprint” (Indian grocery markets, ≈100%) */
export const EU_WIDE_ORDER_DISTRIBUTION: OrderDistribution = {
  germany: 22,
  italy: 14,
  poland: 16,
  romania: 11,
  czech: 12,
  hungary: 10,
  swiss: 15,
};

function rates(
  legs: Partial<Record<MarketId, number>>,
  crossBorderSurcharge = 0.02,
  customsDuty = 0.05
): DeliveryRates {
  const base = Object.fromEntries(HUB_IDS.map((id) => [id, legs[id] ?? 12])) as Record<MarketId, number>;
  return { ...base, crossBorderSurcharge, customsDuty };
}

export const DEFAULT_DELIVERY_MATRIX: Record<HubId, DeliveryRates> = {
  poland: rates({ poland: 4.5, romania: 9, czech: 6, hungary: 7, germany: 7, italy: 10, swiss: 16 }),
  romania: rates({ poland: 10, romania: 4, czech: 11, hungary: 8, germany: 9, italy: 11, swiss: 18 }),
  czech: rates({ poland: 7, romania: 9, czech: 4.5, hungary: 5.5, germany: 6, italy: 9, swiss: 15 }),
  hungary: rates({ poland: 8, romania: 7, czech: 5.5, hungary: 4, germany: 7, italy: 9, swiss: 16 }),
  germany: rates({ germany: 5, italy: 8, swiss: 18, poland: 7, romania: 10, czech: 6, hungary: 8 }, 0.015, 0.05),
  italy: rates({ italy: 5, germany: 8, swiss: 17, poland: 9, romania: 11, czech: 8, hungary: 9 }, 0.015, 0.05),
  swiss: rates({ swiss: 6, germany: 22, italy: 25, poland: 14, romania: 16, czech: 15, hungary: 16 }, 0.02, 0.05),
};

export function defaultOrderDistribution(hub: HubId): OrderDistribution {
  const mixes: Record<HubId, OrderDistribution> = {
    poland: { poland: 45, germany: 15, czech: 12, romania: 10, hungary: 8, italy: 5, swiss: 5 },
    romania: { romania: 40, poland: 12, hungary: 15, germany: 12, czech: 10, italy: 6, swiss: 5 },
    czech: { czech: 38, poland: 18, germany: 15, hungary: 12, romania: 8, italy: 5, swiss: 4 },
    hungary: { hungary: 38, poland: 15, romania: 15, czech: 12, germany: 12, italy: 5, swiss: 3 },
    germany: { germany: 40, italy: 15, poland: 15, swiss: 10, czech: 8, romania: 7, hungary: 5 },
    italy: { italy: 38, germany: 22, swiss: 10, poland: 10, czech: 8, romania: 7, hungary: 5 },
    swiss: { swiss: 35, germany: 25, italy: 15, poland: 10, czech: 8, romania: 4, hungary: 3 },
  };
  return mixes[hub];
}

export function normalizeOrderDistribution(dist: Partial<OrderDistribution>): OrderDistribution {
  const total = HUB_IDS.reduce((sum, id) => sum + (dist[id] ?? 0), 0);
  if (total <= 0) return { ...EU_WIDE_ORDER_DISTRIBUTION };
  const scale = 100 / total;
  return Object.fromEntries(
    HUB_IDS.map((id) => [id, Math.round((dist[id] ?? 0) * scale * 10) / 10])
  ) as OrderDistribution;
}

export function isSwissBorderCrossing(from: HubId, to: MarketId): boolean {
  return (from === 'swiss' && to !== 'swiss') || (from !== 'swiss' && to === 'swiss');
}
