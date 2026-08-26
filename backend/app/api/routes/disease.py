from fastapi import APIRouter

router = APIRouter(prefix="/disease", tags=["disease"])


@router.get("/health")
async def disease_health() -> dict[str, str]:
    return {"status": "ok", "module": "disease"}
