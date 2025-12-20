from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/searches", tags=["Search Logs"])


# Create a search log
@router.post("/", response_model=schemas.SearchOut)
def create_search_log(search: schemas.SearchCreate, db: Session = Depends(get_db)):
    new_search = models.Searches(**search.dict())
    db.add(new_search)
    db.commit()
    db.refresh(new_search)
    return new_search


# Get all search logs of a user
@router.get("/{user_id}")
def get_user_search_logs(user_id: int, db: Session = Depends(get_db)):
    logs = db.query(models.Searches).filter(models.Searches.user_id == user_id).all()
    return logs
