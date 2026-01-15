from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
# Ensure this matches your filename (alerts.py vs alert.py)
from app.models.alert import Alert, AlertCategory  
from app.schemas.alert_schema import AlertCreate, AlertResponse
from app.services.prediction_service import PredictionService 

router = APIRouter(prefix="/alerts", tags=["Alerts & Notifications"])

# ✅ REAL WATER QUALITY THRESHOLDS (Indian Standards)
WATER_QUALITY_RULES = {
    "pH": {"normal": (6.5, 8.5), "warning": (8.5, 9.0), "critical": (0, 6.5), "unit": "pH"},
    "Turbidity": {"normal": (0, 5), "warning": (5, 10), "critical": (10, 100), "unit": "NTU"},
    "Oxygen": {"normal": (4.0, 8.0), "warning": (3.0, 4.0), "critical": (0, 3.0), "unit": "mg/L"},
    "Temperature": {"normal": (15, 25), "warning": (25, 35), "critical": (0, 15), "unit": "°C"},
    "Conductivity": {"normal": (0, 1000), "warning": (1000, 2000), "critical": (2000, 5000), "unit": "µS/cm"}
}

# ==========================================
# 🟢 1. AUTOMATIC / PREDICTIVE (AI Trigger)
# ==========================================
@router.post("/analyze/{station_id}")
def analyze_station_risks(station_id: int, db: Session = Depends(get_db)):
    """
    Triggers the AI engine to check for sensor anomalies or trends.
    Useful for 'System Checks' or 'Predictive Maintenance'.
    """
    alerts = PredictionService.analyze_station(db, station_id)
    
    if not alerts:
        return {
            "status": "Safe", 
            "message": "No immediate risks or dangerous trends detected."
        }
    
    return {
        "status": "Risks Detected", 
        "count": len(alerts),
        "analysis": [
            {
                "type": a.type,
                "category": a.category,
                "message": a.message, 
                "recommendation": a.action_taken 
            } for a in alerts
        ]
    }

# ==========================================
# 🔵 2. MANUAL CREATION (Admin / NGO)
# ==========================================
@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    """
    Manual Alert Creation for Admins/NGOs.
    Example: Reporting a visible pipe burst or local news warning.
    """
    
    # We map your input to the NEW database columns.
    # Manual alerts are always 'current' (happening now).
    
    new_alert = Alert(
        message=alert.message,
        
        # ✅ YOUR KEY LOGIC PRESERVED
        severity=str(alert.type).upper(), 
        
        # New required fields (we fill these automatically for manual alerts)
        type=alert.type,
        location=alert.location,     # Make sure your Schema sends this!
        category=AlertCategory.current,
        action_taken="Manual Report - Pending Investigation"
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

# ==========================================
# 🟠 3. READ & DELETE (Standard)
# ==========================================
@router.get("/", response_model=List[AlertResponse])
def read_alerts(db: Session = Depends(get_db)):
    # Returns newest alerts first
    return db.query(Alert).order_by(Alert.created_at.desc()).all()

@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        db.delete(alert)
        db.commit()
    return None
