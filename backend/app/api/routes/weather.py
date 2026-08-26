from fastapi import APIRouter, Depends, Query

from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.weather import WeatherDataResponse

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/health")
async def weather_health() -> dict[str, str]:
    return {"status": "ok", "module": "weather"}


WEATHER_SELECT = "id,farm_id,location_name,recorded_for,temperature_c,humidity_percent,wind_speed_kmph,rain_probability_percent,rainfall_mm,condition,state,district,latitude,longitude,forecast_time,source"


@router.get("", response_model=list[WeatherDataResponse])
async def list_weather_data(
    state: str | None = Query(default=None, max_length=100),
    district: str | None = Query(default=None, max_length=100),
    latitude: float | None = Query(default=None, ge=-90, le=90),
    longitude: float | None = Query(default=None, ge=-180, le=180),
    repository: SupabaseRepository = Depends(get_repository),
) -> list[WeatherDataResponse]:
    filters = {"select": WEATHER_SELECT, "order": "recorded_for.desc"}
    for key, value in (("state", state), ("district", district), ("latitude", latitude), ("longitude", longitude)):
        if value is not None:
            filters[key] = f"eq.{value}"
    rows = await repository.request("GET", "weather_data", params=filters)
    return [WeatherDataResponse.model_validate(row) for row in rows]
