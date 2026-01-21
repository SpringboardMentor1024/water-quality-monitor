from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.core.database import get_db
from app.schemas.user_schema import (
    UserCreate,
    UserLogin,
    LoginResponse,
    UserResponse,
)
from app.services.user_service import UserService
from app.utils.jwt_handler import create_access_token
from app.models.user import User
from app.core.config import settings

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# =========================================================
# 🔐 AUTH DEPENDENCY (FIXED)
# =========================================================
# We manually extract the JWT from Authorization header
# because login is JSON-based (NOT OAuth2 form-based)

def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        email: str | None = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    return user


# =========================================================
# 🧾 REGISTER USER
# =========================================================
@router.post("/register", response_model=UserResponse)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    new_user = UserService.create_user(db=db, user=user)
    return new_user


# =========================================================
# 🔑 LOGIN USER (JSON-BASED)
# =========================================================
@router.post("/login", response_model=LoginResponse)
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    # 1️⃣ Authenticate user
    db_user = UserService.authenticate_user(
        db,
        email=user.email,
        password=user.password
    )

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )

    # 2️⃣ Create JWT token (email stored in `sub`)
    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    # 3️⃣ Return token + user
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=db_user
    )


# =========================================================
# 👥 GET ALL USERS (OPTIONAL – ADMIN USE)
# =========================================================
@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    return users
