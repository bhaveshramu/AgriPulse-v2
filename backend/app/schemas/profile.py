from pydantic import BaseModel, Field, model_validator


class ProfileResponse(BaseModel):
    id: str
    full_name: str
    mobile_number: str | None = None
    email: str | None = None
    state: str | None = None
    district: str | None = None
    village: str | None = None
    preferred_language: str
    farming_experience_years: int | None = Field(default=None, ge=0, le=100)


class ProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=80)
    mobile_number: str | None = Field(default=None, pattern=r"^[6-9]\d{9}$")
    state: str | None = Field(default=None, max_length=100)
    district: str | None = Field(default=None, max_length=100)
    village: str | None = Field(default=None, max_length=100)
    farming_experience_years: int | None = Field(default=None, ge=0, le=100)

    @model_validator(mode="after")
    def includes_a_change(self) -> "ProfileUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one profile field must be provided")
        return self
