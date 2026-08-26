from datetime import date

from pydantic import BaseModel, Field, model_validator


class CropCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    variety: str | None = Field(default=None, max_length=100)
    sowing_date: date | None = None
    expected_harvest_date: date | None = None
    area: float | None = Field(default=None, ge=0, le=1_000_000)
    growth_stage: str = Field(default="sowing", min_length=1, max_length=100)
    health_status: str = Field(default="healthy", min_length=1, max_length=100)

    @model_validator(mode="after")
    def harvest_follows_sowing(self) -> "CropCreate":
        if self.sowing_date and self.expected_harvest_date and self.expected_harvest_date < self.sowing_date:
            raise ValueError("Expected harvest date cannot be before sowing date")
        return self


class CropUpdate(CropCreate):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    growth_stage: str | None = Field(default=None, min_length=1, max_length=100)
    health_status: str | None = Field(default=None, min_length=1, max_length=100)

    @model_validator(mode="after")
    def includes_a_change(self) -> "CropUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one crop field must be provided")
        return self


class CropResponse(CropCreate):
    id: str
    farm_id: str
