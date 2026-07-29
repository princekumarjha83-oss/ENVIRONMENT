from fastapi import APIRouter
from services.simulation import ENV_NEWS

router = APIRouter(prefix="/api/news", tags=["News"])

@router.get("/")
def get_news():
    return ENV_NEWS

@router.get("/categories")
def get_categories():
    return list(set(n["category"] for n in ENV_NEWS))
