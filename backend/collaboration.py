from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(
    prefix="/api/collaborations",
    tags=["Collaborations"]
)

# =====================================================
# GET ALL COLLABORATIONS (NGO + PROJECT + STATIONS)
# =====================================================
@router.get("/")
def get_collaborations(db: Session = Depends(get_db)):
    results = (
        db.query(
            models.NGO.name.label("ngo"),
            models.Project.id.label("project_id"),
            models.Project.name.label("project"),
            models.Station.name.label("station"),
            models.StationAssignment.is_active
        )
        .join(models.Collaboration, models.Collaboration.ngo_id == models.NGO.id)
        .join(models.Project, models.Project.id == models.Collaboration.project_id)
        .join(models.StationAssignment, models.StationAssignment.project_id == models.Project.id)
        .join(models.Station, models.Station.id == models.StationAssignment.station_id)
        .all()
    )

    data = {}
    for r in results:
        key = (r.ngo, r.project_id)
        if key not in data:
            data[key] = {
                "ngo": r.ngo,
                "project_id": r.project_id,
                "project": r.project,
                "stations": [],
                "status": "Active" if r.is_active else "Inactive"
            }
        data[key]["stations"].append(r.station)

    return list(data.values())


# =====================================================
# GET PROJECT DETAILS (VIEW DETAILS PAGE)
# =====================================================
@router.get("/projects/{project_id}")
def get_project_details(project_id: int, db: Session = Depends(get_db)):
    project = (
        db.query(models.Project)
        .filter(models.Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    stations = (
    db.query(models.Station)
    .select_from(models.StationAssignment)
    .join(
        models.Station,
        models.Station.id == models.StationAssignment.station_id
    )
    .filter(models.StationAssignment.project_id == project_id)
    .all()
)

    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "due_date": project.due_date,
        "stations": [
            {
                "id": s.id,
                "name": s.name,
                "lat": float(s.latitude),
                "lon": float(s.longitude),
            }
            for s in stations
        ]
    }


# =====================================================
# ASSIGN STATION TO PROJECT
# =====================================================
@router.post("/projects/{project_id}/assign-station/{station_id}")
def assign_station(project_id: int, station_id: int, db: Session = Depends(get_db)):
    exists = (
        db.query(models.StationAssignment)
        .filter_by(project_id=project_id, station_id=station_id)
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Station already assigned to this project"
        )

    assignment = models.StationAssignment(
        project_id=project_id,
        station_id=station_id,
        ngo_id=1,  # demo NGO (can be dynamic later)
        is_active=True
    )

    db.add(assignment)
    db.commit()

    return {"message": "Station assigned successfully"}


# =====================================================
# GET AVAILABLE STATIONS (NOT YET ASSIGNED)
# =====================================================
@router.get("/projects/{project_id}/available-stations")
def get_available_stations(project_id: int, db: Session = Depends(get_db)):
    assigned_ids = (
        db.query(models.StationAssignment.station_id)
        .filter(models.StationAssignment.project_id == project_id)
        .subquery()
    )

    stations = (
        db.query(models.Station)
        .filter(~models.Station.id.in_(assigned_ids))
        .all()
    )

    return [
        {
            "id": s.id,
            "name": s.name,
            "latitude": float(s.latitude),
            "longitude": float(s.longitude)
        }
        for s in stations
    ]
