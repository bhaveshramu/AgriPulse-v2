/** Reference location data. Replaced by a full state/district dataset later. */
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Bihar",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
] as const;

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  Karnataka: ["Bagalkot", "Belagavi", "Bengaluru Rural", "Dharwad", "Gadag", "Haveri", "Mysuru", "Tumakuru"],
  Maharashtra: ["Ahmednagar", "Nashik", "Pune", "Solapur"],
  "Tamil Nadu": ["Coimbatore", "Erode", "Salem", "Thanjavur"],
  Punjab: ["Amritsar", "Ludhiana", "Patiala"],
};

export const SOIL_TYPES = ["Black (Regur)", "Red", "Alluvial", "Laterite", "Sandy", "Clay Loam"];
export const IRRIGATION_TYPES = ["Rainfed", "Borewell", "Canal", "Drip", "Sprinkler", "Open well"];
export const LAND_UNITS = ["acre", "hectare", "guntha"];
export const GROWTH_STAGES = ["Sowing", "Seedling", "Vegetative", "Flowering", "Fruiting", "Harvest ready"];
export const CROP_OPTIONS = ["Tomato", "Potato", "Onion", "Maize", "Paddy", "Cotton"];
