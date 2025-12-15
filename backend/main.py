from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import hashlib
import secrets
import os
from . import models, schemas, auth, config
from .database import engine, get_db
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Water Quality Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_URL], # More secure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def send_password_reset_email(email: str, token: str) -> dict:
    reset_link = f"{config.APP_URL}/reset-password?token={token}"
    template_path = os.path.join(os.path.dirname(__file__), "templates", "reset_password.html")
    
    try:
        with open(template_path) as f:
            html_template = f.read()
        html_content = html_template.replace("{{ reset_link }}", reset_link)
    except FileNotFoundError:
        print(f"❌ Email template not found at {template_path}")
        return {"status": "error", "detail": "Email template missing on server."}
    
    if config.SMTP_USERNAME and config.SMTP_PASSWORD and config.FROM_EMAIL:
        msg = MIMEMultipart()
        msg['From'] = f"Water Quality Monitor <{config.FROM_EMAIL}>"
        msg['To'] = email
        msg['Subject'] = "Password Reset - Water Quality Monitor"
        msg.attach(MIMEText(html_content, 'html'))

        try:
            with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT) as server:
                server.starttls()
                server.login(config.SMTP_USERNAME, config.SMTP_PASSWORD)
                server.send_message(msg)
            print(f"✅ Password reset email sent to {email}")
            return {"status": "success"}
        except Exception as e:
            print(f"❌ Email sending error: {str(e)}")
            return {"status": "error", "detail": "Email service temporarily unavailable"}
    else:
        print(f"⚠️ Email not configured. Development mode active for {email}")
        print(f"DEV ONLY: Reset link for {email} is {reset_link}")
        return {"status": "dev_mode"}

@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role, "user_id": user.id}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.put("/api/auth/profile", response_model=schemas.UserResponse)
def update_profile(user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    user = current_user # The user is already fetched and validated by the dependency
    if user_update.full_name is not None: user.full_name = user_update.full_name
    if user_update.email is not None and user_update.email != user.email:
        existing_user = db.query(models.User).filter(models.User.email == user_update.email, models.User.id != user.id).first()
        if existing_user: raise HTTPException(status_code=400, detail="Email already registered")
        user.email = user_update.email
    if user_update.new_password:
        if not user_update.current_password: raise HTTPException(status_code=400, detail="Current password is required to set new password")
        if not auth.verify_password(user_update.current_password, user.hashed_password): raise HTTPException(status_code=400, detail="Current password is incorrect")
        user.hashed_password = auth.get_password_hash(user_update.new_password)
    db.commit()
    db.refresh(user)
    return user

@app.post("/api/auth/forgot-password")
def forgot_password(data: schemas.ForgotPassword, db: Session = Depends(get_db)):
    # Always return a generic message to prevent user enumeration attacks
    generic_response = {"message": "If an account with that email exists, a password reset link has been sent."}
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user: return generic_response
    reset_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(reset_token.encode()).hexdigest()
    expires_at = datetime.utcnow() + timedelta(hours=config.RESET_TOKEN_EXPIRE_HOURS)
    db.query(models.PasswordReset).filter(models.PasswordReset.email == data.email).delete()
    password_reset = models.PasswordReset(email=data.email, token_hash=token_hash, expires_at=expires_at, used=False)
    db.add(password_reset)
    db.commit()
    send_password_reset_email(data.email, reset_token)
    return generic_response

@app.post("/api/auth/reset-password")
def reset_password(data: schemas.ResetPassword, db: Session = Depends(get_db)):
    if len(data.new_password) < 8: raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    token_hash = hashlib.sha256(data.token.encode()).hexdigest()
    reset_request = db.query(models.PasswordReset).filter(models.PasswordReset.token_hash == token_hash, models.PasswordReset.expires_at > datetime.utcnow(), models.PasswordReset.used == False).first()
    if not reset_request: raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    user = db.query(models.User).filter(models.User.email == reset_request.email).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = auth.get_password_hash(data.new_password)
    reset_request.used = True
    db.commit()
    return {"message": "Password reset successful"}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/api/readings", response_model=schemas.WaterReading, status_code=201)
def create_reading(reading: schemas.WaterReadingCreate, db: Session = Depends(get_db)):
    db_reading = models.WaterReading(**reading.model_dump())
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

@app.get("/api/readings", response_model=List[schemas.WaterReading])
def get_all_readings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    readings = db.query(models.WaterReading).order_by(models.WaterReading.recorded_at.desc()).offset(skip).limit(limit).all()
    return readings

@app.get("/")
def read_root():
    return {"message": "Welcome to the Water Quality Monitor API!"}