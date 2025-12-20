from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/reports", tags=["User Reports"])


# Create a new report
@router.post("/", response_model=schemas.ReportOut)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    new_report = models.Reports(**report.dict())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report


# Get all reports
@router.get("/")
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Reports).all()


# Get report by ID
@router.get("/{report_id}", response_model=schemas.ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    return db.query(models.Reports).filter(models.Reports.id == report_id).first()
