from fastapi import APIRouter, Depends, HTTPException, status

from app.api.routes.farms import get_owned_farm
from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.crop import CropResponse
from app.schemas.disease import DiseaseAnalysisRequest, DiseaseAnalysisResponse

router = APIRouter(prefix="/disease", tags=["disease"])


@router.get("/health")
async def disease_health() -> dict[str, str]:
    return {"status": "ok", "module": "disease"}


CROP_SELECT = "id,farm_id,name,variety,sowing_date,expected_harvest_date,area,growth_stage,health_status"
SCAN_SELECT = "id,crop_name,detected_disease,confidence,severity,recommendation,model_version,scanned_at,status"


async def get_owned_crop(repository: SupabaseRepository, crop_id: str) -> CropResponse:
    rows = await repository.request("GET", "crops", params={"id": f"eq.{crop_id}", "select": CROP_SELECT})
    if not rows:
        raise HTTPException(status_code=404, detail="Crop not found")
    return CropResponse.model_validate(rows[0])


@router.post("/analyze", response_model=DiseaseAnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze_disease(
    payload: DiseaseAnalysisRequest,
    repository: SupabaseRepository = Depends(get_repository),
) -> DiseaseAnalysisResponse:
    crop = await get_owned_crop(repository, payload.crop_id)
    if payload.farm_id:
        await get_owned_farm(repository, payload.farm_id)
        if crop.farm_id != payload.farm_id:
            raise HTTPException(status_code=422, detail="Crop does not belong to the supplied farm")

    # This is intentionally deterministic metadata only. Part 2C does not run ML inference.
    scan_values = {
        "owner_id": repository.user.user_id,
        "crop_id": crop.id,
        "farm_id": crop.farm_id,
        "crop_name": crop.name,
        "image_url": payload.image_reference,
        "detected_disease": "Not analyzed (placeholder)",
        "confidence": 0,
        "severity": "unknown",
        "recommendation": "Disease-model analysis is not available yet. Please consult a local agriculture officer for urgent crop-health concerns.",
        "status": "placeholder",
        "is_demo": True,
        "model_version": "placeholder-v0",
        "raw_predictions": {"placeholder": True, "inference_performed": False},
    }
    rows = await repository.request("POST", "disease_scans", params={"select": SCAN_SELECT}, json=scan_values)
    scan = rows[0]
    return DiseaseAnalysisResponse(
        scan_id=scan["id"],
        crop=scan["crop_name"],
        disease=scan["detected_disease"],
        confidence=float(scan["confidence"]),
        severity=scan["severity"],
        recommendation=scan["recommendation"],
        model_version=scan["model_version"],
        scanned_at=scan["scanned_at"],
        status=scan["status"],
    )
