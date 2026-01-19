# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from sqlalchemy import func
# from database import get_db
# import models

# router = APIRouter(prefix="/alerts", tags=["Alerts"])


# # =====================================================
# # GET ACTIVE ALERTS (ALERTS PAGE)
# # =====================================================
# @router.get("/")
# def get_active_alerts(db: Session = Depends(get_db)):
#     alerts = db.query(models.Alerts).filter(
#         models.Alerts.status == models.AlertStatusEnum.active
#     ).order_by(models.Alerts.issued_at.desc()).all()

#     return [
#         {
#             "id": a.id,
#             "type": a.type.value,
#             "message": a.message,
#             "location": a.location,
#             "issued_at": a.issued_at,
#             "status": a.status.value
#         }
#         for a in alerts
#     ]


# # =====================================================
# # GET ALERT HISTORY (RESOLVED ALERTS)
# # =====================================================
# @router.get("/history")
# def get_alert_history(db: Session = Depends(get_db)):
#     alerts = db.query(models.Alerts).filter(
#         models.Alerts.status == models.AlertStatusEnum.resolved
#     ).order_by(models.Alerts.issued_at.desc()).all()

#     return [
#         {
#             "id": a.id,
#             "type": a.type.value,
#             "message": a.message,
#             "location": a.location,
#             "issued_at": a.issued_at,
#             "status": a.status.value
#         }
#         for a in alerts
#     ]


# # =====================================================
# # GET ALERT BY ID (DETAIL VIEW)
# # =====================================================
# @router.get("/{alert_id}")
# def get_alert_by_id(alert_id: int, db: Session = Depends(get_db)):
#     alert = db.query(models.Alerts).filter(
#         models.Alerts.id == alert_id
#     ).first()

#     if not alert:
#         raise HTTPException(status_code=404, detail="Alert not found")

#     return {
#         "id": alert.id,
#         "type": alert.type.value,
#         "message": alert.message,
#         "location": alert.location,
#         "issued_at": alert.issued_at,
#         "status": alert.status.value
#     }


# # =====================================================
# # RESOLVE ALERT (MOVE TO HISTORY)
# # =====================================================
# @router.put("/{alert_id}/resolve")
# def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
#     alert = db.query(models.Alerts).filter(
#         models.Alerts.id == alert_id
#     ).first()

#     if not alert:
#         raise HTTPException(status_code=404, detail="Alert not found")

#     alert.status = models.AlertStatusEnum.resolved
#     db.commit()

#     return {
#         "message": "Alert resolved successfully",
#         "alert_id": alert_id
#     }


# # =====================================================
# # ALERT ANALYTICS (ACTIVE + RESOLVED)
# # =====================================================
# @router.get("/analytics/trends")
# def alert_trends(db: Session = Depends(get_db)):
#     results = db.query(
#         func.date(models.Alerts.issued_at).label("date"),
#         func.count(models.Alerts.id).label("count")
#     ).group_by(
#         func.date(models.Alerts.issued_at)
#     ).order_by(
#         func.date(models.Alerts.issued_at)
#     ).all()

#     return [
#         {
#             "date": str(r.date),
#             "count": r.count
#         }
#         for r in results
#     ]

# @router.get("/analytics/radar")
# def alert_radar(db: Session = Depends(get_db)):
#     # fetch ONLY message column (no SQL aggregation)
#     rows = db.query(models.Alerts.message).all()

#     counts = {
#         "pH": 0,
#         "DO": 0,
#         "turbidity": 0
#     }

#     for (message,) in rows:
#         msg = message.lower()

#         if "ph" in msg:
#             counts["pH"] += 1
#         elif "dissolved oxygen" in msg:
#             counts["DO"] += 1
#         elif "turbidity" in msg:
#             counts["turbidity"] += 1

#     return [
#         {"parameter": k, "alerts": v}
#         for k, v in counts.items()
#         if v > 0
#     ]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models
from schemas import AlertCreate, AlertOut

router = APIRouter(prefix="/alerts", tags=["Alerts"])


# =====================================================
# GET ACTIVE ALERTS (ALERTS PAGE)
# =====================================================
@router.get("/")
def get_active_alerts(db: Session = Depends(get_db)):
    alerts = db.query(models.Alerts).filter(
        models.Alerts.status == models.AlertStatusEnum.active
    ).order_by(models.Alerts.issued_at.desc()).all()

    return [
        {
            "id": a.id,
            "type": a.type.value,
            "message": a.message,
            "location": a.location,
            "issued_at": a.issued_at,
            "status": a.status.value
        }
        for a in alerts
    ]


