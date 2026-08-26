import { apiRequest } from "@/services/apiClient";
import type { Crop, DiseaseResult } from "@/types";

interface DiseaseAnalysisApiResponse {
  scan_id: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "unknown";
  recommendation: string;
  model_version: string;
  scanned_at: string;
  status: string;
}

/** Records a placeholder scan. The browser image remains local until storage is implemented. */
export async function analyseCropImage(crop: Crop, imageUrl: string): Promise<DiseaseResult> {
  const response = await apiRequest<DiseaseAnalysisApiResponse>("/api/disease/analyze", {
    method: "POST",
    body: JSON.stringify({
      crop_id: crop.id,
      farm_id: crop.farm_id,
      image_reference: "browser-preview://selected-image",
    }),
  });
  return {
    cropName: response.crop,
    diseaseName: response.disease,
    confidencePercent: response.confidence,
    severity: response.severity,
    recommendation: response.recommendation,
    imageUrl,
    scannedAt: response.scanned_at,
    isDemo: response.status === "placeholder",
  };
}
