from fastapi import APIRouter

router = APIRouter(prefix="/crops", tags=["crops"])


@router.get("/health")
async def crops_health() -> dict[str, str]:
    return {"status": "ok", "module": "crops"}
