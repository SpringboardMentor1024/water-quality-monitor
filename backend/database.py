from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# ---------------------------------
# DATABASE ENGINE
# ---------------------------------
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./water_quality.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# ---------------------------------
# SESSION & BASE
# ---------------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# ---------------------------------
# DB DEPENDENCY
# ---------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
