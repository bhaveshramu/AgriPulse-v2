from fastapi import APIRouter, Depends, status

from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.loan import LoanAssessmentRequest, LoanAssessmentResponse

router = APIRouter(prefix="/loan", tags=["loan"])


@router.get("/health")
async def loan_health() -> dict[str, str]:
    return {"status": "ok", "module": "loan"}


LOAN_SELECT = "id,readiness_score,indicative_amount,result_summary,created_at"


@router.post("/assess", response_model=LoanAssessmentResponse, status_code=status.HTTP_201_CREATED)
async def assess_loan(payload: LoanAssessmentRequest, repository: SupabaseRepository = Depends(get_repository)) -> LoanAssessmentResponse:
    score = 30 + min(payload.land_area * 6, 25) + min(payload.annual_income / 20_000, 20) + min(payload.farming_experience_years * 1.5, 15)
    score += 10 if payload.irrigation_available else 0
    score -= 12 if payload.has_existing_loan else 0
    readiness_score = max(5, min(95, round(score)))
    indicative_amount = round(max(payload.land_area, 1) * 45_000 * (readiness_score / 100))
    income_band = "under_1_lakh" if payload.annual_income < 100_000 else "1_to_3_lakh" if payload.annual_income < 300_000 else "over_3_lakh"
    summary = "Indicative eligibility assessment only. This is not a loan approval or a bank decision."
    values = {"user_id": repository.user.user_id, "land_area": payload.land_area, "primary_crop": payload.primary_crop, "farming_experience_years": payload.farming_experience_years, "annual_income_band": income_band, "has_existing_loan": payload.has_existing_loan, "readiness_score": readiness_score, "indicative_amount": indicative_amount, "result_summary": summary}
    rows = await repository.request("POST", "loan_assessments", params={"select": LOAN_SELECT}, json=values)
    return LoanAssessmentResponse.model_validate(rows[0])


@router.get("/assessments", response_model=list[LoanAssessmentResponse])
async def list_loan_assessments(repository: SupabaseRepository = Depends(get_repository)) -> list[LoanAssessmentResponse]:
    rows = await repository.request("GET", "loan_assessments", params={"select": LOAN_SELECT, "order": "created_at.desc"})
    return [LoanAssessmentResponse.model_validate(row) for row in rows]
