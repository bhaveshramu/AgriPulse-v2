from fastapi import APIRouter

router = APIRouter(prefix="/farms", tags=["farms"])


@router.get("/health")
async def farms_health() -> dict[str, str]:
    return {"status": "ok", "module": "farms"}
