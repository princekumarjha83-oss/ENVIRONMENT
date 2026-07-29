from fastapi import APIRouter, Query
from services.simulation import get_prediction, get_live_metrics

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

@router.get("/forecast")
def get_forecast(city: str = Query(default="Delhi")):
    return get_prediction(city)

@router.get("/models")
def get_models():
    return [
        {"name": "Random Forest", "accuracy": "88.7%", "type": "Ensemble", "features": 24, "status": "Active"},
        {"name": "XGBoost", "accuracy": "91.3%", "type": "Gradient Boosting", "features": 24, "status": "Active"},
        {"name": "LSTM Neural Network", "accuracy": "89.4%", "type": "Deep Learning", "features": 12, "status": "Active"},
        {"name": "Linear Regression", "accuracy": "74.2%", "type": "Baseline", "features": 8, "status": "Archived"},
    ]

@router.get("/risk-assessment")
def get_risk(city: str = Query(default="Delhi")):
    metrics = get_live_metrics(city)
    risks = []
    if metrics["aqi"] > 200:
        risks.append({"type": "Air Quality", "level": "Critical", "icon": "😷", "value": metrics["aqi"]})
    elif metrics["aqi"] > 100:
        risks.append({"type": "Air Quality", "level": "Moderate", "icon": "😐", "value": metrics["aqi"]})
    
    if metrics["temperature"] > 40:
        risks.append({"type": "Heatwave", "level": "High", "icon": "🌡️", "value": metrics["temperature"]})
    if metrics["rainfall"] > 40:
        risks.append({"type": "Flood Risk", "level": "High", "icon": "🌊", "value": metrics["rainfall"]})
    if metrics["uv_index"] > 8:
        risks.append({"type": "UV Radiation", "level": "High", "icon": "☀️", "value": metrics["uv_index"]})
    
    return {"city": city, "risks": risks, "overall_risk": "High" if len(risks) >= 2 else "Moderate" if risks else "Low"}
