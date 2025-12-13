from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
import hashlib
import secrets
import os
from pydantic import BaseModel, EmailStr
import models, schemas
from database import engine, get_db
from dotenv import load_dotenv
import emails
from emails.template import JinjaTemplate

load_dotenv()
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Water Quality Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
RESET_TOKEN_EXPIRE_HOURS = 24
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
FROM_EMAIL = os.getenv('FROM_EMAIL', 'noreply@waterquality.com')
APP_URL = os.getenv('APP_URL', 'http://localhost:3000')

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "user"

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    created_at: Optional[datetime]

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def send_password_reset_email(email: str, token: str) -> dict:
    reset_link = f"{APP_URL}/reset-password?token={token}"
    html_content = f"""
    <!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
    .header {{ background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
    .button {{ background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
    .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}</style></head>
    <body><div class="container"><div class="header"><h1>🔒 Password Reset</h1></div>
    <div class="content"><h2>Hello,</h2><p>You requested to reset your password for <strong>Water Quality Monitor</strong>.</p>
    <p>Click the button below to reset your password:</p><div style="text-align: center;"><a href="{reset_link}" class="button">Reset Password</a></div>
    <p>Or copy and paste this link in your browser:</p><p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{reset_link}</p>
    <p><strong>This link will expire in 24 hours.</strong></p><p>If you didn't request this reset, please ignore this email.</p>
    <p>Best regards,<br>Water Quality Monitor Team</p></div><div class="footer">
    <p>This is an automated message. Please do not reply to this email.</p></div></div></body></html>"""
    
    if SMTP_USERNAME and SMTP_PASSWORD and FROM_EMAIL:
        try:
            message = emails.Message(subject="Password Reset - Water Quality Monitor", mail_from=("Water Quality Monitor", FROM_EMAIL), html=html_content)
            response = message.send(to=email, smtp={"host": SMTP_HOST, "port": SMTP_PORT, "tls": True, "user": SMTP_USERNAME, "password": SMTP_PASSWORD})
            if response.status_code == 250:
                print(f"✅ Password reset email sent to {email}")
                return {"message": "Password reset email sent successfully"}
            else:
                raise Exception("Email sending failed")
        except Exception as e:
            print(f"❌ Email sending error: {str(e)}")
            return {"message": "Email service temporarily unavailable", "reset_token": token, "reset_link": reset_link, "note": "Development mode: Use this link to reset password"}
    else:
        print(f"⚠️ Email not configured. Development mode active for {email}")
        return {"message": "Reset link generated (development mode)", "reset_token": token, "reset_link": reset_link, "note": "Check browser console for reset link"}

@app.post("/api/auth/register", response_model=UserResponse, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email, "role": user.role, "user_id": user.id}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.put("/api/auth/profile", response_model=UserResponse)
def update_profile(user_update: UserUpdate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None: raise credentials_exception
    except JWTError: raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None: raise credentials_exception
    if user_update.full_name is not None: user.full_name = user_update.full_name
    if user_update.email is not None and user_update.email != user.email:
        existing_user = db.query(models.User).filter(models.User.email == user_update.email, models.User.id != user.id).first()
        if existing_user: raise HTTPException(status_code=400, detail="Email already registered")
        user.email = user_update.email
    if user_update.new_password:
        if not user_update.current_password: raise HTTPException(status_code=400, detail="Current password is required to set new password")
        if not verify_password(user_update.current_password, user.hashed_password): raise HTTPException(status_code=400, detail="Current password is incorrect")
        user.hashed_password = get_password_hash(user_update.new_password)
    db.commit()
    db.refresh(user)
    return user

@app.post("/api/auth/forgot-password")
def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user: return {"message": "If the email exists, a reset link has been sent"}
    reset_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(reset_token.encode()).hexdigest()
    expires_at = datetime.utcnow() + timedelta(hours=RESET_TOKEN_EXPIRE_HOURS)
    db.query(models.PasswordReset).filter(models.PasswordReset.email == data.email).delete()
    password_reset = models.PasswordReset(email=data.email, token_hash=token_hash, expires_at=expires_at, used=False)
    db.add(password_reset)
    db.commit()
    result = send_password_reset_email(data.email, reset_token)
    if "reset_token" not in result: result["reset_token"] = reset_token; result["reset_link"] = f"{APP_URL}/reset-password?token={reset_token}"
    return result

@app.post("/api/auth/reset-password")
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    if len(data.new_password) < 8: raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    token_hash = hashlib.sha256(data.token.encode()).hexdigest()
    reset_request = db.query(models.PasswordReset).filter(models.PasswordReset.token_hash == token_hash, models.PasswordReset.expires_at > datetime.utcnow(), models.PasswordReset.used == False).first()
    if not reset_request: raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    user = db.query(models.User).filter(models.User.email == reset_request.email).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = get_password_hash(data.new_password)
    reset_request.used = True
    db.commit()
    return {"message": "Password reset successful"}

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None: raise credentials_exception
    except JWTError: raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None: raise credentials_exception
    return user

@app.post("/api/readings", response_model=schemas.WaterReading, status_code=201)
def create_reading(reading: schemas.WaterReadingCreate, db: Session = Depends(get_db)):
    db_reading = models.WaterReading(**reading.dict())
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