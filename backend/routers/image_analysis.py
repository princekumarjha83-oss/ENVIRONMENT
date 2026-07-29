import os, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.simulation import analyze_image_mock

router = APIRouter(prefix="/api/image", tags=["Image Analysis"])
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    allowed = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(400, "Only image files are supported")
    
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(UPLOAD_DIR, file.filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    result = analyze_image_mock(file.filename)
    return {
        "filename": file.filename,
        "file_size_kb": round(os.path.getsize(filepath) / 1024, 1),
        **result,
    }

@router.get("/categories")
def get_categories():
    return [
        {"name": "Garbage / Waste", "icon": "🗑️", "examples": "garbage, plastic, waste"},
        {"name": "Smoke / Air Pollution", "icon": "💨", "examples": "smoke, smog, haze"},
        {"name": "Forest Fire", "icon": "🔥", "examples": "fire, wildfire, burning"},
        {"name": "River / Water Pollution", "icon": "🌊", "examples": "river, lake, water"},
        {"name": "Deforestation", "icon": "🌳", "examples": "forest, trees, logging"},
    ]
