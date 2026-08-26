from pydantic import BaseModel, Field, model_validator


class FarmFields(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    state: str | None = Field(default=None, max_length=100)
    district: str | None = Field(default=None, max_length=100)
    village: str | None = Field(default=None, max_length=100)
    land_area: float | None = Field(default=None, ge=0, le=1_000_000)
    land_unit: str = Field(default="acre", min_length=1, max_length=20)
    soil_type: str | None = Field(default=None, max_length=100)
    irrigation_type: str | None = Field(default=None, max_length=100)


class FarmCreate(FarmFields):
    pass


class FarmUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    state: str | None = Field(default=None, max_length=100)
    district: str | None = Field(default=None, max_length=100)
    village: str | None = Field(default=None, max_length=100)
    land_area: float | None = Field(default=None, ge=0, le=1_000_000)
    land_unit: str | None = Field(default=None, min_length=1, max_length=20)
    soil_type: str | None = Field(default=None, max_length=100)
    irrigation_type: str | None = Field(default=None, max_length=100)

    @model_validator(mode="after")
    def includes_a_change(self) -> "FarmUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one farm field must be provided")
        return self


class FarmResponse(FarmFields):
    id: str
