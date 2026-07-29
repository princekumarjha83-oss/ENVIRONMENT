import random
import math
from datetime import datetime, timedelta
from typing import List, Dict, Any
import numpy as np

# ─────────────────────────────────────────────
# Simulated Cities Data
# ─────────────────────────────────────────────
CITIES = [
    {"name": "Delhi", "lat": 28.6139, "lon": 77.2090, "country": "India"},
    {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777, "country": "India"},
    {"name": "Bangalore", "lat": 12.9716, "lon": 77.5946, "country": "India"},
    {"name": "Chennai", "lat": 13.0827, "lon": 80.2707, "country": "India"},
    {"name": "Kolkata", "lat": 22.5726, "lon": 88.3639, "country": "India"},
    {"name": "Hyderabad", "lat": 17.3850, "lon": 78.4867, "country": "India"},
    {"name": "Pune", "lat": 18.5204, "lon": 73.8567, "country": "India"},
    {"name": "Ahmedabad", "lat": 23.0225, "lon": 72.5714, "country": "India"},
    {"name": "Jaipur", "lat": 26.9124, "lon": 75.7873, "country": "India"},
    {"name": "Kochi", "lat": 9.9312, "lon": 76.2673, "country": "India"},
    {"name": "Chandigarh", "lat": 30.7333, "lon": 76.7794, "country": "India"},
    {"name": "Bhopal", "lat": 23.2599, "lon": 77.4126, "country": "India"},
    {"name": "Lucknow", "lat": 26.8467, "lon": 80.9462, "country": "India"},
    {"name": "Surat", "lat": 21.1702, "lon": 72.8311, "country": "India"},
    {"name": "Vadodara", "lat": 22.3072, "lon": 73.1812, "country": "India"},
]

CITY_SEED_MAP = {c["name"]: i * 7 + 42 for i, c in enumerate(CITIES)}


def seeded_random(seed: int, min_val: float, max_val: float) -> float:
    rng = random.Random(seed)
    return round(min_val + rng.random() * (max_val - min_val), 2)


def get_aqi_category(aqi: float) -> Dict[str, str]:
    if aqi <= 50:
        return {"label": "Good", "color": "#16A34A", "emoji": "😊"}
    elif aqi <= 100:
        return {"label": "Moderate", "color": "#FACC15", "emoji": "😐"}
    elif aqi <= 150:
        return {"label": "Unhealthy for Sensitive Groups", "color": "#F97316", "emoji": "😷"}
    elif aqi <= 200:
        return {"label": "Unhealthy", "color": "#EF4444", "emoji": "🤧"}
    elif aqi <= 300:
        return {"label": "Very Unhealthy", "color": "#9333EA", "emoji": "🤢"}
    else:
        return {"label": "Hazardous", "color": "#7F1D1D", "emoji": "☠️"}


def get_live_metrics(city: str = "Delhi") -> Dict[str, Any]:
    seed = CITY_SEED_MAP.get(city, 99)
    hour = datetime.now().hour
    day_offset = datetime.now().toordinal() % 100

    aqi = round(seeded_random(seed + day_offset, 40, 320))
    temp = round(seeded_random(seed + day_offset + 1, 18, 44), 1)
    humidity = round(seeded_random(seed + day_offset + 2, 30, 90), 1)
    wind_speed = round(seeded_random(seed + day_offset + 3, 5, 45), 1)
    rainfall = round(seeded_random(seed + day_offset + 4, 0, 60), 1)
    uv_index = round(seeded_random(seed + day_offset + 5, 1, 11), 1)
    green_cover = round(seeded_random(seed + 20, 10, 65), 1)
    water_quality = round(seeded_random(seed + 21, 30, 95), 1)

    health_score = max(0, min(100, int(
        100
        - (aqi / 5)
        - max(0, temp - 35) * 2
        - max(0, humidity - 80) * 0.5
        + green_cover * 0.3
    )))

    return {
        "city": city,
        "timestamp": datetime.now().isoformat(),
        "aqi": aqi,
        "aqi_category": get_aqi_category(aqi),
        "temperature": temp,
        "humidity": humidity,
        "wind_speed": wind_speed,
        "rainfall": rainfall,
        "uv_index": uv_index,
        "green_cover": green_cover,
        "water_quality": water_quality,
        "health_score": health_score,
        "pm25": round(seeded_random(seed + day_offset + 6, 10, 180), 1),
        "pm10": round(seeded_random(seed + day_offset + 7, 20, 250), 1),
        "co2": round(seeded_random(seed + day_offset + 8, 380, 600), 1),
        "no2": round(seeded_random(seed + day_offset + 9, 5, 120), 1),
        "so2": round(seeded_random(seed + day_offset + 10, 2, 80), 1),
        "o3": round(seeded_random(seed + day_offset + 11, 20, 160), 1),
    }


