import { apiRequest } from "@/services/apiClient";
import type { WeatherReport } from "@/types";

/**
 * Weather service backed by existing weather_data observations. No provider is called.
 */
export async function getWeatherReport(filters: { state?: string; district?: string } = {}): Promise<WeatherReport> {
  const params = new URLSearchParams();
  if (filters.state) params.set("state", filters.state);
  if (filters.district) params.set("district", filters.district);
  const rows = await apiRequest<WeatherDataRow[]>(`/api/weather?${params}`);
  if (!rows.length) throw new Error("No weather data is available for this location.");
  const latest = rows[0];
  return {
    now: {
      locationName: latest.location_name,
      temperatureC: latest.temperature_c ?? 0,
      condition: latest.condition ?? "Unavailable",
      humidityPercent: latest.humidity_percent ?? 0,
      windSpeedKmph: latest.wind_speed_kmph ?? 0,
      rainProbabilityPercent: latest.rain_probability_percent ?? 0,
    },
    forecast: [...rows].reverse().map((row) => ({
      date: row.recorded_for,
      label: row.recorded_for,
      minC: row.temperature_c ?? 0,
      maxC: row.temperature_c ?? 0,
      condition: row.condition ?? "Unavailable",
      rainProbabilityPercent: row.rain_probability_percent ?? 0,
    })),
    alerts: [],
    cropAdvice: [],
    isDemo: latest.source === "demo",
  };
}

interface WeatherDataRow {
  id: string;
  location_name: string;
  recorded_for: string;
  temperature_c: number | null;
  humidity_percent: number | null;
  wind_speed_kmph: number | null;
  rain_probability_percent: number | null;
  condition: string | null;
  source: string;
}
