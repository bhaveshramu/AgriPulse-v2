from fastapi import APIRouter, Depends, HTTPException, Query

from app.db.supabase import SupabaseRepository, get_repository
from app.schemas.market import MarketDataResponse, MarketPredictionsResponse

router = APIRouter(prefix="/market", tags=["market"])


@router.get("/health")
async def market_health() -> dict[str, str]:
    return {"status": "ok", "module": "market"}


MARKET_SELECT = "id,crop_name,state,district,market_name,price_date,min_price,max_price,modal_price,source"


def market_filters(
    crop_name: str | None, state: str | None, district: str | None, market_name: str | None
) -> dict[str, str]:
    filters = {"select": MARKET_SELECT, "order": "price_date.desc"}
    for key, value in (("crop_name", crop_name), ("state", state), ("district", district), ("market_name", market_name)):
        if value:
            filters[key] = f"eq.{value}"
    return filters


@router.get("", response_model=list[MarketDataResponse])
async def list_market_data(
    crop_name: str | None = Query(default=None, max_length=100),
    state: str | None = Query(default=None, max_length=100),
    district: str | None = Query(default=None, max_length=100),
    market_name: str | None = Query(default=None, max_length=150),
    repository: SupabaseRepository = Depends(get_repository),
) -> list[MarketDataResponse]:
    rows = await repository.request("GET", "market_data", params=market_filters(crop_name, state, district, market_name))
    return [MarketDataResponse.model_validate(row) for row in rows]


@router.get("/predictions", response_model=MarketPredictionsResponse)
async def list_market_predictions(repository: SupabaseRepository = Depends(get_repository)) -> MarketPredictionsResponse:
    # Predictions are deliberately not queried or generated until the ML module exists.
    return MarketPredictionsResponse()


@router.get("/{market_id}", response_model=MarketDataResponse)
async def get_market_data(market_id: str, repository: SupabaseRepository = Depends(get_repository)) -> MarketDataResponse:
    rows = await repository.request("GET", "market_data", params={"id": f"eq.{market_id}", "select": MARKET_SELECT})
    if not rows:
        raise HTTPException(status_code=404, detail="Market data record not found")
    return MarketDataResponse.model_validate(rows[0])
