from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base

# Import models individually
from app.models.station import WaterStation
from app.models.user import User
from app.models.readings import StationReading, WaterQuality2011

# Direct router import
from app.routers.stations import router as stations_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 {settings.PROJECT_NAME} is starting...")
    Base.metadata.create_all(bind=engine)
    yield
    print(f"🛑 {settings.PROJECT_NAME} is shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(stations_router)

@app.get("/")
def read_root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs_url": "http://127.0.0.1:8000/docs",
    }