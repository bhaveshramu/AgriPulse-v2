import { mockBookings, mockEquipment } from "@/data/mockEquipment";
import type { EquipmentBooking, EquipmentCategory, EquipmentItem } from "@/types";
import { simulateNetwork } from "@/services/serviceUtils";

export interface EquipmentFilters {
  search?: string;
  category?: EquipmentCategory | "all";
  maxDistanceKm?: number;
  onlyAvailable?: boolean;
}

/** Equipment marketplace service. Demo data in Part 1; database-backed later. */
export async function listEquipment(filters: EquipmentFilters = {}): Promise<EquipmentItem[]> {
  await simulateNetwork();
  const search = (filters.search ?? "").trim().toLowerCase();

  return mockEquipment.filter((item) => {
    if (search && !`${item.title} ${item.description}`.toLowerCase().includes(search)) return false;
    if (filters.category && filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.maxDistanceKm && item.distanceKm > filters.maxDistanceKm) return false;
    if (filters.onlyAvailable && !item.isAvailable) return false;
    return true;
  });
}

export async function getEquipmentById(id: string): Promise<EquipmentItem | null> {
  await simulateNetwork(300);
  return mockEquipment.find((item) => item.id === id) ?? null;
}

export async function listMyBookings(): Promise<EquipmentBooking[]> {
  await simulateNetwork();
  return mockBookings;
}

/**
 * Booking request placeholder.
 * Payment (UPI / Razorpay) is intentionally NOT implemented in Part 1.
 */
export async function requestBooking(equipmentId: string, hours: number): Promise<EquipmentBooking> {
  await simulateNetwork(800);
  const item = mockEquipment.find((entry) => entry.id === equipmentId);
  if (!item) throw new Error("Equipment not found");
  return {
    id: `bk-${Date.now()}`,
    equipmentTitle: item.title,
    startDate: new Date().toISOString().slice(0, 10),
    hours,
    totalAmount: Math.round(item.hourlyPrice * hours),
    status: "pending",
  };
}