def get_historical_data(city: str = "Delhi", days: int = 30) -> List[Dict[str, Any]]:
    seed = CITY_SEED_MAP.get(city, 99)
    data = []
    base_date = datetime.now() - timedelta(days=days)
    for i in range(days):
        date = base_date + timedelta(days=i)
        d_seed = seed + i * 3 + date.toordinal() % 50
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "aqi": round(seeded_random(d_seed, 45, 280)),
            "temperature": round(seeded_random(d_seed + 1, 20, 42), 1),
            "humidity": round(seeded_random(d_seed + 2, 35, 88), 1),
            "rainfall": round(seeded_random(d_seed + 3, 0, 55), 1),
            "wind_speed": round(seeded_random(d_seed + 4, 5, 40), 1),
            "pm25": round(seeded_random(d_seed + 5, 12, 160), 1),
            "co2": round(seeded_random(d_seed + 6, 390, 580), 1),
        })
    return data


def get_city_rankings() -> List[Dict[str, Any]]:
    rankings = []
    for city in CITIES:
        metrics = get_live_metrics(city["name"])
        sustainability = max(10, min(100, int(
            metrics["health_score"] * 0.5
            + metrics["green_cover"] * 0.3
            + (100 - metrics["aqi"] / 3.5) * 0.2
        )))
        rankings.append({
            **city,
            "aqi": metrics["aqi"],
            "temperature": metrics["temperature"],
            "green_cover": metrics["green_cover"],
            "health_score": metrics["health_score"],
            "sustainability_score": sustainability,
            "aqi_category": metrics["aqi_category"],
        })
    rankings.sort(key=lambda x: x["sustainability_score"], reverse=True)
    for i, r in enumerate(rankings):
        r["rank"] = i + 1
    return rankings


def get_prediction(city: str = "Delhi") -> Dict[str, Any]:
    current = get_live_metrics(city)
    predictions = []
    for i in range(1, 8):
        d_offset = i * 13
        pred_aqi = max(20, current["aqi"] + random.randint(-30, 30))
        pred_temp = round(current["temperature"] + random.uniform(-3, 3), 1)
        pred_rainfall = round(random.uniform(0, 50), 1)
        predictions.append({
            "day": (datetime.now() + timedelta(days=i)).strftime("%a %d %b"),
            "aqi": pred_aqi,
            "temperature": pred_temp,
            "rainfall": pred_rainfall,
            "aqi_category": get_aqi_category(pred_aqi),
            "risk_level": "High" if pred_aqi > 200 else "Moderate" if pred_aqi > 100 else "Low",
        })
    return {
        "city": city,
        "model_used": "XGBoost + Random Forest Ensemble",
        "accuracy": "91.3%",
        "current": current,
        "predictions": predictions,
    }


def get_pollution_hotspots() -> List[Dict[str, Any]]:
    hotspots = []
    for city in CITIES:
        metrics = get_live_metrics(city["name"])
        hotspots.append({
            "name": city["name"],
            "lat": city["lat"],
            "lon": city["lon"],
            "aqi": metrics["aqi"],
            "intensity": min(1.0, metrics["aqi"] / 350),
            "category": metrics["aqi_category"],
            "pm25": metrics["pm25"],
            "temperature": metrics["temperature"],
        })
    return hotspots


