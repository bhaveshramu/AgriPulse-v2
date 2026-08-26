from fastapi import APIRouter

from app.api.routes import (
    advisory,
    crops,
    disease,
    equipment,
    farms,
    health,
    loan,
    market,
    notifications,
    profiles,
    weather,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(profiles.router)
api_router.include_router(farms.router)
api_router.include_router(crops.router)
api_router.include_router(disease.router)
api_router.include_router(market.router)
api_router.include_router(weather.router)
api_router.include_router(equipment.router)
api_router.include_router(loan.router)
api_router.include_router(advisory.router)
api_router.include_router(notifications.router)
