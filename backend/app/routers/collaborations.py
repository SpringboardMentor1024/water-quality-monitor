from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.collaboration import Collaboration
from app.models.ngo import NGO
from app.models.project import Project
from app.schemas.collaboration_schema import (
    CollaborationCreate,
    CollaborationResponse
)

router = APIRouter(
    prefix="/collaborations",
    tags=["Collaborations"]
)

# -------------------------------------------------
# GET ALL COLLABORATIONS
# -------------------------------------------------
@router.get("/", response_model=List[CollaborationResponse])
def list_collaborations(db: Session = Depends(get_db)):
    return db.query(Collaboration).all()


# -------------------------------------------------
# GET SINGLE COLLABORATION
# -------------------------------------------------
@router.get("/{collab_id}", response_model=CollaborationResponse)
def get_collaboration(collab_id: int, db: Session = Depends(get_db)):
    collaboration = db.query(Collaboration).filter(
        Collaboration.id == collab_id
    ).first()

    if not collaboration:
        raise HTTPException(status_code=404, detail="Collaboration not found")

    return collaboration


# -------------------------------------------------
# CREATE COLLABORATION
# -------------------------------------------------
@router.post("/", response_model=CollaborationResponse)
def create_collaboration(
    collaboration: CollaborationCreate,
    db: Session = Depends(get_db)
):
    # Validate NGO
    ngo = db.query(NGO).filter(NGO.id == collaboration.ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    # Validate Project
    project = db.query(Project).filter(Project.id == collaboration.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_collaboration = Collaboration(**collaboration.dict())
    db.add(new_collaboration)
    db.commit()
    db.refresh(new_collaboration)

    return new_collaboration


# -------------------------------------------------
# DELETE COLLABORATION
# -------------------------------------------------
@router.delete("/{collab_id}")
def delete_collaboration(collab_id: int, db: Session = Depends(get_db)):
    collaboration = db.query(Collaboration).filter(
        Collaboration.id == collab_id
    ).first()

    if not collaboration:
        raise HTTPException(status_code=404, detail="Collaboration not found")

    db.delete(collaboration)
    db.commit()

    return {"message": "Collaboration deleted successfully"}
