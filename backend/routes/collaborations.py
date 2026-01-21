from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from models import Collaborations
from schemas import (
    CollaborationCreate,
    CollaborationOut,
    CollaborationView
)

router = APIRouter(
    prefix="/collaborations",
    tags=["Collaborations"]
)

# -------------------------------------------------
# CREATE COLLABORATION
# -------------------------------------------------

@router.post("/", response_model=CollaborationOut)
def create_collaboration(
    data: CollaborationCreate,
    db: Session = Depends(get_db)
):
    collaboration = Collaborations(**data.dict())
    db.add(collaboration)
    db.commit()
    db.refresh(collaboration)
    return collaboration


# -------------------------------------------------
# GET COLLABORATIONS FOR NGO
# -------------------------------------------------

@router.get("/ngo/{ngo_id}", response_model=list[CollaborationOut])
def get_collaborations_for_ngo(
    ngo_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Collaborations).filter(
        (Collaborations.ngo_id == ngo_id) |
        (Collaborations.partner_ngo_id == ngo_id)
    ).all()


# -------------------------------------------------
# COLLABORATIONS VIEW
# -------------------------------------------------

@router.get("/ngo/{ngo_id}/view", response_model=list[CollaborationView])
def get_collaborations_for_ngo_view(
    ngo_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
          c.id,
          c.project_id,
          p.description AS project_description,
          CASE
            WHEN c.ngo_id = :ngo_id THEN partner.name
            ELSE primary_ngo.name
          END AS partner_ngo_name,
          COUNT(ws.id) AS active_stations,
          c.status
        FROM collaborations c
        JOIN projects p ON p.id = c.project_id
        JOIN ngos primary_ngo ON primary_ngo.id = c.ngo_id
        JOIN ngos partner ON partner.id = c.partner_ngo_id
        LEFT JOIN "WaterStation" ws ON ws.project_id = p.id
        WHERE c.ngo_id = :ngo_id
           OR c.partner_ngo_id = :ngo_id
        GROUP BY
          c.id,
          c.project_id,
          p.description,
          partner.name,
          primary_ngo.name,
          c.status
    """)

    rows = db.execute(query, {"ngo_id": ngo_id}).fetchall()

    return [
        {
            "id": r.id,
            "project_id": r.project_id,
            "project_description": r.project_description,
            "partner_ngo_name": r.partner_ngo_name,
            "active_stations": r.active_stations,
            "status": r.status
        }
        for r in rows
    ]


# -------------------------------------------------
# SHARED REPORTS (SIMPLE + STATION NAME)
# -------------------------------------------------

@router.get("/ngo/{ngo_id}/reports")
def get_shared_reports_for_ngo(
    ngo_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
          r.id,
          r.description,
          r.location,
          r.status,
          r.created_at,
          ws.name AS station_name     -- ✅ SINGLE LINE ADDED
        FROM "Reports" r
        JOIN "WaterStation" ws ON ws.id = r.station_id
        JOIN collaborations c ON c.project_id = ws.project_id
        WHERE c.ngo_id = :ngo_id
           OR c.partner_ngo_id = :ngo_id
        ORDER BY r.created_at DESC
    """)

    rows = db.execute(query, {"ngo_id": ngo_id}).fetchall()

    return [
        {
            "id": r.id,
            "description": r.description,
            "location": r.location,
            "status": r.status,
            "created_at": r.created_at,
            "station_name": r.station_name   # ✅ SINGLE LINE ADDED
        }
        for r in rows
    ]
