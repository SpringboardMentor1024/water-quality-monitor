from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta
import shutil, os

from database import get_db
import models
import schemas
from fastapi.security import OAuth2PasswordBearer

# ---------------- CONFIG ----------------
SECRET_KEY = "super-secret-key"  # change in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# ---------------- TOKEN UTILS ----------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- CURRENT USER ----------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise credentials_exception

    return user

# ---------------- REGISTER ----------------
@router.post("/register", response_model=schemas.RegisterResponse)
def register(data: schemas.RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = models.User(email=data.email, password=data.password, role=data.role)
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Registration successful"}

# ---------------- LOGIN ----------------
@router.post("/login")
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or user.password != data.password:
        return {"success": False, "message": "Invalid credentials"}

    access_token = create_access_token({"user_id": user.id, "role": user.role})

    return {
        "success": True,
        "message": "Login successful",
        "user": {"id": user.id, "email": user.email, "role": user.role},
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }

# ---------------- PROFILE ----------------
@router.get("/profile", response_model=schemas.UserResponse)
def get_user_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

# ---------------- PROFILE UPLOAD ----------------
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload-pic")
def upload_profile_pic(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_path = os.path.join(UPLOAD_DIR, f"user_{current_user.id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.profile_pic = file_path
    db.commit()
    db.refresh(current_user)

    return {"success": True, "message": "Profile picture uploaded successfully", "url": file_path}

# ---------------- PROFILE UPDATE ----------------
@router.put("/update")
def update_profile(
    email: str = Form(None),
    name: str = Form(None),
    phone: str = Form(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if email:
        current_user.email = email
    if name:
        current_user.name = name
    if phone:
        current_user.phone = phone

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "phone": current_user.phone,
            "role": current_user.role,
            "profilePic": getattr(current_user, "profile_pic", None)
        }
    }

# ---------------- CHANGE PASSWORD ----------------
@router.post("/change-password")
def change_password(
    current_password: str = Form(...),
    new_password: str = Form(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify current password
    if current_user.password != current_password:
        return {"success": False, "message": "Current password is incorrect."}

    # Update to new password
    current_user.password = new_password
    db.commit()
    db.refresh(current_user)

    return {"success": True, "message": "Password changed successfully!"}

# ---------------- UPDATE EMAIL ----------------
@router.put("/update-email")
def update_email(
    data: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_email = data.get("new_email")
    if not new_email:
        raise HTTPException(status_code=400, detail="New email is required")

    existing = db.query(models.User).filter(models.User.email == new_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")

    current_user.email = new_email
    db.commit()
    db.refresh(current_user)

    return {"detail": "Email updated successfully"}


# ---------------- UPDATE PASSWORD ----------------
@router.put("/update-password")
def update_password(
    data: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_password = data.get("new_password")
    if not new_password or len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    current_user.password = new_password
    db.commit()
    db.refresh(current_user)

    return {"detail": "Password updated successfully"}
