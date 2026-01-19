from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# ---------------------------------
# LOAD ENV
# ---------------------------------
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


DATABASE_URL = os.getenv("DATABASE_URL")
print("USING DATABASE_URL =", DATABASE_URL)

# ---------------------------------
# BASE DIRECTORY
# ---------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------
# DATABASE ENGINE
# ---------------------------------
if not DATABASE_URL:
    DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'water_quality.db')}"
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
