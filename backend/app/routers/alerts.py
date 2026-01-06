from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.alert import Alert
from app.schemas.alert_schema import AlertCreate, AlertResponse

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts & Notifications"]
)

# 🟢 CREATE: Create a new Public Safety Alert
@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    """
    Issue a new alert.
    Type must be one of: 'boil_notice', 'contamination', 'outage'.
    """
    new_alert = Alert(
        type=alert.type,
        message=alert.message,
        location=alert.location
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

# 🔵 READ: Get All Alerts
@router.get("/", response_model=List[AlertResponse])
def read_alerts(
    limit: int = 50, 
    location: Optional[str] = Query(None, description="Filter by city/location"),
    db: Session = Depends(get_db)
):
    """
    Get a list of active alerts.
    - Optional: Filter by location (e.g., ?location=Chennai)
    - Returns newest first.
    """
    query = db.query(Alert)

    # Optional Filter logic
    if location:
        query = query.filter(Alert.location.ilike(f"%{location}%"))

    # Sort by newest time (descending)
    return query.order_by(Alert.issued_at.desc()).limit(limit).all()

# 🔴 DELETE: Resolve/Remove an Alert
@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    """
    Delete an alert by ID (mark as resolved).
    """
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    db.delete(alert)
    db.commit()
    return None