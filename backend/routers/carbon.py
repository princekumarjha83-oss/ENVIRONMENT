from fastapi import APIRouter
from pydantic import BaseModel
from services.simulation import calculate_carbon_footprint

router = APIRouter(prefix="/api/carbon", tags=["Carbon"])

class CarbonInput(BaseModel):
    electricity_kwh: float = 200
    vehicle_km: float = 500
    flights_hours: float = 0
    lpg_kg: float = 10
    fuel_liters: float = 30

@router.post("/calculate")
def calculate(data: CarbonInput):
    return calculate_carbon_footprint(
        data.electricity_kwh, data.vehicle_km,
        data.flights_hours, data.lpg_kg, data.fuel_liters
    )

@router.get("/average-stats")
def average_stats():
    return {
        "india_avg_annual_kg": 1800,
        "global_avg_annual_kg": 4700,
        "paris_target_kg": 2000,
        "top_emitter_kg": 14500,
    }
