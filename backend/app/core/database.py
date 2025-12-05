from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# 1. Create the Database Engine
# We use the URL loaded in settings (from your .env file)
engine = create_engine(settings.DATABASE_URL)

# 2. Create the SessionLocal class
# This acts as a factory. Every time a user requests data, 
# we use this to create a temporary "session" (connection) to the DB.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Create the Base class
# All your database models (User, WaterStation) will inherit from this class
# so SQLAlchemy knows they are tables.
Base = declarative_base()

# 4. Dependency
# This function is used in your API routers (endpoints).
# It opens a database session, lets the API use it, and guarantees it closes afterwards.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()