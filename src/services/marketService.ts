import { buildMockMarketReport } from "@/data/mockMarket";
import type { MarketReport } from "@/types";
import { simulateNetwork } from "@/services/serviceUtils";

export interface MarketQuery {
  cropName: string;
  state: string;
  marketName: string;
}

/**
 * Market price service abstraction.
 * Part 1 returns demo data. Later this calls the market API and the
 * price-forecasting model through the backend.
 */
export async function getMarketReport(query: MarketQuery): Promise<MarketReport> {
  await simulateNetwork();
  return buildMockMarketReport(query.cropName, query.state, query.marketName);
}
