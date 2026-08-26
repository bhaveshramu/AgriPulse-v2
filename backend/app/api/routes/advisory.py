from fastapi import APIRouter, Depends, Query

from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.advisory import AdvisoryResponse

router = APIRouter(prefix="/advisory", tags=["advisory"])


@router.get("/health")
async def advisory_health() -> dict[str, str]:
    return {"status": "ok", "module": "advisory"}


ADVISORY_SELECT = "id,title,body,category,crop_name,language,is_demo,state,district"


@router.get("", response_model=list[AdvisoryResponse])
async def list_advisories(
    state: str | None = Query(default=None, max_length=100), district: str | None = Query(default=None, max_length=100),
    crop_name: str | None = Query(default=None, max_length=100), category: str | None = Query(default=None, max_length=50),
    repository: SupabaseRepository = Depends(get_repository),
) -> list[AdvisoryResponse]:
    filters = {"select": ADVISORY_SELECT, "order": "created_at.desc"}
    for key, value in (("state", state), ("district", district), ("crop_name", crop_name), ("category", category)):
        if value:
            filters[key] = f"eq.{value}"
    rows = await repository.request("GET", "advisories", params=filters)
    return [AdvisoryResponse.model_validate(row) for row in rows]
