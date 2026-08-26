"""Future disease-analysis response contract; no ML inference is implemented."""
from datetime import datetime

from pydantic import BaseModel, Field


class DiseaseAnalysisResponse(BaseModel):
    crop_name: str
    detected_disease: str | None = None
    confidence_percent: float | None = Field(default=None, ge=0, le=100)
    severity: str | None = None
    recommendation: str | None = None
    model_version: str | None = None
    analyzed_at: datetime
