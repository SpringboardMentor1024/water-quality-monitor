from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.user_schema import UserResponse # Ensure this exists in your user_schema.py
from app.services.user_service import UserService # Ensure this exists in your user_service.py
from app.models.user import User

router = APIRouter(
    prefix="/users",  # <--- Changed to /users
    tags=["Users"]
)

# 1. Get All Users (Admin Dashboard)
@router.get("/", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Using the Service Layer to fetch users
    users = db.query(User).offset(skip).limit(limit).all()
    # Alternatively, if you have UserService.get_users(db), use that.
    return users

# 2. Get Single User by ID (Profile Page)
@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user