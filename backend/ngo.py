from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db
from auth import get_current_user

router = APIRouter(
    prefix="/api/ngo",
    tags=["NGO"]
)

# ---------------- GET NGO PROJECTS ----------------
@router.get("/projects")
def get_ngo_projects(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "ngo":
        raise HTTPException(status_code=403, detail="Not authorized")

    projects = (
        db.query(models.Project)
        .join(
            models.Collaboration,
            models.Project.id == models.Collaboration.project_id
        )
        .filter(models.Collaboration.ngo_id == user.ngo_id)
        .all()
    )

    return projects


# ---------------- GET NGO STATIONS ----------------
@router.get("/stations")
def get_ngo_stations(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "ngo":
        raise HTTPException(status_code=403, detail="Not authorized")

    stations = (
        db.query(models.Station)
        .join(
            models.StationAssignment,
            models.Station.id == models.StationAssignment.station_id
        )
        .filter(models.StationAssignment.ngo_id == user.ngo_id)
        .filter(models.StationAssignment.is_active == True)
        .all()
    )

    return stations
