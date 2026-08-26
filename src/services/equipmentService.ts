import { apiRequest } from "@/services/apiClient";
import type { EquipmentBooking, EquipmentCategory, EquipmentItem } from "@/types";

export interface EquipmentFilters { search?: string; category?: EquipmentCategory | "all"; maxDistanceKm?: number; onlyAvailable?: boolean; }
interface EquipmentApiRow { id: string; title: string; category: EquipmentCategory; description: string | null; hourly_price: number; state: string | null; district: string | null; village: string | null; is_available: boolean; rating: number; }
interface BookingApiRow { id: string; equipment_id: string; start_date: string; hours: number | null; total_amount: number | null; status: EquipmentBooking["status"]; }

function toEquipmentItem(row: EquipmentApiRow): EquipmentItem {
  return { id: row.id, title: row.title, category: row.category, description: row.description ?? "No description provided.", hourlyPrice: row.hourly_price, district: row.district ?? "Location unavailable", state: row.state ?? "", distanceKm: null, isAvailable: row.is_available, rating: row.rating, ownerName: "Equipment owner", ownerVillage: row.village ?? "", imageHint: "" };
}

export async function listEquipment(filters: EquipmentFilters = {}): Promise<EquipmentItem[]> {
  const items = (await apiRequest<EquipmentApiRow[]>("/api/equipment")).map(toEquipmentItem);
  const search = (filters.search ?? "").trim().toLowerCase();
  return items.filter((item) => {
    if (search && !`${item.title} ${item.description}`.toLowerCase().includes(search)) return false;
    if (filters.category && filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.maxDistanceKm && item.distanceKm !== null && item.distanceKm > filters.maxDistanceKm) return false;
    if (filters.onlyAvailable && !item.isAvailable) return false;
    return true;
  });
}

export async function getEquipmentById(id: string): Promise<EquipmentItem | null> {
  try { return toEquipmentItem(await apiRequest<EquipmentApiRow>(`/api/equipment/${id}`)); }
  catch (error) { if (error instanceof Error && error.message === "Equipment not found") return null; throw error; }
}

export async function listMyBookings(): Promise<EquipmentBooking[]> {
  const equipment = await listEquipment();
  const bookings = await Promise.all(equipment.map(async (item) => ({ item, rows: await apiRequest<BookingApiRow[]>(`/api/equipment/${item.id}/bookings`) })));
  return bookings.flatMap(({ item, rows }) => rows.map((row) => ({ id: row.id, equipmentTitle: item.title, startDate: row.start_date, hours: row.hours ?? 0, totalAmount: row.total_amount ?? 0, status: row.status })));
}

export async function requestBooking(equipmentId: string, hours: number): Promise<EquipmentBooking> {
  const [booking, item] = await Promise.all([
    apiRequest<BookingApiRow>(`/api/equipment/${equipmentId}/bookings`, { method: "POST", body: JSON.stringify({ hours }) }),
    getEquipmentById(equipmentId),
  ]);
  return { id: booking.id, equipmentTitle: item?.title ?? "Equipment", startDate: booking.start_date, hours: booking.hours ?? hours, totalAmount: booking.total_amount ?? 0, status: booking.status };
}
