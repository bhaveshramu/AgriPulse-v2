from fastapi import APIRouter

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/health")
async def profiles_health() -> dict[str, str]:
    return {"status": "ok", "module": "profiles"}
