from datetime import date

from pydantic import BaseModel


class MarketDataResponse(BaseModel):
    id: str
    crop_name: str
    state: str
    district: str | None = None
    market_name: str | None = None
    price_date: date
    min_price: float | None = None
    max_price: float | None = None
    modal_price: float | None = None
    source: str


class MarketPredictionsResponse(BaseModel):
    items: list[dict] = []
    status: str = "not_available"
