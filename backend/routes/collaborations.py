from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Collaborations
from schemas import CollaborationCreate, CollaborationOut

router = APIRouter(
    prefix="/collaborations",
    tags=["Collaborations"]
)

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


@router.get("/ngo/{ngo_id}", response_model=list[CollaborationOut])
def get_collaborations_for_ngo(
    ngo_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Collaborations).filter(
        (Collaborations.ngo_id == ngo_id) |
        (Collaborations.partner_ngo_id == ngo_id)
    ).all()
