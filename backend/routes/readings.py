from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime

from database import get_db
import models

from services.data_fallback_service import fetch_and_store_live_data
from services.usgs_live_service import fetch_live_usgs_data

router = APIRouter(prefix="/readings", tags=["Station Readings"])


# =====================================================
# ADD NEW READING + AUTO ALERT CREATION (DB STATIONS)
# =====================================================
@router.post("/")
def add_reading(data: dict, db: Session = Depends(get_db)):

    try:
        enum_param = models.ParameterEnum(data["parameter"])
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid parameter")

    reading = models.StationReadings(
        station_id=data["station_id"],
        parameter=enum_param,
        value=data["value"],
    )
    db.add(reading)
    db.commit()
    db.refresh(reading)

    # ---------- ALERT LOGIC ----------
    alert_type = None
    alert_message = None

    if enum_param == models.ParameterEnum.pH:
        if reading.value < 6.5 or reading.value > 8.5:
            alert_type = models.AlertTypeEnum.contamination
            alert_message = f"Unsafe pH level detected ({reading.value})"

    elif enum_param == models.ParameterEnum.turbidity:
        if reading.value > 5:
            alert_type = models.AlertTypeEnum.contamination
            alert_message = f"High turbidity detected ({reading.value} NTU)"

    elif enum_param == models.ParameterEnum.DO:
        if reading.value < 5:
            alert_type = models.AlertTypeEnum.contamination
            alert_message = f"Low dissolved oxygen detected ({reading.value} mg/L)"

    elif enum_param == models.ParameterEnum.arsenic:
        if reading.value > 0.01:
            alert_type = models.AlertTypeEnum.contamination
            alert_message = f"Unsafe arsenic level detected ({reading.value})"

    elif enum_param == models.ParameterEnum.iron:
        if reading.value > 0.3:
            alert_type = models.AlertTypeEnum.contamination
            alert_message = f"Unsafe iron level detected ({reading.value})"

    elif enum_param == models.ParameterEnum.ecoli:
        if reading.value > 0:
            alert_type = models.AlertTypeEnum.boil_notice
            alert_message = "E. coli detected. Boil water before use."

    if alert_type:
        station = db.query(models.WaterStation).filter(
            models.WaterStation.id == reading.station_id
        ).first()

        location = station.location if station else f"Station {reading.station_id}"

        active_alert = db.query(models.Alerts).filter(
            models.Alerts.type == alert_type,
            models.Alerts.location == location,
            models.Alerts.status == models.AlertStatusEnum.active
        ).first()

        if not active_alert:
            alert = models.Alerts(
                type=alert_type,
                message=alert_message,
                location=location
            )
            db.add(alert)
            db.commit()

    return {
        "id": reading.id,
        "station_id": reading.station_id,
        "parameter": enum_param.value,
        "value": float(reading.value),
        "recorded_at": reading.recorded_at
    }


# =====================================================
# ✅ LIVE USGS DATA (FETCH + SAVE TO DB)
# MUST BE ABOVE /{station_id}
# =====================================================
@router.get("/usgs/{site_id}/{parameter}")
def get_usgs_live_reading(
    site_id: str,
    parameter: str,
    db: Session = Depends(get_db)
):
    parameter = parameter.lower()

    live = fetch_live_usgs_data(site_id, parameter)

    if not live:
        raise HTTPException(
            status_code=404,
            detail="No USGS live data found"
        )

    # ----------------------------
    # SAVE USGS DATA TO DATABASE
    # ----------------------------

    PARAMETER_ENUM_MAP = {
    "ph": models.ParameterEnum.pH,
    "do": models.ParameterEnum.DO
    # temperature is external → not stored in DB
}


    enum_param = PARAMETER_ENUM_MAP.get(parameter)

    if enum_param:
        reading = models.StationReadings(
            station_id=None,  # USGS is external station
            parameter=enum_param,
            value=live["value"],
            recorded_at=live["recorded_at"]
        )
        db.add(reading)
        db.commit()

    return {
        "source": "USGS (Always Live)",
        "site_id": site_id,
        "parameter": parameter,
        "value": float(live["value"]),
        "recorded_at": live["recorded_at"]
    }


# =====================================================
# ANALYTICS (DB DATA ONLY)
# =====================================================
@router.get("/analytics")
def get_analytics(
    parameter: str,
    range: str = "daily",
    db: Session = Depends(get_db)
):
    try:
        enum_param = models.ParameterEnum(parameter)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid parameter")

    query = db.query(func.avg(models.StationReadings.value).label("value"))

    if range == "daily":
        query = query.add_columns(
            func.date(models.StationReadings.recorded_at).label("time")
        ).group_by(func.date(models.StationReadings.recorded_at))

    elif range == "weekly":
        query = query.add_columns(
            func.date_trunc("week", models.StationReadings.recorded_at).label("time")
        ).group_by(func.date_trunc("week", models.StationReadings.recorded_at))

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

    results = query.filter(
        models.StationReadings.parameter == enum_param
    ).order_by("time").all()

    return [
        {
            "time": str(r.time),
            "value": round(float(r.value), 2)
        }
        for r in results
    ]


# =====================================================
# ⚠ MUST BE LAST — DB STATION READINGS
# =====================================================
@router.get("/{station_id}")
def get_station_readings(station_id: int, db: Session = Depends(get_db)):
    readings = db.query(models.StationReadings).filter(
        models.StationReadings.station_id == station_id
    ).order_by(models.StationReadings.recorded_at).all()

    if not readings:
        fetch_and_store_live_data(db, station_id)
        readings = db.query(models.StationReadings).filter(
            models.StationReadings.station_id == station_id
        ).all()

    return [
        {
            "parameter": r.parameter.value,
            "value": float(r.value),
            "recorded_at": r.recorded_at
        }
        for r in readings
    ]


# =====================================================
# BATCH READINGS (FOR MAP)
# =====================================================
@router.post("/batch")
def get_batch_readings(station_ids: list[int], db: Session = Depends(get_db)):
    readings = db.query(models.StationReadings).filter(
        models.StationReadings.station_id.in_(station_ids)
    ).all()

    result = {}
    for r in readings:
        result.setdefault(r.station_id, []).append({
            "parameter": r.parameter.value,
            "value": float(r.value),
            "recorded_at": r.recorded_at
        })

    return result
