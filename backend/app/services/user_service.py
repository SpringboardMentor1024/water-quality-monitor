from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user_schema import UserCreate
from app.utils.hashing import Hasher

class UserService:
    
    # 1. Get User by Email (Helper)
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    # 2. Create New User (Registration)
    @staticmethod
    def create_user(db: Session, user: UserCreate):
        # Step A: Check if email already exists
        existing_user = UserService.get_user_by_email(db, email=user.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Step B: Hash the password (Security)
        hashed_password = Hasher.get_password_hash(user.password)

        # Step C: Create the Database Model
        db_user = User(
            name=user.name,
            email=user.email,
            # 🔴 FIX 1: The model field is 'hashed_password', NOT 'password'
            hashed_password=hashed_password, 
            role=user.role,
            location=user.location
        )

        # Step D: Save to DB
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user

    # 3. Authenticate User (Login Logic)
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        # Step A: Find the user
        user = UserService.get_user_by_email(db, email=email)
        if not user:
            return None
        
        # Step B: Check if the password matches
        # 🔴 FIX 2: Access the correct field 'user.hashed_password'
        if not Hasher.verify_password(password, user.hashed_password):
            return None
            
        return user