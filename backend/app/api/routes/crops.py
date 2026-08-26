from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.api.routes.farms import get_owned_farm
from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.crop import CropCreate, CropResponse, CropUpdate

router = APIRouter(tags=["crops"])


@router.get("/crops/health")
async def crops_health() -> dict[str, str]:
    return {"status": "ok", "module": "crops"}


CROP_SELECT = "id,farm_id,name,variety,sowing_date,expected_harvest_date,area,growth_stage,health_status"


async def get_owned_crop(repository: SupabaseRepository, farm_id: str, crop_id: str) -> CropResponse:
    await get_owned_farm(repository, farm_id)
    rows = await repository.request("GET", "crops", params={"id": f"eq.{crop_id}", "farm_id": f"eq.{farm_id}", "select": CROP_SELECT})
    if not rows:
        raise HTTPException(status_code=404, detail="Crop not found")
    return CropResponse.model_validate(rows[0])


@router.get("/farms/{farm_id}/crops", response_model=list[CropResponse])
async def list_crops(farm_id: str, repository: SupabaseRepository = Depends(get_repository)) -> list[CropResponse]:
    await get_owned_farm(repository, farm_id)
    rows = await repository.request("GET", "crops", params={"farm_id": f"eq.{farm_id}", "select": CROP_SELECT, "order": "created_at.asc"})
    return [CropResponse.model_validate(row) for row in rows]


@router.post("/farms/{farm_id}/crops", response_model=CropResponse, status_code=status.HTTP_201_CREATED)
async def create_crop(farm_id: str, payload: CropCreate, repository: SupabaseRepository = Depends(get_repository)) -> CropResponse:
    await get_owned_farm(repository, farm_id)
    values = payload.model_dump(mode="json")
    values.update({"farm_id": farm_id, "owner_id": repository.user.user_id})
    rows = await repository.request("POST", "crops", json=values)
    return CropResponse.model_validate(rows[0])


@router.get("/farms/{farm_id}/crops/{crop_id}", response_model=CropResponse)
async def get_crop(farm_id: str, crop_id: str, repository: SupabaseRepository = Depends(get_repository)) -> CropResponse:
    return await get_owned_crop(repository, farm_id, crop_id)


@router.patch("/farms/{farm_id}/crops/{crop_id}", response_model=CropResponse)
async def update_crop(farm_id: str, crop_id: str, payload: CropUpdate, repository: SupabaseRepository = Depends(get_repository)) -> CropResponse:
    await get_owned_crop(repository, farm_id, crop_id)
    rows = await repository.request("PATCH", "crops", params={"id": f"eq.{crop_id}", "farm_id": f"eq.{farm_id}"}, json=payload.model_dump(exclude_unset=True, mode="json"))
    return CropResponse.model_validate(rows[0])


@router.delete("/farms/{farm_id}/crops/{crop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_crop(farm_id: str, crop_id: str, repository: SupabaseRepository = Depends(get_repository)) -> Response:
    await get_owned_crop(repository, farm_id, crop_id)
    await repository.request("DELETE", "crops", params={"id": f"eq.{crop_id}", "farm_id": f"eq.{farm_id}"}, return_representation=False)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
