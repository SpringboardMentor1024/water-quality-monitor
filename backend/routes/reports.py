from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from database import get_db
import models

router = APIRouter(prefix="/readings", tags=["Station Readings"])


# ----------------------------
# ADD NEW READING
# ----------------------------
@router.post("/")
def add_reading(data: dict, db: Session = Depends(get_db)):
    reading = models.StationReadings(**data)
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


# ----------------------------
# ✅ ANALYTICS (MUST BE ABOVE /{station_id})
# ----------------------------
@router.get("/analytics")
def get_analytics(
    parameter: str,
    range: str = "daily",
    db: Session = Depends(get_db)
):
    try:
        param_enum = models.ParameterEnum(parameter)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid parameter")

    query = db.query(
        func.avg(models.StationReadings.value).label("value")
    )

    if range == "daily":
        query = query.add_columns(
            func.date(models.StationReadings.recorded_at).label("time")
        ).group_by(func.date(models.StationReadings.recorded_at))

    elif range == "monthly":
        query = query.add_columns(
            extract("month", models.StationReadings.recorded_at).label("time")
        ).group_by(extract("month", models.StationReadings.recorded_at))

    elif range == "yearly":
        query = query.add_columns(
            extract("year", models.StationReadings.recorded_at).label("time")
        ).group_by(extract("year", models.StationReadings.recorded_at))
    else:
        raise HTTPException(status_code=400, detail="Invalid range")

    results = (
        query.filter(models.StationReadings.parameter == param_enum)
        .order_by("time")
        .all()
    )

    return [{"time": str(r.time), "value": float(r.value)} for r in results]


# ----------------------------
# GET READINGS BY STATION
# ----------------------------
@router.get("/{station_id}")
def get_station_readings(station_id: int, db: Session = Depends(get_db)):
    readings = db.query(models.StationReadings).filter(
        models.StationReadings.station_id == station_id
    ).all()

    return [
        {
            "id": r.id,
            "parameter": r.parameter.value,
            "value": float(r.value),
            "recorded_at": r.recorded_at,
        }
        for r in readings
    ]