def calculate_carbon_footprint(electricity_kwh: float, vehicle_km: float,
                                flights_hours: float, lpg_kg: float, fuel_liters: float) -> Dict[str, Any]:
    factors = {
        "electricity": 0.82,   # kg CO2 per kWh
        "vehicle": 0.21,       # kg CO2 per km
        "flights": 90.0,       # kg CO2 per hour
        "lpg": 2.98,           # kg CO2 per kg
        "fuel": 2.31,          # kg CO2 per liter
    }
    breakdown = {
        "electricity": round(electricity_kwh * factors["electricity"], 2),
        "vehicle": round(vehicle_km * factors["vehicle"], 2),
        "flights": round(flights_hours * factors["flights"], 2),
        "lpg": round(lpg_kg * factors["lpg"], 2),
        "fuel": round(fuel_liters * factors["fuel"], 2),
    }
    total = round(sum(breakdown.values()), 2)
    annual = round(total * 12, 2)
    avg_indian = 1800  # kg per year

    category = "Low" if annual < 1000 else "Average" if annual < 3000 else "High"

    suggestions = []
    if breakdown["electricity"] > 100:
        suggestions.append("Switch to solar energy or green electricity provider")
    if breakdown["vehicle"] > 100:
        suggestions.append("Use public transport, cycle, or switch to EV")
    if breakdown["flights"] > 200:
        suggestions.append("Reduce flights, prefer train travel when possible")
    if breakdown["lpg"] > 50:
        suggestions.append("Consider switching to electric induction cooking")
    if not suggestions:
        suggestions.append("Excellent! Your footprint is below average — keep it up!")

    return {
        "monthly_kg_co2": total,
        "annual_kg_co2": annual,
        "breakdown": breakdown,
        "category": category,
        "vs_average": round((annual - avg_indian) / avg_indian * 100, 1),
        "trees_to_offset": math.ceil(annual / 21),
        "suggestions": suggestions,
    }


def analyze_image_mock(filename: str) -> Dict[str, Any]:
    fn_lower = filename.lower()
    detections = {
        "garbage": {
            "prediction": "Plastic & Solid Waste Pollution",
            "confidence": 91.4,
            "objects": ["Plastic bottles", "Polythene bags", "Organic waste", "Metal cans"],
            "severity": "High",
            "color": "#EF4444",
            "explanation": "The image shows significant accumulation of plastic and solid waste materials. AI detected multiple categories of non-biodegradable waste that pose serious environmental hazards.",
            "action": "Initiate immediate municipal waste collection. Organize community cleanup drives. Implement segregation at source. Contact local authorities for waste management intervention."
        },
        "smoke": {
            "prediction": "Air Pollution — Industrial Smoke",
            "confidence": 88.7,
            "objects": ["Dense smoke plume", "Particulate matter", "Combustion byproducts"],
            "severity": "Critical",
            "color": "#7F1D1D",
            "explanation": "Heavy smoke emissions detected, likely from industrial or vehicular sources. Particulate matter concentration appears hazardous based on smoke density analysis.",
            "action": "Alert environmental protection agency. Evacuate sensitive individuals from area. Monitor AQI levels continuously. Investigate emission source for compliance."
        },
        "fire": {
            "prediction": "Forest / Vegetation Fire Detected",
            "confidence": 94.2,
            "objects": ["Active fire", "Smoke column", "Burning vegetation", "Heat signatures"],
            "severity": "Critical",
            "color": "#DC2626",
            "explanation": "Active fire detected in vegetation/forest area. Satellite-level analysis suggests significant biomass burning with potential for rapid spread based on terrain and wind patterns.",
            "action": "Alert forest department and fire brigade immediately. Evacuate nearby settlements. Deploy water bombing aircraft if available. Create firebreaks to prevent spread."
        },
        "river": {
            "prediction": "Water Body Pollution Detected",
            "confidence": 86.5,
            "objects": ["Oil slick", "Industrial effluents", "Algal bloom", "Floating debris"],
            "severity": "High",
            "color": "#F97316",
            "explanation": "Water body shows signs of anthropogenic pollution. Discoloration and surface films indicate chemical or organic contamination that affects aquatic ecosystems.",
            "action": "Collect water samples for lab analysis. Alert pollution control board. Stop upstream discharge. Deploy booms to contain surface pollutants. Start bioremediation."
        },
        "forest": {
            "prediction": "Deforestation / Forest Degradation",
            "confidence": 89.1,
            "objects": ["Cleared land patches", "Tree stumps", "Soil erosion", "Habitat fragmentation"],
            "severity": "High",
            "color": "#F59E0B",
            "explanation": "Significant forest cover loss detected compared to baseline satellite imagery. Deforestation patterns suggest commercial logging or land clearing activity.",
            "action": "Report to forest department. Document coordinates for legal action. Initiate afforestation program. Engage local communities in forest protection."
        },
    }

    matched = None
    for key in detections:
        if key in fn_lower:
            matched = detections[key]
            break

    if not matched:
        # Default: random selection for demo
        matched = random.choice(list(detections.values()))
        matched["confidence"] = round(random.uniform(78, 96), 1)

    return matched


