import type { DiseaseResult } from "@/types";
import { simulateNetwork } from "@/services/serviceUtils";

export const SUPPORTED_SCAN_CROPS = ["Tomato", "Potato"] as const;
export type ScanCrop = (typeof SUPPORTED_SCAN_CROPS)[number];

const DEMO_RESULTS: Record<ScanCrop, Omit<DiseaseResult, "imageUrl" | "scannedAt">> = {
  Tomato: {
    cropName: "Tomato",
    diseaseName: "Tomato Late Blight",
    confidencePercent: 92,
    severity: "high",
    recommendation:
      "Remove and destroy badly affected leaves. Improve airflow between plants and avoid evening irrigation. Consult your local agriculture officer before using any chemical spray.",
    isDemo: true,
  },
  Potato: {
    cropName: "Potato",
    diseaseName: "Potato Late Blight",
    confidencePercent: 88,
    severity: "medium",
    recommendation:
      "Check the whole field for similar spots. Keep ridges firm so tubers stay covered and stop overhead watering until the weather dries.",
    isDemo: true,
  },
};

/**
 * Crop disease service abstraction.
 *
 * IMPORTANT: no disease model is connected in Part 1. This function returns a
 * clearly-labelled example result. In a later phase its body is replaced by a
 * request to the YOLOv8 FastAPI endpoint; the UI contract stays the same.
 */
export async function analyseCropImage(cropName: ScanCrop, imageUrl: string): Promise<DiseaseResult> {
  await simulateNetwork(1600);
  if (!imageUrl) {
    throw new Error("No image provided");
  }
  return {
    ...DEMO_RESULTS[cropName],
    imageUrl,
    scannedAt: new Date().toISOString(),
  };
}
