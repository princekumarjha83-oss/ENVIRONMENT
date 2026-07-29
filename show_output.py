import urllib.request, json

def get(path):
    r = urllib.request.urlopen('http://localhost:8000' + path, timeout=5)
    return json.loads(r.read())

print("=" * 52)
print("  ECOWATCH AI - LIVE SYSTEM OUTPUT REPORT")
print("=" * 52)

# Dashboard metrics
d = get('/api/dashboard/metrics?city=Delhi')
print("\n[MODULE 2] DELHI LIVE DASHBOARD METRICS")
print("-" * 40)
print(f"  AQI             : {d['aqi']} ({d['aqi_category']['label']})")
print(f"  Temperature     : {d['temperature']} C")
print(f"  Humidity        : {d['humidity']} %")
print(f"  Wind Speed      : {d['wind_speed']} km/h")
print(f"  Rainfall        : {d['rainfall']} mm")
print(f"  UV Index        : {d['uv_index']}")
print(f"  PM2.5           : {d['pm25']} ug/m3")
print(f"  PM10            : {d['pm10']} ug/m3")
print(f"  CO2             : {d['co2']} ppm")
print(f"  Health Score    : {d['health_score']}/100")
print(f"  Green Cover     : {d['green_cover']}%")
print(f"  Water Quality   : {d['water_quality']}%")

# Global stats
g = get('/api/dashboard/global-stats')
print("\n[PLATFORM] GLOBAL STATISTICS")
print("-" * 40)
for k, v in g.items():
    print(f"  {k.replace('_',' ').title():28}: {v:,}" if isinstance(v, int) else f"  {k.replace('_',' ').title():28}: {v}")

# City rankings
cities = get('/api/cities/rankings')
print("\n[MODULE 11] TOP 5 GREEN CITY RANKINGS")
print("-" * 40)
medals = ["GOLD", "SILVER", "BRONZE", "4th", "5th"]
for i, c in enumerate(cities[:5]):
    print(f"  {medals[i]:8} | {c['name']:12} | AQI={c['aqi']:3} | Green={c['green_cover']:5}% | Score={c['sustainability_score']}")

# Predictions
p = get('/api/predictions/forecast?city=Mumbai')
print(f"\n[MODULE 6] MUMBAI 7-DAY AI FORECAST ({p['model_used']} | Acc: {p['accuracy']})")
print("-" * 40)
for day in p['predictions']:
    bar = "#" * (day['aqi'] // 30)
    print(f"  {day['day']:12} | AQI={day['aqi']:3} | {day['temperature']}C | Rain={day['rainfall']}mm | {day['risk_level']:8}")

# Alerts
alerts = get('/api/alerts/')
print(f"\n[MODULE 10] ACTIVE ALERTS ({len(alerts)} total)")
print("-" * 40)
for a in alerts[:5]:
    print(f"  [{a['severity'].upper():8}] {a['type']:15} - {a['city']:12} | {a['message'][:50]}...")

# News
news = get('/api/news/')
print(f"\n[MODULE 17] ENVIRONMENTAL NEWS ({len(news)} articles)")
print("-" * 40)
for n in news[:4]:
    print(f"  [{n['category']:18}] {n['title'][:50]}...")

# Carbon calculation
import urllib.request
req = urllib.request.Request(
    'http://localhost:8000/api/carbon/calculate',
    data=json.dumps({"electricity_kwh":250,"vehicle_km":600,"flights_hours":2,"lpg_kg":12,"fuel_liters":40}).encode(),
    headers={'Content-Type':'application/json'},
    method='POST'
)
c = json.loads(urllib.request.urlopen(req, timeout=5).read())
print(f"\n[MODULE 13] CARBON FOOTPRINT SAMPLE CALCULATION")
print("-" * 40)
print(f"  Monthly CO2     : {c['monthly_kg_co2']} kg")
print(f"  Annual CO2      : {c['annual_kg_co2']} kg")
print(f"  Category        : {c['category']}")
print(f"  vs India Avg    : {c['vs_average']}%")
print(f"  Trees to Offset : {c['trees_to_offset']}")
print(f"  Suggestions     : {len(c['suggestions'])} AI tips")

print("\n" + "=" * 52)
print("  ALL SYSTEMS OPERATIONAL - ECOWATCH AI LIVE")
print("  Frontend : http://localhost:5173")
print("  Backend  : http://localhost:8000")
print("  API Docs : http://localhost:8000/api/docs")
print("=" * 52)
