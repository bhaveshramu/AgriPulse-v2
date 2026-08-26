"""Disease-analysis request and placeholder response contracts."""
from datetime import datetime

from pydantic import BaseModel, Field


class DiseaseAnalysisRequest(BaseModel):
    crop_id: str = Field(min_length=1, max_length=100)
    farm_id: str | None = Field(default=None, min_length=1, max_length=100)
    image_reference: str = Field(min_length=1, max_length=2048)


class DiseaseAnalysisResponse(BaseModel):
    scan_id: str
    crop: str
    disease: str
    confidence: float = Field(ge=0, le=100)
    severity: str
    recommendation: str
    model_version: str
    scanned_at: datetime
    status: str
