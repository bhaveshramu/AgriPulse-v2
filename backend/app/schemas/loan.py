from datetime import datetime

from pydantic import BaseModel, Field


class LoanAssessmentRequest(BaseModel):
    land_area: float = Field(ge=0, le=1_000_000)
    primary_crop: str = Field(min_length=1, max_length=100)
    annual_income: float = Field(ge=0, le=100_000_000)
    farming_experience_years: int = Field(ge=0, le=100)
    has_existing_loan: bool = False
    irrigation_available: bool = False
    soil_type: str | None = Field(default=None, max_length=100)
    crop_history: str | None = Field(default=None, max_length=50)


class LoanAssessmentResponse(BaseModel):
    id: str
    readiness_score: int
    indicative_amount: float
    result_summary: str
    created_at: datetime
