from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.reports import Report
from app.schemas.report_schema import (
    ReportCreate,
    ReportUpdate,
    ReportResponse
)

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

# =========================================
# CREATE REPORT (USER)
# =========================================
@router.post("", response_model=ReportResponse)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db)
):
    new_report = Report(
        title=report.title,
        location=report.location,
        description=report.description,
        water_source=report.water_source,
        photo_url=report.photo_url,
        status="pending"
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report


# =========================================
# GET ALL REPORTS (USER / NGO)
# =========================================
@router.get("", response_model=List[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.created_at.desc()).all()


# =========================================
# UPDATE REPORT STATUS (NGO)
# =========================================
@router.put("/{report_id}", response_model=ReportResponse)
def update_report_status(
    report_id: int,
    update: ReportUpdate,
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = update.status
    report.moderation_notes = update.moderation_notes

    db.commit()
    db.refresh(report)
    return report
