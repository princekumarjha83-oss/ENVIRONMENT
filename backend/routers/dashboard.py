from fastapi import APIRouter, Query
from services.simulation import get_live_metrics, get_historical_data, CITIES

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/metrics")
def dashboard_metrics(city: str = Query(default="Delhi")):
    return get_live_metrics(city)

@router.get("/history")
def dashboard_history(city: str = Query(default="Delhi"), days: int = Query(default=30)):
    return get_historical_data(city, days)

@router.get("/cities")
def list_cities():
    return [c["name"] for c in CITIES]

@router.get("/global-stats")
def global_stats():
    return {
        "total_cities_monitored": 15,
        "sensors_active": 1247,
        "alerts_today": 23,
        "data_points_collected": 8_432_091,
        "ai_analyses_done": 54_200,
        "reports_generated": 3_812,
        "trees_tracked": 2_500_000,
        "co2_offset_tonnes": 52_000,
    }