# =====================================================
# GET ALERT HISTORY (RESOLVED ALERTS)
# =====================================================
@router.get("/history")
def get_alert_history(db: Session = Depends(get_db)):
    alerts = db.query(models.Alerts).filter(
        models.Alerts.status == models.AlertStatusEnum.resolved
    ).order_by(models.Alerts.issued_at.desc()).all()

    return [
        {
            "id": a.id,
            "type": a.type.value,
            "message": a.message,
            "location": a.location,
            "issued_at": a.issued_at,
            "status": a.status.value
        }
        for a in alerts
    ]


# =====================================================
# GET ALERT BY ID (DETAIL VIEW)
# =====================================================
@router.get("/{alert_id}")
def get_alert_by_id(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(models.Alerts).filter(
        models.Alerts.id == alert_id
    ).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    return {
        "id": alert.id,
        "type": alert.type.value,
        "message": alert.message,
        "location": alert.location,
        "issued_at": alert.issued_at,
        "status": alert.status.value
    }


# =====================================================
# RESOLVE ALERT (MOVE TO HISTORY)
# =====================================================
@router.put("/{alert_id}/resolve")
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(models.Alerts).filter(
        models.Alerts.id == alert_id
    ).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = models.AlertStatusEnum.resolved
    db.commit()

    return {
        "message": "Alert resolved successfully",
        "alert_id": alert_id
    }


# =====================================================
# ALERT ANALYTICS (ACTIVE + RESOLVED)
# =====================================================
@router.get("/analytics/trends")
def alert_trends(db: Session = Depends(get_db)):
    results = db.query(
        func.date(models.Alerts.issued_at).label("date"),
        func.count(models.Alerts.id).label("count")
    ).group_by(
        func.date(models.Alerts.issued_at)
    ).order_by(
        func.date(models.Alerts.issued_at)
    ).all()

    return [
        {
            "date": str(r.date),
            "count": r.count
        }
        for r in results
    ]


@router.get("/analytics/radar")
def alert_radar(db: Session = Depends(get_db)):
    rows = db.query(models.Alerts.message).all()

    counts = {
        "pH": 0,
        "DO": 0,
        "turbidity": 0
    }

    for (message,) in rows:
        msg = message.lower()

        if "ph" in msg:
            counts["pH"] += 1
        elif "dissolved oxygen" in msg:
            counts["DO"] += 1
        elif "turbidity" in msg:
            counts["turbidity"] += 1

    return [
        {"parameter": k, "alerts": v}
        for k, v in counts.items()
        if v > 0
    ]


# =====================================================
# ADDED FROM PREVIOUS FILE (SAFE ADDITIONS ONLY)
# =====================================================

# CREATE ALERT
@router.post("/create", response_model=AlertOut)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    db_alert = models.Alerts(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert


# UPDATE ALERT
@router.put("/{alert_id}/update", response_model=AlertOut)
def update_alert(alert_id: int, updated: AlertCreate, db: Session = Depends(get_db)):
    alert = db.query(models.Alerts).filter(models.Alerts.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    for key, value in updated.dict().items():
        setattr(alert, key, value)

    db.commit()
    db.refresh(alert)
    return alert


# DELETE ALERT
@router.delete("/{alert_id}/delete")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(models.Alerts).filter(models.Alerts.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    db.delete(alert)
    db.commit()
    return {"message": f"Alert {alert_id} deleted successfully"}
# =====================================================
# PREDICTIVE VS ACTIVE ALERTS TRENDS
# =====================================================
@router.get("/analytics/predictive-vs-active")
def predictive_vs_active_trends(db: Session = Depends(get_db)):
    """
    Active alerts: Alerts table
    Predictive alerts: derived from Reports table (or ML)
    """

    # 1️⃣ ACTIVE ALERTS PER DAY
    active_rows = db.query(
        func.date(models.Alerts.issued_at).label("date"),
        func.count(models.Alerts.id).label("active_alerts")
    ).group_by(
        func.date(models.Alerts.issued_at)
    ).all()

    active_map = {str(r.date): r.active_alerts for r in active_rows}

    # 2️⃣ PREDICTIVE ALERTS PER DAY
    # Using Reports as early-warning signals (ML inputs)
    predictive_rows = db.query(
        func.date(models.Reports.created_at).label("date"),
        func.count(models.Reports.id).label("predictive_alerts")
    ).group_by(
        func.date(models.Reports.created_at)
    ).all()

    predictive_map = {str(r.date): r.predictive_alerts for r in predictive_rows}

    # 3️⃣ MERGE BOTH
    all_dates = sorted(set(active_map) | set(predictive_map))

    return [
        {
            "date": d,
            "active_alerts": active_map.get(d, 0),
            "predictive_alerts": predictive_map.get(d, 0)
        }
        for d in all_dates
    ]
