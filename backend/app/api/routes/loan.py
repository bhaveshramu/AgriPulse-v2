from fastapi import APIRouter

router = APIRouter(prefix="/loan", tags=["loan"])


@router.get("/health")
async def loan_health() -> dict[str, str]:
    return {"status": "ok", "module": "loan"}
