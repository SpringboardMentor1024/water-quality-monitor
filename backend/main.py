from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import jwt
import os
import shutil
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
from database import engine, Base
import models  # 🔴 THIS IS CRITICAL


from database import SessionLocal
from models import Users, UserRole
from utils import hash_password, verify_password
from routes import stations, readings, reports, searches, cpcb, wqp, who, alerts

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret123")
ALGORITHM = "HS256"

MAIL_SENDER = os.getenv("MAIL_SENDER")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")


app = FastAPI(title="Team-C Water Quality Backend")
Base.metadata.create_all(bind=engine)

security = HTTPBearer()

# -------------------- CORS --------------------
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

class UserUpdate(BaseModel):
    name: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# -------------------- Auth --------------------
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.query(Users).filter(Users.id == payload["user_id"]).first()
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

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

    token = jwt.encode(
        {"user_id": user.id, "role": user.role.value},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "role": user.role.value,
        "token": token
    }

# -------------------- Profile --------------------
@app.get("/user/profile")
def get_profile(current_user: Users = Depends(get_current_user)):
    return {
        "username": current_user.name,
        "role": current_user.role.value
    }




@app.put("/user/profile")
def update_profile(
    data: UserUpdate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.name:
        current_user.name = data.name
        db.commit()

    return {"message": "Profile updated successfully"}



    

# -------------------- Change Password --------------------
@app.put("/user/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(data.old_password, current_user.password):
        raise HTTPException(status_code=400, detail="Old password incorrect")

    current_user.password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password updated successfully"}

# -------------------- Forgot Password --------------------
@app.post("/user/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    payload = {
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }

    # ✅ USE DIRECT SECRET_KEY (NOT os.getenv)
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


    reset_link = f"http://localhost:3000/reset-password?token={token}"

    sender = os.getenv("MAIL_SENDER")
    password = os.getenv("MAIL_PASSWORD")

    if not sender or not password:
        raise HTTPException(status_code=500, detail="Email credentials not configured")

    msg = MIMEText(
        f"""Hello,

Click the link below to reset your password:

{reset_link}

This link expires in 15 minutes.
""",
        "plain"
    )

    msg["Subject"] = "Reset Your Password"
    msg["From"] = sender
    msg["To"] = user.email

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender, password)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print("Email error:", e)
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"message": "Password reset link sent successfully"}


# -------------------- Reset Password --------------------
@app.post("/user/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")

    user = db.query(Users).filter(Users.id == payload["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password reset successfully"}

# -------------------- Register --------------------
@app.post("/register")
def register_user(data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(Users).filter(Users.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = Users(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role,
        location=data.location
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "email": new_user.email,
        "role": new_user.role.value
    }


# -------------------- Routers --------------------
app.include_router(stations.router)
app.include_router(readings.router)
app.include_router(reports.router)
app.include_router(searches.router)
app.include_router(cpcb.router)
app.include_router(wqp.router)
app.include_router(who.router)
app.include_router(alerts.router)

# -------------------- Static Files --------------------
if not os.path.exists("avatars"):
    os.makedirs("avatars")

app.mount("/avatars", StaticFiles(directory="avatars"), name="avatars")
