from fastapi import APIRouter

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/health")
async def notifications_health() -> dict[str, str]:
    return {"status": "ok", "module": "notifications"}
