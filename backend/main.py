from fastapi import FastAPI, Depends, HTTPException, Header, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
#from database import SessionLocal, get_user_by_email, update_user_password, get_db
from database import SessionLocal, get_db

from models import Users, WaterStation, UserRole
from utils import create_reset_token, verify_reset_token, send_reset_email, hash_password, verify_password
from pydantic import BaseModel
from typing import Optional
import jwt
import os
from fastapi.staticfiles import StaticFiles

# ------------------------------
# IMPORT BE1 ROUTES
# ------------------------------
from routes import stations, readings, reports, searches

SECRET_KEY = "supersecret123"

app = FastAPI(title="Team-C Water Quality Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------
# DATABASE DEPENDENCY
# ------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------------
# Pydantic Schemas
# ------------------------------
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


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


# ------------------------------
# ROOT
# ------------------------------
@app.get("/")
def read_root():
    return {"message": "Team-C Backend is running!"}


# ------------------------------
# LOGIN
# ------------------------------
@app.post("/login")
def login_user(login: dict, db: Session = Depends(get_db)):
    email = login.get("email")
    password = login.get("password")

    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    payload = {"user_id": user.id, "email": user.email, "role": user.role.value}
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return {
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "role": user.role.value,
        "token": token
    }


# ------------------------------
# FORGOT PASSWORD
# ------------------------------
@app.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_reset_token(user.email)
    try:
        send_reset_email(user.email, token)
    except Exception as e:
        print("Email error:", e)
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"message": "Password reset link sent to your email"}


# ------------------------------
# RESET PASSWORD
# ------------------------------
@app.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(request.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    hashed = hash_password(request.new_password)
    update_user_password(db, email, hashed)

    return {"message": "Password updated successfully"}


# ------------------------------
# WATER STATIONS
# ------------------------------
@app.get("/water-stations")
def get_water_stations(db: Session = Depends(get_db)):
    return db.query(WaterStation).all()


@app.post("/water-stations")
def create_water_station(station: WaterStationCreate, db: Session = Depends(get_db)):
    db_station = WaterStation(
        name=station.name,
        location=station.location,
        latitude=station.latitude,
        longitude=station.longitude,
        managed_by=station.managed_by,
        status=station.status
    )
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return {"message": "Water station created", "station_id": db_station.id}


# ------------------------------
# USERS
# ------------------------------
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(Users).all()


@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = Users(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        location=user.location
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ------------------------------
# REGISTER
# ------------------------------
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(Users).filter(Users.email == user.email).first()
    if existing_user:
        return {"message": "Email already registered"}, 400

    db_user = Users(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        location=user.location
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {
        "message": "Registration successful",
        "user_id": db_user.id,
        "name": db_user.name,
        "role": db_user.role.value
    }


# ------------------------------
# USER PROFILE
# ------------------------------
@app.get("/user/profile")
def get_profile(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"username": user.name, "role": user.role.value}


# ------------------------------
# CHANGE PASSWORD
# ------------------------------
@app.put("/user/change-password")
def change_password(req: ChangePasswordRequest, authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(Users).filter(Users.id == user_id).first()

    if not verify_password(req.old_password, user.password):
        raise HTTPException(status_code=400, detail="Old password incorrect")

    user.password = hash_password(req.new_password)
    db.commit()

    return {"message": "Password updated successfully"}


# ------------------------------
# USER AVATAR
# ------------------------------
if not os.path.exists("avatars"):
    os.makedirs("avatars")

app.mount("/avatars", StaticFiles(directory="avatars"), name="avatars")


@app.put("/user/avatar")
def update_avatar(
    avatar: UploadFile = File(...),
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    filename = f"avatars/{user_id}_{avatar.filename}"

    with open(filename, "wb") as f:
        f.write(avatar.file.read())

    user = db.query(Users).filter(Users.id == user_id).first()
    user.avatar = filename
    db.commit()

    return {"message": filename}


@app.put("/user/profile")
def update_profile(new_data: dict, authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(Users).filter(Users.id == user_id).first()

    username = new_data.get("username")
    if username:
        user.name = username
        db.commit()

    return {"message": "Profile updated successfully"}


# ------------------------------
# INCLUDE BE1 ROUTES
# ------------------------------
app.include_router(stations.router)
app.include_router(readings.router)
app.include_router(reports.router)
app.include_router(searches.router)


    
