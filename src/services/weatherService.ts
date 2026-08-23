import { mockWeatherReport } from "@/data/mockWeather";
import type { WeatherReport } from "@/types";
import { simulateNetwork } from "@/services/serviceUtils";

/**
 * Weather service abstraction.
 * Part 1 returns demo data. A later phase swaps the body of `getWeatherReport`
 * for a call to the backend weather endpoint — the UI stays unchanged.
 */
export async function getWeatherReport(locationName?: string): Promise<WeatherReport> {
  await simulateNetwork();
  return {
    ...mockWeatherReport,
    now: { ...mockWeatherReport.now, locationName: locationName ?? mockWeatherReport.now.locationName },
  };
}
