import { apiRequest } from "@/services/apiClient";
import type { Crop, Farm } from "@/types";

/** Farm and crop data access. Backed by Lovable Cloud with row level security. */

export async function listFarms(): Promise<Farm[]> {
  return apiRequest<Farm[]>("/api/farms");
}

export type FarmInput = Omit<Farm, "id">;

export async function createFarm(input: FarmInput): Promise<Farm> {
  return apiRequest<Farm>("/api/farms", { method: "POST", body: JSON.stringify(input) });
}

export async function updateFarm(id: string, input: Partial<FarmInput>): Promise<Farm> {
  return apiRequest<Farm>(`/api/farms/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export async function deleteFarm(id: string): Promise<void> {
  await apiRequest<void>(`/api/farms/${id}`, { method: "DELETE" });
}

export async function listCrops(): Promise<Crop[]> {
  const farms = await listFarms();
  const cropsByFarm = await Promise.all(farms.map((farm) => listFarmCrops(farm.id)));
  return cropsByFarm.flat();
}

export type CropInput = Omit<Crop, "id">;

export async function listFarmCrops(farmId: string): Promise<Crop[]> {
  return apiRequest<Crop[]>(`/api/farms/${farmId}/crops`);
}

export async function createCrop(input: CropInput): Promise<Crop> {
  const { farm_id, ...payload } = input;
  return apiRequest<Crop>(`/api/farms/${farm_id}/crops`, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateCrop(farmId: string, cropId: string, input: Partial<Omit<CropInput, "farm_id">>): Promise<Crop> {
  return apiRequest<Crop>(`/api/farms/${farmId}/crops/${cropId}`, { method: "PATCH", body: JSON.stringify(input) });
}

export async function deleteCrop(farmId: string, cropId: string): Promise<void> {
  await apiRequest<void>(`/api/farms/${farmId}/crops/${cropId}`, { method: "DELETE" });
}
