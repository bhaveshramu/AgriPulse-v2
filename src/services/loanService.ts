import type { LoanAnswers, LoanAssessment } from "@/types";
import { simulateNetwork } from "@/services/serviceUtils";

/**
 * Loan advisory service.
 *
 * This produces a DEMO assessment only. It is not a bank decision and no
 * DigiLocker, land record, or Soil Health Card integration exists yet. Later
 * phases replace this with a backend call that combines verified documents
 * with scheme eligibility rules.
 */
export async function assessLoanEligibility(answers: LoanAnswers): Promise<LoanAssessment> {
  await simulateNetwork(900);

  const landArea = Number(answers.landArea) || 0;
  const income = Number(answers.annualIncome) || 0;
  const experience = Number(answers.experienceYears) || 0;
  const hasLoans = answers.existingLoans === "yes";
  const irrigated = answers.irrigation === "yes";

  let score = 30;
  score += Math.min(landArea * 6, 25);
  score += Math.min(income / 20000, 20);
  score += Math.min(experience * 1.5, 15);
  if (irrigated) score += 10;
  if (hasLoans) score -= 12;
  score = Math.max(5, Math.min(95, Math.round(score)));

  const band: LoanAssessment["band"] = score >= 70 ? "strong" : score >= 45 ? "moderate" : "low";

  const reasons: string[] = [];
  reasons.push(`Land area recorded: ${landArea || "not provided"} acre`);
  reasons.push(irrigated ? "Irrigation available on the farm" : "No assured irrigation recorded");
  reasons.push(hasLoans ? "An existing loan was reported" : "No existing loan reported");
  reasons.push(`${experience || 0} years of farming experience`);

  return {
    score,
    band,
    indicativeAmount: Math.round(Math.max(landArea, 1) * 45000 * (score / 100)) ,
    reasons,
    nextSteps: [
      "Keep land records, Aadhaar and bank passbook ready.",
      "Visit your nearest bank branch or Common Service Centre to apply.",
      "Ask about the Kisan Credit Card scheme for crop loans.",
    ],
    isDemo: true,
  };
}
