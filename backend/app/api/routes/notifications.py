from fastapi import APIRouter, Depends, HTTPException

from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.notification import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/health")
async def notifications_health() -> dict[str, str]:
    return {"status": "ok", "module": "notifications"}


NOTIFICATION_SELECT = "id,title,message,type,is_read,created_at"


@router.get("", response_model=list[NotificationResponse])
async def list_notifications(repository: SupabaseRepository = Depends(get_repository)) -> list[NotificationResponse]:
    rows = await repository.request("GET", "notifications", params={"select": NOTIFICATION_SELECT, "order": "created_at.desc"})
    return [NotificationResponse.model_validate(row) for row in rows]


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(notification_id: str, repository: SupabaseRepository = Depends(get_repository)) -> NotificationResponse:
    rows = await repository.request("PATCH", "notifications", params={"id": f"eq.{notification_id}", "select": NOTIFICATION_SELECT}, json={"is_read": True})
    if not rows:
        raise HTTPException(status_code=404, detail="Notification not found")
    return NotificationResponse.model_validate(rows[0])
