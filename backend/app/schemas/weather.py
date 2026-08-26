from datetime import date, datetime

from pydantic import BaseModel


class WeatherDataResponse(BaseModel):
    id: str
    farm_id: str | None = None
    location_name: str
    recorded_for: date
    temperature_c: float | None = None
    humidity_percent: float | None = None
    wind_speed_kmph: float | None = None
    rain_probability_percent: float | None = None
    rainfall_mm: float | None = None
    condition: str | None = None
    state: str | None = None
    district: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    forecast_time: datetime | None = None
    source: str
