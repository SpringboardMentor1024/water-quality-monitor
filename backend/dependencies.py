# dependencies.py
from fastapi import Depends, HTTPException

from fastapi.security import OAuth2PasswordBearer,HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt
import os

from database import SessionLocal
from models import Users

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret123")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.query(Users).filter(Users.id == payload["user_id"]).first()
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

