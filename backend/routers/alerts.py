from fastapi import APIRouter
from database import get_db

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("/")
def get_alerts():
    db = get_db()
    alerts = db.execute("SELECT * FROM alerts WHERE is_active=1 ORDER BY created_at DESC").fetchall()
    db.close()
    return [dict(a) for a in alerts]

@router.post("/{alert_id}/dismiss")
def dismiss_alert(alert_id: int):
    db = get_db()
    db.execute("UPDATE alerts SET is_active=0 WHERE id=?", (alert_id,))
    db.commit()
    db.close()
    return {"status": "dismissed"}
