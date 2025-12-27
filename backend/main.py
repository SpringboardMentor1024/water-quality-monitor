from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal
from routes import stations, readings, reports, searches, cpcb
from auth import get_current_user  # only if needed here
from models import Users, WaterStation, UserRole
from utils import hash_password, verify_password
from pydantic import BaseModel
from typing import Optional
import jwt
import os
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from routes import wqp

SECRET_KEY = "supersecret123"
ALGORITHM = "HS256"

app = FastAPI(title="Team-C Water Quality Backend")
security = HTTPBearer()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Database --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------- Schemas --------------------
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: UserRole
    location: Optional[str] = None

class WaterStationCreate(BaseModel):
    name: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    managed_by: Optional[str] = None
    status: Optional[str] = "active"

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

# -------------------- Root --------------------
@app.get("/")
def read_root():
    return {"message": "Team-C Backend is running!"}

# -------------------- Login --------------------
@app.post("/login")
def login_user(login: dict, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == login["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(login["password"], user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    payload = {"user_id": user.id, "email": user.email, "role": user.role.value}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "role": user.role.value,
        "token": token
    }

# -------------------- Protected example --------------------
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["user_id"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/user/profile")
def get_profile(current_user: Users = Depends(get_current_user)):
    return {"username": current_user.name, "role": current_user.role.value}

# -------------------- Include Routes --------------------
app.include_router(stations.router)
app.include_router(readings.router)
app.include_router(reports.router)
app.include_router(searches.router)
app.include_router(cpcb.router)
app.include_router(wqp.router)
# -------------------- Static files --------------------
if not os.path.exists("avatars"):
    os.makedirs("avatars")
app.mount("/avatars", StaticFiles(directory="avatars"), name="avatars")
