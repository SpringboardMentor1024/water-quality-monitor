# # routers/auth.py

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database import SessionLocal
# from models.user import User
# from schemas.user import UserCreate, UserResponse, LoginRequest, TokenResponse
# from passlib.context import CryptContext
# from jose import jwt

# router = APIRouter(
#     prefix="/auth",
#     tags=["auth"]
# )

# # Password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # Secret Key & Algorithm
# JWT_SECRET_KEY = "your_secret_key_here"
# JWT_ALGORITHM = "HS256"


# # --------------------------
# # DB DEPENDENCY
# # --------------------------
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# # --------------------------
# # PASSWORD HELPERS
# # --------------------------
# def hash_password(password: str):
#     return pwd_context.hash(password)

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)


# # --------------------------
# # JWT TOKEN
# # --------------------------
# def create_access_token(data: dict):
#     return jwt.encode(data, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


# # --------------------------
# # REGISTER USER
# # --------------------------
# @router.post("/register", response_model=UserResponse)
# def register_user(user: UserCreate, db: Session = Depends(get_db)):

#     existing = db.query(User).filter(User.email == user.email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed_pw = hash_password(user.password)

#     new_user = User(
#         name=user.name,
#         email=user.email,
#         hashed_password=hashed_pw
#     )

#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     return new_user


# # --------------------------
# # LOGIN USER  (Swagger-friendly)
# # --------------------------
# @router.post("/login", response_model=TokenResponse)
# def login_user(login: LoginRequest, db: Session = Depends(get_db)):

#     user = db.query(User).filter(User.email == login.email).first()

#     if not user:
#         raise HTTPException(status_code=400, detail="Invalid email or password")

#     if not verify_password(login.password, user.hashed_password):
#         raise HTTPException(status_code=400, detail="Invalid email or password")

#     token = create_access_token({"sub": user.email})

#     return {
#         "access_token": token,
#         "token_type": "bearer"
#     }


# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from database import get_db
# from models.user import User
# from schemas.user import UserCreate, UserResponse, TokenResponse
# from utils.security import hash_password, verify_password, create_access_token

# router = APIRouter(prefix="/auth", tags=["auth"])

# @router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
# def register(user: UserCreate, db: Session = Depends(get_db)):
#     existing = db.query(User).filter(User.email == user.email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     hashed = hash_password(user.password)
#     db_user = User(name=user.name, email=user.email, hashed_password=hashed)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# # login: use OAuth2 form or JSON. Here we accept form (works with Swagger Authorize)
# from fastapi.security import OAuth2PasswordRequestForm

# @router.post("/login", response_model=TokenResponse)
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     # OAuth2PasswordRequestForm uses 'username' as the login field — we use email
#     user = db.query(User).filter(User.email == form_data.username).first()
#     if not user or not verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     token = create_access_token(sub=user.email)
#     return {"access_token": token, "token_type": "bearer"}



from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from database import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse, TokenResponse
from utils.security import hash_password, verify_password, create_access_token
from config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user.password)
    db_user = User(name=user.name, email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return {"access_token": token, "token_type": "bearer"}

