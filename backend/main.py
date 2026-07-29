import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import init_db
from routers import dashboard, ai_copilot, image_analysis, predictions, cities, carbon, news, users, alerts, reports

app = FastAPI(
    title="EcoWatch AI — Environmental Monitoring API",
    description="AI-Powered Environmental Monitoring System for Sustainable Ecosystem Management",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "https://environment-ruby.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    print("EcoWatch AI Backend started successfully!")

# Mount routers
app.include_router(dashboard.router)
app.include_router(ai_copilot.router)
app.include_router(image_analysis.router)
app.include_router(predictions.router)
app.include_router(cities.router)
app.include_router(carbon.router)
app.include_router(news.router)
app.include_router(users.router)
app.include_router(alerts.router)
app.include_router(reports.router)

# Mount uploads directory
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

@app.get("/")
def root():
    return {
        "message": "🌍 EcoWatch AI Environmental Monitoring API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "status": "running"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "EcoWatch AI"}
