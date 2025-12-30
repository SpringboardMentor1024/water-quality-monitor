from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import oauth2_scheme
from app.models.user import User
from app.schemas.user_schema import TokenData
from app.services.user_service import UserService

# This function is used as a Dependency in protected routes (like /users/me)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 1. Decode the Token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        # 2. Extract the Email (Subject)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
            
        # 3. Create a TokenData object (validates the shape)
        token_data = TokenData(email=email)
        
    except JWTError:
        raise credentials_exception

    # 4. Fetch the User from the Database
    # We use the Service layer to find the user by email
    user = UserService.get_user_by_email(db, email=token_data.email)
    
    if user is None:
        raise credentials_exception
        
    return user