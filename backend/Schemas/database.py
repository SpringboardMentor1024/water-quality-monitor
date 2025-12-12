from sqlalchemy import create_engine, MetaData

# read from .env or change here (sqlite example)
DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
metadata = MetaData()
