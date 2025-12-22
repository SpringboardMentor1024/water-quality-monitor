from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.reports import Report
from app.models.user import User
from app.routers.auth import get_current_user 
from app.schemas.report_schema import ReportCreate, ReportResponse

router = APIRouter(tags=["Reports"])

@router.post("/reports", response_model=ReportResponse)
def create_report(
    report: ReportCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_report = Report(**report.dict(), user_id=current_user.id)
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("/reports", response_model=List[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()