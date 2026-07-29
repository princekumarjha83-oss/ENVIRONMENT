from fastapi import APIRouter
from pydantic import BaseModel
from services.simulation import get_ai_response, get_live_metrics
from database import get_db

router = APIRouter(prefix="/api/copilot", tags=["AI Copilot"])

class ChatMessage(BaseModel):
    message: str
    city: str = "Delhi"

@router.post("/chat")
def chat(body: ChatMessage):
    response = get_ai_response(body.message)
    metrics = get_live_metrics(body.city)
    return {
        "response": response,
        "context": {
            "city": body.city,
            "aqi": metrics["aqi"],
            "aqi_label": metrics["aqi_category"]["label"],
            "temperature": metrics["temperature"],
            "health_score": metrics["health_score"],
        }
    }

@router.get("/suggestions")
def get_suggestions():
    return [
        "Is today's air safe to breathe?",
        "Why is pollution increasing?",
        "Predict tomorrow's AQI",
        "Explain the environmental dashboard",
        "How can we reduce air pollution?",
        "What is the Environmental Health Score?",
        "How is water quality measured?",
        "Tell me about deforestation",
    ]
