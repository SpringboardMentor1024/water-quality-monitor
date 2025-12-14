# # routers/user.py

# from fastapi import APIRouter, Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer
# from sqlalchemy.orm import Session
# from jose import jwt
# from database import SessionLocal
# from models.user import User
# from schemas.user import UserCreate, UserResponse
# from passlib.context import CryptContext

# # Router
# router = APIRouter(
#     prefix="/users",
#     tags=["users"]
# )

# # OAuth2 scheme
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# # Password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # DB dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # Get current user from token
# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     try:
#         payload = jwt.decode(token, "your_secret_key_here", algorithms=["HS256"])
#         email = payload.get("sub")
#         if email is None:
#             raise HTTPException(status_code=401, detail="Invalid token")
#         user = db.query(User).filter(User.email == email).first()
#         if not user:
#             raise HTTPException(status_code=401, detail="User not found")
#         return user
#     except:
#         raise HTTPException(status_code=401, detail="Invalid token")

# # Create user
# @router.post("/", response_model=UserResponse)
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     hashed_password = pwd_context.hash(user.password)
#     db_user = User(name=user.name, email=user.email, hashed_password=hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# # Read current user's profile
# @router.get("/profile", response_model=UserResponse)
# def read_profile(current_user: User = Depends(get_current_user)):
#     return current_user









# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database import get_db
# from models.user import User
# from schemas.user import UserCreate, UserResponse
# from utils.security import hash_password
# from routers.dependencies import get_current_user

# router = APIRouter(prefix="/users", tags=["users"])

# @router.post("/", response_model=UserResponse)
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     existing = db.query(User).filter(User.email == user.email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     hashed = hash_password(user.password)
#     db_user = User(name=user.name, email=user.email, hashed_password=hashed)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# @router.get("/me", response_model=UserResponse)
# def read_profile(current_user: User = Depends(get_current_user)):
#     return current_user






from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.user import UserResponse
from utils.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
