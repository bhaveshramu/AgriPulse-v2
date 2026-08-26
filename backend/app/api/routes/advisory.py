from fastapi import APIRouter

router = APIRouter(prefix="/advisory", tags=["advisory"])


@router.get("/health")
async def advisory_health() -> dict[str, str]:
    return {"status": "ok", "module": "advisory"}
