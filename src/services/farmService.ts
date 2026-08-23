import { supabase } from "@/integrations/supabase/client";
import type { Crop, Farm } from "@/types";

/** Farm and crop data access. Backed by Lovable Cloud with row level security. */

export async function listFarms(): Promise<Farm[]> {
  const { data, error } = await supabase
    .from("farms")
    .select("id, owner_id, name, state, district, village, land_area, land_unit, soil_type, irrigation_type")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Farm[];
}

export type FarmInput = Omit<Farm, "id" | "owner_id">;

export async function createFarm(ownerId: string, input: FarmInput): Promise<void> {
  const { error } = await supabase.from("farms").insert({ ...input, owner_id: ownerId });
  if (error) throw new Error(error.message);
}

export async function updateFarm(id: string, input: Partial<FarmInput>): Promise<void> {
  const { error } = await supabase.from("farms").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteFarm(id: string): Promise<void> {
  const { error } = await supabase.from("farms").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listCrops(): Promise<Crop[]> {
  const { data, error } = await supabase
    .from("crops")
    .select("id, farm_id, name, variety, sowing_date, expected_harvest_date, area, growth_stage, health_status")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Crop[];
}

export type CropInput = Omit<Crop, "id">;

export async function createCrop(ownerId: string, input: CropInput): Promise<void> {
  const { error } = await supabase.from("crops").insert({ ...input, owner_id: ownerId });
  if (error) throw new Error(error.message);
}

export async function deleteCrop(id: string): Promise<void> {
  const { error } = await supabase.from("crops").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
