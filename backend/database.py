# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker, Session

# <<<<<<< Updated upstream
# DATABASE_URL = "postgresql://postgres:Sowjanya%407@localhost:5432/water_quality_db"
# =======
# DATABASE_URL = "postgresql://postgres:1234@localhost:5432/water_quality_db"
# >>>>>>> Stashed changes

# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# # Dependency to get DB session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # ---------- Helper functions for forgot/reset password ----------
# # Import models here inside functions to avoid circular import

# def get_user_by_email(db: Session, email: str):
#     from models import Users
#     return db.query(Users).filter(Users.email == email).first()

# def update_user_password(db: Session, email: str, new_hashed_password: str):
#     from models import Users
#     user = db.query(Users).filter(Users.email == email).first()
#     if user:
#         user.password = new_hashed_password
#         db.commit()
#         db.refresh(user)   # ✅ important to update SQLAlchemy object
#     return user



from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
