import type { WeatherReport } from "@/types";

/** Demo weather data. Replaced by a real weather API in a later phase. */
export const mockWeatherReport: WeatherReport = {
  now: {
    locationName: "Hubballi, Karnataka",
    temperatureC: 28,
    condition: "Cloudy with light showers",
    humidityPercent: 76,
    windSpeedKmph: 12,
    rainProbabilityPercent: 65,
  },
  forecast: [
    { date: "2026-08-24", label: "Mon", minC: 22, maxC: 29, condition: "Light rain", rainProbabilityPercent: 70 },
    { date: "2026-08-25", label: "Tue", minC: 22, maxC: 30, condition: "Cloudy", rainProbabilityPercent: 45 },
    { date: "2026-08-26", label: "Wed", minC: 23, maxC: 31, condition: "Partly sunny", rainProbabilityPercent: 25 },
    { date: "2026-08-27", label: "Thu", minC: 23, maxC: 32, condition: "Sunny", rainProbabilityPercent: 10 },
    { date: "2026-08-28", label: "Fri", minC: 22, maxC: 30, condition: "Heavy rain", rainProbabilityPercent: 85 },
    { date: "2026-08-29", label: "Sat", minC: 21, maxC: 28, condition: "Light rain", rainProbabilityPercent: 60 },
    { date: "2026-08-30", label: "Sun", minC: 22, maxC: 29, condition: "Cloudy", rainProbabilityPercent: 40 },
  ],
  alerts: [
    {
      id: "w1",
      title: "Heavy rainfall expected on Friday",
      message: "Around 60 mm of rain is expected. Check drainage channels around low-lying fields.",
      level: "warning",
    },
    {
      id: "w2",
      title: "High humidity this week",
      message: "Humid weather increases the risk of late blight in tomato and potato.",
      level: "info",
    },
  ],
  cropAdvice: [
    {
      cropName: "Tomato",
      advice: "Heavy rainfall expected. Consider checking drainage around tomato crops and avoid spraying before rain.",
    },
    {
      cropName: "Potato",
      advice: "Keep ridges firm so tubers stay covered. Delay irrigation until the rain passes.",
    },
  ],
  isDemo: true,
};
