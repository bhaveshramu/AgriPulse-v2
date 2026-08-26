import { apiRequest } from "@/services/apiClient";
import type { AdvisoryCategory, AdvisoryItem } from "@/types";

export interface AdvisoryFilters { cropName?: string | "all"; category?: AdvisoryCategory | "all"; }
interface AdvisoryApiRow { id: string; title: string; body: string; category: string; crop_name: string | null; is_demo: boolean; }

export async function listAdvisories(filters: AdvisoryFilters = {}): Promise<AdvisoryItem[]> {
  const params = new URLSearchParams();
  if (filters.cropName && filters.cropName !== "all") params.set("crop_name", filters.cropName);
  if (filters.category && filters.category !== "all") params.set("category", filters.category);
  const rows = await apiRequest<AdvisoryApiRow[]>(`/api/advisory?${params}`);
  return rows.map((row) => ({ id: row.id, title: row.title, body: row.body, category: row.category as AdvisoryCategory, cropName: row.crop_name, isDemo: row.is_demo }));
}

export async function getDailyAdvisory(): Promise<AdvisoryItem> {
  const items = await listAdvisories();
  if (!items[0]) throw new Error("No advisories are available.");
  return items[0];
}
