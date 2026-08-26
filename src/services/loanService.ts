import { apiRequest } from "@/services/apiClient";
import type { LoanAnswers, LoanAssessment } from "@/types";

export async function assessLoanEligibility(answers: LoanAnswers): Promise<LoanAssessment> {
  const landArea = Number(answers.landArea) || 0;
  const experience = Number(answers.experienceYears) || 0;
  const response = await apiRequest<{ readiness_score: number; indicative_amount: number; result_summary: string }>("/api/loan/assess", { method: "POST", body: JSON.stringify({ land_area: landArea, primary_crop: answers.cropType, annual_income: Number(answers.annualIncome) || 0, farming_experience_years: experience, has_existing_loan: answers.existingLoans === "yes", irrigation_available: answers.irrigation === "yes", soil_type: answers.soilType, crop_history: answers.cropHistory }) });
  const band: LoanAssessment["band"] = response.readiness_score >= 70 ? "strong" : response.readiness_score >= 45 ? "moderate" : "low";
  return { score: response.readiness_score, band, indicativeAmount: response.indicative_amount, reasons: [response.result_summary, `Land area recorded: ${landArea || "not provided"} acre`, `${experience} years of farming experience`], nextSteps: ["Keep land records, Aadhaar and bank passbook ready.", "Visit your nearest bank branch or Common Service Centre to apply.", "Ask about the Kisan Credit Card scheme for crop loans."], isDemo: true };
}
