from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from ml_model import predict_alerts

router = APIRouter(prefix="/alerts", tags=["Predictive Alerts"])

@router.get("/predictive")
def get_predictive_alerts(db: Session = Depends(get_db)):
    stations = db.query(models.Station).all()
    alerts = [predict_alerts(station) for station in stations]
    return [dict(alert) for alert in alerts]