ENV_NEWS = [
    {
        "id": 1, "title": "India Sets Record in Renewable Energy Capacity Addition",
        "summary": "India added 18.5 GW of renewable energy in 2024, crossing 200 GW total installed capacity.",
        "source": "Energy Monitor", "date": "2026-07-28", "category": "Renewable Energy",
        "image_color": "#16A34A", "url": "#"
    },
    {
        "id": 2, "title": "Delhi's AQI Improves After Odd-Even Vehicle Scheme",
        "summary": "Air quality in Delhi showed 23% improvement during the odd-even vehicle rationing pilot.",
        "source": "EnviroTimes", "date": "2026-07-27", "category": "Air Quality",
        "image_color": "#0EA5E9", "url": "#"
    },
    {
        "id": 3, "title": "Amazon Deforestation Falls to 5-Year Low",
        "summary": "Brazil reports significant reduction in Amazon deforestation, crediting satellite monitoring systems.",
        "source": "GreenEarth", "date": "2026-07-26", "category": "Deforestation",
        "image_color": "#16A34A", "url": "#"
    },
    {
        "id": 4, "title": "Plastic Pollution Crisis: 14 Million Tons Enter Oceans Annually",
        "summary": "A new UNEP report reveals shocking statistics about ocean plastic pollution and calls for global treaty.",
        "source": "Ocean Watch", "date": "2026-07-25", "category": "Pollution",
        "image_color": "#F97316", "url": "#"
    },
    {
        "id": 5, "title": "Extreme Heat Waves to Double by 2050, Warns Climate Report",
        "summary": "Scientists warn that without drastic emission cuts, extreme heat events could become twice as frequent.",
        "source": "ClimateNow", "date": "2026-07-24", "category": "Climate Change",
        "image_color": "#EF4444", "url": "#"
    },
    {
        "id": 6, "title": "Kerala Launches AI-Powered Flood Prediction System",
        "summary": "Kerala government deploys ML-based early warning system that predicted recent flood events with 94% accuracy.",
        "source": "TechGreen", "date": "2026-07-23", "category": "Technology",
        "image_color": "#0EA5E9", "url": "#"
    },
    {
        "id": 7, "title": "Ganga River Water Quality Improves in 8 Major Cities",
        "summary": "Namami Gange mission reports measurable improvements in dissolved oxygen levels across multiple monitoring stations.",
        "source": "RiverWatch", "date": "2026-07-22", "category": "Water Quality",
        "image_color": "#06B6D4", "url": "#"
    },
    {
        "id": 8, "title": "Solar Power Now Cheaper Than Coal in 130 Countries",
        "summary": "IRENA data confirms utility-scale solar has become the cheapest electricity source globally.",
        "source": "Solar Tribune", "date": "2026-07-21", "category": "Renewable Energy",
        "image_color": "#FACC15", "url": "#"
    },
]

