import { mockAdvisories } from "@/data/mockAdvisory";
import type { AdvisoryCategory, AdvisoryItem } from "@/types";
import { simulateNetwork } from "@/services/serviceUtils";

export interface AdvisoryFilters {
  cropName?: string | "all";
  category?: AdvisoryCategory | "all";
}

/** Advisory content service. Demo content in Part 1. */
export async function listAdvisories(filters: AdvisoryFilters = {}): Promise<AdvisoryItem[]> {
  await simulateNetwork();
  return mockAdvisories.filter((item) => {
    if (filters.cropName && filters.cropName !== "all" && item.cropName !== filters.cropName) return false;
    if (filters.category && filters.category !== "all" && item.category !== filters.category) return false;
    return true;
  });
}

export async function getDailyAdvisory(): Promise<AdvisoryItem> {
  await simulateNetwork(250);
  return mockAdvisories[0]!;
}
