export type UserRole = "farmer" | "officer" | "fpo" | "admin";

export type LanguageCode = "en" | "kn";

export interface Profile {
  id: string;
  full_name: string;
  mobile_number: string | null;
  email: string | null;
  state: string | null;
  district: string | null;
  village: string | null;
  preferred_language: string;
  farming_experience_years: number | null;
}

export interface Farm {
  id: string;
  name: string;
  state: string | null;
  district: string | null;
  village: string | null;
  land_area: number | null;
  land_unit: string;
  soil_type: string | null;
  irrigation_type: string | null;
}

export interface Crop {
  id: string;
  farm_id: string;
  name: string;
  variety: string | null;
  sowing_date: string | null;
  expected_harvest_date: string | null;
  area: number | null;
  growth_stage: string;
  health_status: string;
}

export interface WeatherNow {
  locationName: string;
  temperatureC: number;
  condition: string;
  humidityPercent: number;
  windSpeedKmph: number;
  rainProbabilityPercent: number;
}

export interface WeatherDay {
  date: string;
  label: string;
  minC: number;
  maxC: number;
  condition: string;
  rainProbabilityPercent: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  message: string;
  level: "info" | "warning" | "severe";
}

export interface WeatherReport {
  now: WeatherNow;
  forecast: WeatherDay[];
  alerts: WeatherAlert[];
  cropAdvice: { cropName: string; advice: string }[];
  isDemo: boolean;
}

export interface MarketPricePoint {
  date: string;
  price: number;
}

export interface MarketReport {
  cropName: string;
  state: string;
  marketName: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  trend: "up" | "down" | "steady";
  trendPercent: number;
  history: MarketPricePoint[];
  forecast: MarketPricePoint[];
  recommendedSellingPeriod: string;
  comparison: { marketName: string; price: number; distanceKm: number }[];
  isDemo: boolean;
}

export interface DiseaseResult {
  cropName: string;
  diseaseName: string;
  confidencePercent: number;
  severity: "low" | "medium" | "high";
  recommendation: string;
  scannedAt: string;
  imageUrl: string;
  isDemo: boolean;
}

export type EquipmentCategory =
  | "tractor"
  | "harvester"
  | "drone"
  | "cultivator"
  | "sprayer"
  | "other";

export interface EquipmentItem {
  id: string;
  title: string;
  category: EquipmentCategory;
  description: string;
  hourlyPrice: number;
  district: string;
  state: string;
  distanceKm: number;
  isAvailable: boolean;
  rating: number;
  ownerName: string;
  ownerVillage: string;
  imageHint: string;
}

export interface EquipmentBooking {
  id: string;
  equipmentTitle: string;
  startDate: string;
  hours: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export type AdvisoryCategory =
  | "crop"
  | "weather"
  | "disease"
  | "irrigation"
  | "sowing"
  | "harvest"
  | "market";

export interface AdvisoryItem {
  id: string;
  title: string;
  body: string;
  category: AdvisoryCategory;
  cropName: string | null;
  isDemo: boolean;
}

export interface LoanAnswers {
  landArea: string;
  cropType: string;
  annualIncome: string;
  existingLoans: string;
  experienceYears: string;
  irrigation: string;
  soilType: string;
  cropHistory: string;
}

export interface LoanAssessment {
  score: number;
  band: "low" | "moderate" | "strong";
  indicativeAmount: number;
  reasons: string[];
  nextSteps: string[];
  isDemo: boolean;
}
