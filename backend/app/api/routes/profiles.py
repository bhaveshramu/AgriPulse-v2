from fastapi import APIRouter, Depends, HTTPException

from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.profile import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/health")
async def profiles_health() -> dict[str, str]:
    return {"status": "ok", "module": "profiles"}


@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(repository: SupabaseRepository = Depends(get_repository)) -> ProfileResponse:
    rows = await repository.request(
        "GET", "profiles", params={"id": f"eq.{repository.user.user_id}", "select": "id,full_name,mobile_number,email,state,district,village,preferred_language,farming_experience_years"}
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse.model_validate(rows[0])


@router.patch("/me", response_model=ProfileResponse)
async def update_my_profile(
    payload: ProfileUpdate, repository: SupabaseRepository = Depends(get_repository)
) -> ProfileResponse:
    rows = await repository.request(
        "PATCH", "profiles", params={"id": f"eq.{repository.user.user_id}", "select": "id,full_name,mobile_number,email,state,district,village,preferred_language,farming_experience_years"}, json=payload.model_dump(exclude_unset=True)
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse.model_validate(rows[0])
