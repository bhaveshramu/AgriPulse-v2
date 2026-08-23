import type { MarketReport } from "@/types";

export const MARKET_CROPS = ["Tomato", "Potato", "Onion", "Maize"] as const;
export const MARKET_STATES = ["Karnataka", "Maharashtra", "Tamil Nadu"] as const;
export const MARKET_PLACES: Record<string, string[]> = {
  Karnataka: ["Hubballi APMC", "Belagavi APMC", "Bengaluru APMC"],
  Maharashtra: ["Pune APMC", "Nashik APMC"],
  "Tamil Nadu": ["Coimbatore APMC", "Salem APMC"],
};

const basePrices: Record<string, number> = {
  Tomato: 1850,
  Potato: 1420,
  Onion: 1620,
  Maize: 2100,
};

/** Demo market data. Replaced by a market API + forecasting model later. */
export function buildMockMarketReport(cropName: string, state: string, marketName: string): MarketReport {
  const base = basePrices[cropName] ?? 1500;
  const history = Array.from({ length: 12 }, (_, index) => {
    const drift = Math.sin(index / 2) * 0.08 + (index / 12) * 0.06;
    return {
      date: `Week ${index + 1}`,
      price: Math.round(base * (1 + drift)),
    };
  });
  const forecast = Array.from({ length: 4 }, (_, index) => ({
    date: `+${index + 1} week`,
    price: Math.round(base * (1.07 + index * 0.025)),
  }));

  return {
    cropName,
    state,
    marketName,
    currentPrice: history[history.length - 1].price,
    minPrice: Math.round(base * 0.86),
    maxPrice: Math.round(base * 1.24),
    unit: "per quintal",
    trend: "up",
    trendPercent: 6.4,
    history,
    forecast,
    recommendedSellingPeriod: "Second half of next month",
    comparison: (MARKET_PLACES[state] ?? []).map((name, index) => ({
      marketName: name,
      price: Math.round(base * (1 + (index - 1) * 0.045)),
      distanceKm: 12 + index * 18,
    })),
    isDemo: true,
  };
}
