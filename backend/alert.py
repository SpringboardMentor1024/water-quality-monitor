from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api", tags=["Alerts"])

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    stations = db.query(models.Station).all()
    alerts = []

    for s in stations:
        if s.status in ["Warning", "Unsafe"]:
            # Create a readable, detailed description
            description = (
                f"{s.name} water quality is {s.status}. "
                f"Current readings — pH: {s.ph}, "
                f"Turbidity: {s.turbidity} NTU, "
                f"Temperature: {s.temperature}°C."
            )

            alerts.append({
                "id": s.id,
                "title": f"{s.status} Water Quality Detected",
                "station": s.name,
                "priority": "high" if s.status == "Unsafe" else "medium",
                "time": "Just now",
                "description": description,
                "latitude": s.latitude,
                "longitude": s.longitude,
                "details": {
                    "pH": s.ph,
                    "Turbidity": s.turbidity,
                    "Temperature": s.temperature,
                    "Status": s.status,
                },
            })

    return alerts
