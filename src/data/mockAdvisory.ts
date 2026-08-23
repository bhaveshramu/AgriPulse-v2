import type { AdvisoryItem } from "@/types";

/** Demo advisory content. Replaced by curated/agri-department content later. */
export const mockAdvisories: AdvisoryItem[] = [
  {
    id: "ad-1",
    title: "Protect tomato from late blight in humid weather",
    body: "When humidity stays above 80% for two days, late blight spreads quickly. Remove infected leaves, keep spacing between plants, and avoid watering in the evening.",
    category: "disease",
    cropName: "Tomato",
    isDemo: true,
  },
  {
    id: "ad-2",
    title: "Earth up potato ridges before heavy rain",
    body: "Firm ridges stop rainwater from exposing tubers. Check that drainage channels between ridges are clear.",
    category: "crop",
    cropName: "Potato",
    isDemo: true,
  },
  {
    id: "ad-3",
    title: "Skip irrigation when rain is expected",
    body: "If rain chance is above 60%, delay irrigation by one day. This saves water and prevents root rot in vegetable crops.",
    category: "irrigation",
    cropName: null,
    isDemo: true,
  },
  {
    id: "ad-4",
    title: "Sow tomato nursery on raised beds",
    body: "Raised beds of 15 cm height drain better during monsoon and reduce damping-off in seedlings.",
    category: "sowing",
    cropName: "Tomato",
    isDemo: true,
  },
  {
    id: "ad-5",
    title: "Harvest potato when leaves start drying",
    body: "Wait 10 to 15 days after the tops dry so the skin sets properly. This reduces damage during transport.",
    category: "harvest",
    cropName: "Potato",
    isDemo: true,
  },
  {
    id: "ad-6",
    title: "Compare two markets before selling",
    body: "Prices between nearby markets can differ by 10%. Compare today's price and transport cost before deciding.",
    category: "market",
    cropName: null,
    isDemo: true,
  },
  {
    id: "ad-7",
    title: "Plan field work around the weekly rain window",
    body: "Spraying done less than 4 hours before rain is usually washed off. Check the 7-day forecast before buying inputs.",
    category: "weather",
    cropName: null,
    isDemo: true,
  },
];
