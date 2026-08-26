import { apiRequest } from "@/services/apiClient";
import type { MarketReport } from "@/types";

export interface MarketQuery {
  cropName: string;
  state: string;
  marketName: string;
}

/**
 * Market price service backed by historical market_data records.
 */
export async function getMarketReport(query: MarketQuery): Promise<MarketReport> {
  const params = new URLSearchParams({ crop_name: query.cropName, state: query.state, market_name: query.marketName });
  const rows = await apiRequest<MarketDataRow[]>(`/api/market?${params}`);
  const history = rows
    .filter((row) => row.modal_price !== null)
    .sort((left, right) => left.price_date.localeCompare(right.price_date));
  if (!history.length) throw new Error("No historical market data is available for this selection.");

  const latest = history.at(-1)!;
  const previous = history.at(-2);
  const trendPercent = previous && previous.modal_price
    ? Math.round(((latest.modal_price! - previous.modal_price) / previous.modal_price) * 100)
    : 0;
  return {
    cropName: latest.crop_name,
    state: latest.state,
    marketName: latest.market_name ?? query.marketName,
    currentPrice: latest.modal_price!,
    minPrice: Math.min(...history.map((row) => row.min_price ?? row.modal_price!)),
    maxPrice: Math.max(...history.map((row) => row.max_price ?? row.modal_price!)),
    unit: "₹",
    trend: trendPercent > 0 ? "up" : trendPercent < 0 ? "down" : "steady",
    trendPercent: Math.abs(trendPercent),
    history: history.map((row) => ({ date: row.price_date, price: row.modal_price! })),
    forecast: [],
    recommendedSellingPeriod: "Price predictions are not available yet.",
    comparison: [],
    isDemo: latest.source === "demo",
  };
}

interface MarketDataRow {
  id: string;
  crop_name: string;
  state: string;
  market_name: string | null;
  price_date: string;
  min_price: number | null;
  max_price: number | null;
  modal_price: number | null;
  source: string;
}
