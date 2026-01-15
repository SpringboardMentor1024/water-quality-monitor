from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
<<<<<<< HEAD

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
=======
from app.models import Alert, WaterStation
from app.core.database import get_db
from app.schemas.alert_schema import AlertCreate, AlertResponse
import random
from datetime import datetime, timedelta

router = APIRouter(prefix="/alerts", tags=["Alerts & Notifications"])

# ✅ REAL WATER QUALITY THRESHOLDS (Indian Standards)
WATER_QUALITY_RULES = {
    "pH": {"normal": (6.5, 8.5), "warning": (8.5, 9.0), "critical": (0, 6.5), "unit": "pH"},
    "Turbidity": {"normal": (0, 5), "warning": (5, 10), "critical": (10, 100), "unit": "NTU"},
    "Oxygen": {"normal": (4.0, 8.0), "warning": (3.0, 4.0), "critical": (0, 3.0), "unit": "mg/L"},
    "Temperature": {"normal": (15, 25), "warning": (25, 35), "critical": (0, 15), "unit": "°C"},
    "Conductivity": {"normal": (0, 1000), "warning": (1000, 2000), "critical": (2000, 5000), "unit": "µS/cm"}
}

@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    new_alert = Alert(
        message=alert.message,
        severity=alert.type.upper(),
        station_id=alert.station_id
>>>>>>> 69213e5bcaa462445faf874fdc22dea33238c46e
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

<<<<<<< HEAD
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
=======
@router.get("/generate-real-alerts", status_code=status.HTTP_200_OK)
def generate_real_alerts(db: Session = Depends(get_db)):
    """Generate 50-100 realistic alerts for all 289 stations"""
    stations = db.query(WaterStation).all()
    recent_hours = 72  # Last 3 days
    
    # Clear old test alerts (keep only recent ones)
    db.query(Alert).filter(Alert.created_at < datetime.now() - timedelta(hours=recent_hours)).delete()
    db.commit()
    
    alerts_created = 0
    for station in stations:
        # 1-3 alerts per station (only 20% of stations get alerts)
        if random.random() < 0.2:  # 20% stations have issues
            num_alerts = random.randint(1, 3)
            for _ in range(num_alerts):
                param = random.choice(list(WATER_QUALITY_RULES.keys()))
                rules = WATER_QUALITY_RULES[param]
                
                # Generate realistic abnormal value
                if random.random() < 0.3:  # 30% critical
                    value = random.uniform(*rules["critical"])
                    severity = "CRITICAL"
                else:  # 70% warning
                    value = random.uniform(*rules["warning"])
                    severity = "WARNING"
                
                message = f"{param} {value:.2f} {rules['unit']} exceeds normal limits ({rules['normal'][0]:.1f}-{rules['normal'][1]:.1f})"
                
                alert = Alert(
                    message=message,
                    severity=severity,
                    station_id=station.id,
                    acknowledged=random.choice([False, False, True])  # 33% acknowledged
                )
                db.add(alert)
                alerts_created += 1
    
    db.commit()
    return {"message": f"✅ Generated {alerts_created} real alerts across {len(stations)} stations"}

@router.get("/", response_model=List[AlertResponse])
def read_alerts(
    db: Session = Depends(get_db),
    limit: int = 50,
    severity: str = None,
    station_id: int = None,
    acknowledged: bool = None
):
    query = db.query(Alert).order_by(Alert.created_at.desc())
    
    if severity:
        query = query.filter(Alert.severity == severity.upper())
    if station_id:
        query = query.filter(Alert.station_id == station_id)
    if acknowledged is not None:
        query = query.filter(Alert.acknowledged == acknowledged)
    
    alerts = query.limit(limit).all()
    return alerts

@router.get("/{alert_id}", response_model=AlertResponse)
def read_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert ID {alert_id} not found")
    
    # ✅ REAL STATION DATA FROM YOUR 289 STATIONS
    station_name = f"Station {alert.station_id}" if alert.station_id else "Unknown Station"
    location = "Bengaluru, Karnataka"
    latitude = None
    longitude = None
    
    if alert.station_id:
        station = db.query(WaterStation).filter(WaterStation.id == alert.station_id).first()
        if station:
            station_name = station.name or f"Station {station.id}"
            location = station.location or "Bengaluru, Karnataka"
            latitude = station.latitude
            longitude = station.longitude
    
    return AlertResponse(
        id=alert.id,
        message=alert.message,
        severity=alert.severity,
        acknowledged=alert.acknowledged,
        created_at=alert.created_at,
        station_name=station_name,
        location=location,
        latitude=latitude,
        longitude=longitude
    )

@router.post("/{alert_id}/acknowledge", status_code=status.HTTP_200_OK)
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.acknowledged = True
    db.commit()
    db.refresh(alert)
    return {"message": "Alert acknowledged successfully", "alert_id": alert_id}

@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    db.delete(alert)
    db.commit()
    return None

@router.get("/stats")
def get_alert_stats(db: Session = Depends(get_db)):
    """Dashboard stats: Total alerts by severity"""
    total = db.query(Alert).count()
    critical = db.query(Alert).filter(Alert.severity == "CRITICAL").count()
    warning = db.query(Alert).filter(Alert.severity == "WARNING").count()
    acknowledged = db.query(Alert).filter(Alert.acknowledged == True).count()
    
    return {
        "total_alerts": total,
        "critical": critical,
        "warning": warning,
        "acknowledged": acknowledged,
        "active": total - acknowledged
    }
>>>>>>> 69213e5bcaa462445faf874fdc22dea33238c46e
