from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.alert import Alert
from app.schemas.alert_schema import AlertCreate, AlertResponse

router = APIRouter(prefix="/alerts", tags=["Alerts & Notifications"])

# ======================================================
# GET ALL ALERTS (Frontend depends on this)
# ======================================================
@router.get("/", response_model=list[AlertResponse])
def read_alerts(db: Session = Depends(get_db)):
    try:
        alerts = (
            db.query(Alert)
            .order_by(Alert.created_at.desc())
            .all()
        )
        return alerts
    except Exception as e:
        print("❌ ERROR in GET /alerts:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch alerts")

# ======================================================
# GET SINGLE ALERT (AlertDetails.jsx)
# ======================================================
@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

# ======================================================
# CREATE ALERT (Manual creation)
# ======================================================
@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    severity = "CRITICAL" if alert.type.lower() == "boil_notice" else "WARNING"

    new_alert = Alert(
        message=alert.message,
        severity=severity,
        type=alert.type,
        category="current",
        acknowledged=False,
        action_taken="Pending investigation",
        location=alert.location,
        station_id=alert.station_id,
        station_name=f"Station {alert.station_id}" if alert.station_id else None,
        latitude="13.0827",
        longitude="80.2707"
    )

    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

# ======================================================
# ACKNOWLEDGE ALERT (Frontend button)
# ======================================================
@router.post("/{alert_id}/acknowledge", response_model=AlertResponse)
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledged = True
    alert.action_taken = "Acknowledged by authority"
    db.commit()
    db.refresh(alert)
    return alert

# ======================================================
# DELETE ALERT
# ======================================================
@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        db.delete(alert)
        db.commit()
    return None

# ======================================================
# GENERATE REAL ALERTS (Button in frontend)
# ======================================================
@router.get("/generate-real-alerts")
def generate_real_alerts(db: Session = Depends(get_db)):
    sample_alert = Alert(
        message="High turbidity detected in water source",
        severity="CRITICAL",
        type="sensor_anomaly",
        category="current",
        location="Chennai - T Nagar",
        station_id=101,
        station_name="Station 101",
        latitude="13.0827",
        longitude="80.2707",
        action_taken="Auto-detected by AI system",
        acknowledged=False
    )

    db.add(sample_alert)
    db.commit()

    return {"message": "1 real alert generated successfully"}
