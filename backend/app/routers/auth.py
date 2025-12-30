from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.core.database import get_db
from app.schemas.user_schema import UserCreate, UserLogin, LoginResponse, UserResponse
from app.services.user_service import UserService
from app.utils.jwt_handler import create_access_token
from app.models.user import User
from app.core.config import settings # Ensure you have settings imported for SECRET_KEY

# 🟢 1. Setup Security Scheme
# This tells FastAPI that the client must send a Token to authenticate
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# 🟢 2. The Missing Dependency Function
# This function takes the token, decodes it, and finds the user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # We need the same SECRET_KEY you used to sign the token
        # If settings.SECRET_KEY gives an error, replace it with your actual secret string for now
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


# REGISTER USER
@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = UserService.create_user(db=db, user=user)
    return new_user


# LOGIN USER
@router.post("/login", response_model=LoginResponse)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    # 1. Authenticate
    db_user = UserService.authenticate_user(db, email=user.email, password=user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )

    # 2. Create JWT Token
    access_token = create_access_token(data={"sub": db_user.email})

    # 3. Return response
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=db_user
    )


# ✅ GET ALL REGISTERED USERS (ADMIN PANEL)
@router.get("/users", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users