from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.equipment import BookingCreate, BookingResponse, BookingUpdate, EquipmentCreate, EquipmentResponse, EquipmentUpdate

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.get("/health")
async def equipment_health() -> dict[str, str]:
    return {"status": "ok", "module": "equipment"}


EQUIPMENT_SELECT = "id,title,category,description,hourly_price,state,district,village,is_available,rating"
BOOKING_SELECT = "id,equipment_id,start_date,end_date,hours,total_amount,status"


@router.patch("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(booking_id: str, payload: BookingUpdate, repository: SupabaseRepository = Depends(get_repository)) -> BookingResponse:
    rows = await repository.request("PATCH", "equipment_bookings", params={"id": f"eq.{booking_id}", "select": BOOKING_SELECT}, json=payload.model_dump(exclude_unset=True, mode="json"))
    if not rows:
        raise HTTPException(status_code=404, detail="Booking not found")
    return BookingResponse.model_validate(rows[0])


@router.delete("/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(booking_id: str, repository: SupabaseRepository = Depends(get_repository)) -> Response:
    rows = await repository.request("DELETE", "equipment_bookings", params={"id": f"eq.{booking_id}", "select": BOOKING_SELECT})
    if not rows:
        raise HTTPException(status_code=404, detail="Booking not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("", response_model=list[EquipmentResponse])
async def list_equipment(repository: SupabaseRepository = Depends(get_repository)) -> list[EquipmentResponse]:
    rows = await repository.request("GET", "equipment", params={"select": EQUIPMENT_SELECT, "order": "created_at.desc"})
    return [EquipmentResponse.model_validate(row) for row in rows]


@router.post("", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
async def create_equipment(payload: EquipmentCreate, repository: SupabaseRepository = Depends(get_repository)) -> EquipmentResponse:
    values = payload.model_dump()
    values["owner_id"] = repository.user.user_id
    rows = await repository.request("POST", "equipment", params={"select": EQUIPMENT_SELECT}, json=values)
    return EquipmentResponse.model_validate(rows[0])


@router.get("/{equipment_id}/bookings", response_model=list[BookingResponse])
async def list_bookings(equipment_id: str, repository: SupabaseRepository = Depends(get_repository)) -> list[BookingResponse]:
    rows = await repository.request("GET", "equipment_bookings", params={"equipment_id": f"eq.{equipment_id}", "select": BOOKING_SELECT, "order": "created_at.desc"})
    return [BookingResponse.model_validate(row) for row in rows]


@router.post("/{equipment_id}/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(equipment_id: str, payload: BookingCreate, repository: SupabaseRepository = Depends(get_repository)) -> BookingResponse:
    equipment_rows = await repository.request("GET", "equipment", params={"id": f"eq.{equipment_id}", "select": "id,hourly_price,is_available"})
    if not equipment_rows:
        raise HTTPException(status_code=404, detail="Equipment not found")
    equipment = equipment_rows[0]
    if not equipment["is_available"]:
        raise HTTPException(status_code=409, detail="Equipment is not currently available")
    values = {"equipment_id": equipment_id, "renter_id": repository.user.user_id, "hours": payload.hours, "start_date": (payload.start_date or date.today()).isoformat(), "total_amount": float(equipment["hourly_price"]) * payload.hours}
    rows = await repository.request("POST", "equipment_bookings", params={"select": BOOKING_SELECT}, json=values)
    return BookingResponse.model_validate(rows[0])


@router.get("/{equipment_id}", response_model=EquipmentResponse)
async def get_equipment(equipment_id: str, repository: SupabaseRepository = Depends(get_repository)) -> EquipmentResponse:
    rows = await repository.request("GET", "equipment", params={"id": f"eq.{equipment_id}", "select": EQUIPMENT_SELECT})
    if not rows:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return EquipmentResponse.model_validate(rows[0])


@router.patch("/{equipment_id}", response_model=EquipmentResponse)
async def update_equipment(equipment_id: str, payload: EquipmentUpdate, repository: SupabaseRepository = Depends(get_repository)) -> EquipmentResponse:
    rows = await repository.request("PATCH", "equipment", params={"id": f"eq.{equipment_id}", "select": EQUIPMENT_SELECT}, json=payload.model_dump(exclude_unset=True))
    if not rows:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return EquipmentResponse.model_validate(rows[0])


@router.delete("/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_equipment(equipment_id: str, repository: SupabaseRepository = Depends(get_repository)) -> Response:
    rows = await repository.request("DELETE", "equipment", params={"id": f"eq.{equipment_id}", "select": EQUIPMENT_SELECT})
    if not rows:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
