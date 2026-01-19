from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import get_db
from auth import get_current_user

router = APIRouter(
    prefix="/api/user-reports",
    tags=["User Reports"]
)

# =====================================================
# CREATE USER REPORT (Citizen)
# =====================================================
@router.post("", response_model=schemas.UserReportResponse)
def create_user_report(
    report: schemas.UserReportCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    new_report = models.Report(
        user_id=user.id,
        location=report.location,
        description=report.description,
        water_source=report.water_source,
        photo_url=report.photo_url,   # now optional
        status="pending"
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report



# =====================================================
# GET MY REPORTS (Citizen)
# =====================================================
@router.get("/my", response_model=List[schemas.UserReportResponse])
def get_my_reports(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return (
        db.query(models.Report)
        .filter(models.Report.user_id == current_user.id)
        .order_by(models.Report.created_at.desc())
        .all()
    )


# =====================================================
# GET ALL REPORTS (ADMIN / NGO)
# =====================================================
@router.get("", response_model=List[schemas.UserReportResponse])
def get_all_reports(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in ["admin", "ngo"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    return (
        db.query(models.Report)
        .order_by(models.Report.created_at.desc())
        .all()
    )


# =====================================================
# ✅ APPROVE / REJECT REPORT (ADMIN / NGO)
# =====================================================
@router.patch("/{report_id}/status", response_model=schemas.UserReportResponse)
def update_report_status(
    report_id: int,
    data: schemas.ReportStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 🔐 Role check
    if current_user.role not in ["admin", "ngo"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    # 🔥 IMPORTANT FIX (Enum → string)
    report.status = data.status.value

    db.commit()
    db.refresh(report)
    return report
