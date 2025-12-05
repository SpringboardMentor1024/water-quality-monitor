from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, get_db, get_user_by_email, update_user_password
from models import Users, WaterStation, UserRole
from utils import create_reset_token, verify_reset_token, send_reset_email, hash_password
from pydantic import BaseModel
from typing import Optional


app = FastAPI(title="Team-C Water Quality Backend")

# ----------------------
# Enable CORS for frontend connection
# ----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use "*" for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------
# Database dependency
# ----------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------------
# Pydantic Schemas
# ----------------------
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
    status: Optional[str] = "active"  # Not in your DB but can keep if needed

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ----------------------
# Root Endpoint
# ----------------------
@app.get("/")
def read_root():
    return {"message": "Hello, Team-C Backend is running!"}

# ----------------------
# GET Endpoints
# ----------------------
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(Users).all()

@app.get("/waterstations")
def get_waterstations(db: Session = Depends(get_db)):
    return db.query(WaterStation).all()

# ----------------------
# POST Endpoints
# ----------------------
@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = Users(
        name=user.name,
        email=user.email,
        password=user.password,
        role=user.role,
        location=user.location
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/waterstations")
def create_waterstation(station: WaterStationCreate, db: Session = Depends(get_db)):
    db_station = WaterStation(
        name=station.name,
        location=station.location,
        latitude=station.latitude,
        longitude=station.longitude,
        managed_by=station.managed_by
    )
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(Users).filter(Users.email == user.email).first()
    if existing_user:
        return {"message": "Email already registered"}, 400

    # Create new user
    db_user = Users(
        name=user.name,
        email=user.email,
        password=user.password,   # later hash it
        role=user.role,
        location=user.location
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "Registration successful", "user_id": db_user.id}


@app.post("/login")
def login_user(login: dict, db: Session = Depends(get_db)):
    email = login.get("email")
    password = login.get("password")

    # Find user
    user = db.query(Users).filter(Users.email == email).first()

    if not user:
        return {"message": "User not found"}, 404

    if user.password != password:
        return {"message": "Incorrect password"}, 401

    return {
        "message": "Login successful",
        "user_id": user.id,
        "role": user.role,
        "name": user.name
    }
@app.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user:
        return {"message": "User not found"}, 404

    token = create_reset_token(user.email)
    try:
        send_reset_email(user.email, token)
    except Exception as e:
        print("Email error:", e)
        return {"message": "Failed to send email"}, 500

    return {"message": "Password reset link sent to your email"}

@app.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(request.token)
    if not email:
        return {"message": "Invalid or expired token"}, 400
    hashed = hash_password(request.new_password)
    update_user_password(db, email, hashed)
    return {"message": "Password updated successfully"}
