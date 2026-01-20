from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.ngo import NGO
from app.schemas.ngo_schema import NGOCreate, NGOResponse
from typing import List

router = APIRouter(prefix="/ngos", tags=["NGOs"])

@router.post("/", response_model=NGOResponse)
def create_ngo(ngo: NGOCreate, db: Session = Depends(get_db)):
    new_ngo = NGO(**ngo.dict())
    db.add(new_ngo)
    db.commit()
    db.refresh(new_ngo)
    return new_ngo

@router.get("/", response_model=List[NGOResponse])
def list_ngos(db: Session = Depends(get_db)):
    return db.query(NGO).all()

@router.get("/{ngo_id}", response_model=NGOResponse)
def get_ngo(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo

@router.delete("/{ngo_id}")
def delete_ngo(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    db.delete(ngo)
    db.commit()
    return {"message": "NGO deleted"}
