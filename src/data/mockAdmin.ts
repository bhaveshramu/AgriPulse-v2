/** Demo admin analytics. Replaced by real aggregate queries later. */
export const mockAdminOverview = {
  totalFarmers: 1284,
  activeUsers: 412,
  diseaseScans: 3760,
  registeredFarms: 1502,
  equipmentListings: 238,
  equipmentBookings: 561,
  marketSearches: 8940,
  advisoryViews: 6120,
};

export const mockScanTrend = [
  { month: "Mar", scans: 210 },
  { month: "Apr", scans: 285 },
  { month: "May", scans: 340 },
  { month: "Jun", scans: 520 },
  { month: "Jul", scans: 610 },
  { month: "Aug", scans: 705 },
];

export const mockDiseaseSplit = [
  { name: "Tomato Late Blight", value: 46 },
  { name: "Potato Late Blight", value: 34 },
  { name: "Healthy", value: 20 },
];

export const mockMarketSearches = [
  { crop: "Tomato", searches: 3120 },
  { crop: "Potato", searches: 2410 },
  { crop: "Onion", searches: 1980 },
  { crop: "Maize", searches: 1430 },
];

export const mockAdminUsers = [
  { id: "u-1", name: "Ramesh Patil", district: "Dharwad", role: "Farmer", farms: 2, joined: "2026-05-14" },
  { id: "u-2", name: "Lakshmi Devi", district: "Dharwad", role: "Farmer", farms: 1, joined: "2026-06-02" },
  { id: "u-3", name: "Shivanand Hiremath", district: "Belagavi", role: "FPO", farms: 6, joined: "2026-06-21" },
  { id: "u-4", name: "Anita Kulkarni", district: "Gadag", role: "Agriculture Officer", farms: 0, joined: "2026-07-05" },
  { id: "u-5", name: "Basavaraj S", district: "Gadag", role: "Farmer", farms: 3, joined: "2026-07-19" },
];
