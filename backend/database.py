from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from . import config

# For SQLite, we need to use connect_args to allow multithreading, which is
# necessary for FastAPI's background tasks.
if config.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(config.DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(config.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()