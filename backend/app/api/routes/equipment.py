from fastapi import APIRouter

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.get("/health")
async def equipment_health() -> dict[str, str]:
    return {"status": "ok", "module": "equipment"}
