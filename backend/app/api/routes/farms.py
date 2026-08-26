from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.farm import FarmCreate, FarmResponse, FarmUpdate

router = APIRouter(prefix="/farms", tags=["farms"])


@router.get("/health")
async def farms_health() -> dict[str, str]:
    return {"status": "ok", "module": "farms"}


FARM_SELECT = "id,name,state,district,village,land_area,land_unit,soil_type,irrigation_type"


async def get_owned_farm(repository: SupabaseRepository, farm_id: str) -> FarmResponse:
    rows = await repository.request("GET", "farms", params={"id": f"eq.{farm_id}", "select": FARM_SELECT})
    if not rows:
        raise HTTPException(status_code=404, detail="Farm not found")
    return FarmResponse.model_validate(rows[0])


@router.get("", response_model=list[FarmResponse])
async def list_farms(repository: SupabaseRepository = Depends(get_repository)) -> list[FarmResponse]:
    rows = await repository.request("GET", "farms", params={"select": FARM_SELECT, "order": "created_at.asc"})
    return [FarmResponse.model_validate(row) for row in rows]


@router.post("", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
async def create_farm(payload: FarmCreate, repository: SupabaseRepository = Depends(get_repository)) -> FarmResponse:
    values = payload.model_dump()
    values["owner_id"] = repository.user.user_id
    rows = await repository.request("POST", "farms", json=values)
    return FarmResponse.model_validate(rows[0])


@router.get("/{farm_id}", response_model=FarmResponse)
async def get_farm(farm_id: str, repository: SupabaseRepository = Depends(get_repository)) -> FarmResponse:
    return await get_owned_farm(repository, farm_id)


@router.patch("/{farm_id}", response_model=FarmResponse)
async def update_farm(farm_id: str, payload: FarmUpdate, repository: SupabaseRepository = Depends(get_repository)) -> FarmResponse:
    await get_owned_farm(repository, farm_id)
    rows = await repository.request("PATCH", "farms", params={"id": f"eq.{farm_id}"}, json=payload.model_dump(exclude_unset=True))
    return FarmResponse.model_validate(rows[0])


@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_farm(farm_id: str, repository: SupabaseRepository = Depends(get_repository)) -> Response:
    await get_owned_farm(repository, farm_id)
    await repository.request("DELETE", "farms", params={"id": f"eq.{farm_id}"}, return_representation=False)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
