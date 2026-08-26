/**
 * Shared helpers for the service layer.
 *
 * The base URL of the Python/FastAPI backend is read from an
 * environment variable so no endpoint or credential is hard-coded in the app.
 */
export const API_BASE_URL = import.meta.env['VITE_API_BASE_URL'] ?? "";

/** Small delay so loading states are visible while services return demo data. */
export function simulateNetwork(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
