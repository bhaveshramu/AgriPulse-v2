from fastapi import APIRouter

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/health")
async def weather_health() -> dict[str, str]:
    return {"status": "ok", "module": "weather"}
