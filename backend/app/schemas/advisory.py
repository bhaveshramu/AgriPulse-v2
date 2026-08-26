from pydantic import BaseModel


class AdvisoryResponse(BaseModel):
    id: str
    title: str
    body: str
    category: str
    crop_name: str | None = None
    language: str
    is_demo: bool
    state: str | None = None
    district: str | None = None
