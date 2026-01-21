from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import Base, engine

# =====================================================
# 🔹 IMPORT ALL MODELS (REGISTER SQLALCHEMY METADATA)
# =====================================================
from app.models.user import User
from app.models.station import WaterStation
from app.models.readings import StationReading
from app.models.reports import Report
from app.models.searches import Search
from app.models.alert import Alert
from app.models.ngo import NGO
from app.models.project import Project
from app.models.collaboration import Collaboration

# =====================================================
# 🔹 IMPORT ALL ROUTERS
# =====================================================
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.stations import router as stations_router
from app.routers.reports import router as reports_router
from app.routers.gov import router as gov_router
from app.routers.alerts import router as alerts_router
from app.routers.ngos import router as ngos_router
from app.routers.projects import router as projects_router
from app.routers.collaborations import router as collaborations_router


# =====================================================
# 🔹 APP LIFESPAN (STARTUP / SHUTDOWN)
# =====================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting Water Quality Monitor Backend...")
    Base.metadata.create_all(bind=engine)
    yield
    print("🛑 Shutting down Water Quality Monitor Backend...")


# =====================================================
# 🔹 CREATE FASTAPI APP
# =====================================================
app = FastAPI(
    title="Water Quality Monitor",
    version="1.0.0",
    description="Backend API for Water Quality Monitoring System",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# =====================================================
# 🔥 CORS CONFIGURATION
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# 🔹 REGISTER ROUTERS (ORDER DOES NOT MATTER)
# =====================================================
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(stations_router)   # 👈 IMPORTANT (contains /station/{id}/readings)
app.include_router(reports_router)
app.include_router(gov_router)
app.include_router(alerts_router)
app.include_router(ngos_router)
app.include_router(projects_router)
app.include_router(collaborations_router)

# =====================================================
# 🔹 ROOT ENDPOINT
# =====================================================
@app.get("/")
def root():
    return {
        "message": "Water Quality Monitor Backend is running ✅",
        "swagger_ui": "http://127.0.0.1:8000/docs",
        "redoc": "http://127.0.0.1:8000/redoc",
        "openapi_json": "http://127.0.0.1:8000/openapi.json",
    }
