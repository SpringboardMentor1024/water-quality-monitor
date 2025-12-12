from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, get_user_by_email, update_user_password
from models import Users, WaterStation, UserRole
from utils import create_reset_token, verify_reset_token, send_reset_email, hash_password, verify_password
from pydantic import BaseModel
from typing import Optional
import jwt

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

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: UserRole
    location: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# Root
@app.get("/")
def read_root():
    return {"message": "Team-C Backend is running!"}

# Login Endpoint
@app.post("/login")
def login_user(login: dict, db: Session = Depends(get_db)):
    email = login.get("email")
    password = login.get("password")

    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # JWT token
    payload = {"user_id": user.id, "email": user.email, "role": user.role.value}
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return {
        "message": "Login successful",
        "user_id": user.id,
        "role": user.role.value,
        "name": user.name,
        "token": token
    }

# Forgot Password
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

# Reset Password
@app.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(request.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    hashed = hash_password(request.new_password)
    update_user_password(db, email, hashed)
    return {"message": "Password updated successfully"}
