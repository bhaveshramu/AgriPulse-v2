from datetime import date

from pydantic import BaseModel, Field, model_validator


class EquipmentFields(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    category: str = Field(min_length=1, max_length=50)
    description: str | None = Field(default=None, max_length=2000)
    hourly_price: float = Field(ge=0, le=1_000_000)
    state: str | None = Field(default=None, max_length=100)
    district: str | None = Field(default=None, max_length=100)
    village: str | None = Field(default=None, max_length=100)
    is_available: bool = True


class EquipmentCreate(EquipmentFields):
    pass


class EquipmentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    category: str | None = Field(default=None, min_length=1, max_length=50)
    description: str | None = Field(default=None, max_length=2000)
    hourly_price: float | None = Field(default=None, ge=0, le=1_000_000)
    state: str | None = Field(default=None, max_length=100)
    district: str | None = Field(default=None, max_length=100)
    village: str | None = Field(default=None, max_length=100)
    is_available: bool | None = None

    @model_validator(mode="after")
    def has_change(self) -> "EquipmentUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one equipment field must be provided")
        return self


class EquipmentResponse(EquipmentFields):
    id: str
    rating: float


class BookingCreate(BaseModel):
    hours: float = Field(gt=0, le=720)
    start_date: date | None = None


class BookingUpdate(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    hours: float | None = Field(default=None, gt=0, le=720)
    status: str | None = Field(default=None, pattern="^(pending|cancelled)$")

    @model_validator(mode="after")
    def has_change(self) -> "BookingUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one booking field must be provided")
        return self


class BookingResponse(BaseModel):
    id: str
    equipment_id: str
    start_date: date
    end_date: date | None = None
    hours: float | None = None
    total_amount: float | None = None
    status: str