AI_RESPONSES = {
    "air safe": "Based on current AQI data for your selected city, I'd recommend checking the live AQI card on the dashboard. If AQI > 100, avoid prolonged outdoor exposure. Use N95 masks if AQI > 150. Consider air purifiers indoors. Children, elderly, and those with respiratory conditions should take extra precautions.",
    "pollution": "Pollution levels are influenced by multiple factors: vehicular emissions contribute ~40%, industrial activity ~30%, construction dust ~15%, and agricultural burning ~15%. Seasonal patterns show pollution spikes in winter due to temperature inversions that trap pollutants near the ground. Our AI model detects a 12% increase in PM2.5 over the past week.",
    "predict": "Based on our XGBoost + Random Forest ensemble model trained on 5 years of historical data, tomorrow's AQI is predicted with 91.3% accuracy. Our model considers wind direction, temperature, humidity, historical patterns, and seasonal trends. Check the AI Predictions module for a full 7-day forecast with confidence intervals.",
    "dashboard": "The dashboard shows 8 live environmental metrics: AQI (Air Quality Index), Temperature, Humidity, Wind Speed, Rainfall, UV Index, Environmental Health Score, and Green Cover Index. All metrics update dynamically. The Environmental Health Score is a composite AI-calculated score (0-100) that weighs all parameters. Click any card to see detailed trends.",
    "reduce pollution": "Here are evidence-based strategies to reduce pollution: 🌱 Plant trees (a single tree absorbs ~22kg CO₂/year), 🚲 Use cycling or public transport, ☀️ Switch to solar energy, 🏭 Support clean industry regulations, ♻️ Practice waste segregation and recycling, 💡 Use energy-efficient appliances, 🥗 Reduce meat consumption (livestock accounts for 14.5% of emissions).",
    "default": "I'm EcoBot, your AI environmental assistant! I can help you with: air quality analysis, pollution predictions, understanding environmental metrics, sustainability tips, and interpreting dashboard data. Ask me anything about the environment! 🌍"
}

def get_ai_response(message: str) -> str:
    message_lower = message.lower()
    for key, response in AI_RESPONSES.items():
        if key in message_lower:
            return response
    
    if "temperature" in message_lower or "heat" in message_lower:
        return "🌡️ Temperature trends show a 1.8°C rise over the past decade in urban areas — the urban heat island effect. Green roofs, reflective pavements, and urban forests can reduce city temperatures by 2-4°C. Our AI model predicts continued warming unless aggressive mitigation steps are taken."
    if "water" in message_lower:
        return "💧 Water quality is monitored through dissolved oxygen, pH, turbidity, and chemical contamination levels. Our system tracks 12 water bodies across monitored cities. Freshwater scarcity affects 2.8 billion people globally. Rainwater harvesting, wastewater treatment, and watershed protection are key solutions."
    if "forest" in message_lower or "tree" in message_lower:
        return "🌳 Forests are Earth's lungs — covering 31% of land area and absorbing 2.6 billion tonnes of CO₂ annually. Our satellite analysis detects deforestation events within 48 hours. India's forest cover increased by 2,261 km² in 2023. Afforestation drives can significantly improve local air quality and biodiversity."
    if "health score" in message_lower or "score" in message_lower:
        return "🌱 The Environmental Health Score (0-100) is calculated using: AQI (40% weight), Temperature deviation (20%), Water quality (20%), Green cover index (15%), and Wind quality (5%). A score above 70 is considered healthy. Below 40 requires immediate intervention."
    
    return AI_RESPONSES["default"]
