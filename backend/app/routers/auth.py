from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
# Import the new LoginResponse here
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin, LoginResponse
from app.services.user_service import UserService
from app.utils.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserService.create_user(db=db, user=user)
    return db_user

# UPDATED LOGIN FUNCTION
@router.post("/login", response_model=LoginResponse) # <--- Change return type
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    
    # 1. Verify credentials
    user = UserService.authenticate_user(db, email=user_credentials.email, password=user_credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 2. Create Access Token
    access_token = create_access_token(data={"sub": user.email})
    
    # 3. Return Token AND User Details
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user  # This will be automatically validated by UserResponse schema
    }