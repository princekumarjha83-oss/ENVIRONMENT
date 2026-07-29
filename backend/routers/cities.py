from fastapi import APIRouter, Query
from services.simulation import get_city_rankings, get_live_metrics, CITIES

router = APIRouter(prefix="/api/cities", tags=["Cities"])

@router.get("/rankings")
def city_rankings():
    return get_city_rankings()

@router.get("/hotspots")
def pollution_hotspots():
    from services.simulation import get_pollution_hotspots
    return get_pollution_hotspots()

@router.get("/sustainability-tips")
def sustainability_tips():
    return [
        {"id": 1, "category": "Trees", "icon": "🌳", "title": "Tree Plantation Drive",
         "description": "Plant native tree species in your locality. One tree absorbs ~22kg CO₂ per year.",
         "impact": "High", "effort": "Medium", "co2_offset_kg": 22},
        {"id": 2, "category": "Water", "icon": "💧", "title": "Rainwater Harvesting",
         "description": "Install rainwater harvesting systems to reduce dependence on groundwater.",
         "impact": "High", "effort": "High", "water_save_liters": 50000},
        {"id": 3, "category": "Plastic", "icon": "♻️", "title": "Plastic-Free Living",
         "description": "Switch to cloth bags, metal bottles, and biodegradable packaging.",
         "impact": "Medium", "effort": "Low", "plastic_reduce_kg": 12},
        {"id": 4, "category": "Energy", "icon": "☀️", "title": "Rooftop Solar Panels",
         "description": "Install solar panels to generate clean energy and reduce electricity bills.",
         "impact": "Very High", "effort": "High", "co2_offset_kg": 900},
        {"id": 5, "category": "Transport", "icon": "🚲", "title": "Cycle or Walk Short Distances",
         "description": "Use bicycle or walk for trips under 5km. Saves fuel and reduces emissions.",
         "impact": "Medium", "effort": "Low", "co2_offset_kg": 150},
        {"id": 6, "category": "Food", "icon": "🥗", "title": "Reduce Meat Consumption",
         "description": "Livestock contributes 14.5% of global emissions. Shift to plant-based diet.",
         "impact": "High", "effort": "Low", "co2_offset_kg": 500},
        {"id": 7, "category": "Energy", "icon": "💡", "title": "LED Lighting Upgrade",
         "description": "Replace all incandescent bulbs with LEDs. Uses 75% less energy.",
         "impact": "Medium", "effort": "Low", "co2_offset_kg": 60},
        {"id": 8, "category": "Community", "icon": "🤝", "title": "Community Clean-up Drives",
         "description": "Organize monthly neighborhood cleanup events to reduce solid waste.",
         "impact": "High", "effort": "Medium", "plastic_reduce_kg": 200},
    ]
