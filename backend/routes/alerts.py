from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Alerts
from schemas import AlertCreate, AlertOut

router = APIRouter(prefix="/alerts", tags=["Alerts"])

# ------------------------
# CREATE ALERT
# ------------------------
@router.post("/", response_model=AlertOut)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    db_alert = Alerts(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

# ------------------------
# GET ALL ALERTS
# ------------------------
@router.get("/", response_model=list[AlertOut])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alerts).order_by(Alerts.issued_at.desc()).all()

# ------------------------
# GET ALERT BY ID
# ------------------------
@router.get("/{alert_id}", response_model=AlertOut)
def get_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alerts).filter(Alerts.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

# ------------------------
# UPDATE ALERT
# ------------------------
@router.put("/{alert_id}", response_model=AlertOut)
def update_alert(alert_id: int, updated: AlertCreate, db: Session = Depends(get_db)):
    alert = db.query(Alerts).filter(Alerts.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    for key, value in updated.dict().items():
        setattr(alert, key, value)
    db.commit()
    db.refresh(alert)
    return alert

# ------------------------
# DELETE ALERT
# ------------------------
@router.delete("/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alerts).filter(Alerts.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return {"message": f"Alert {alert_id} deleted successfully"}
