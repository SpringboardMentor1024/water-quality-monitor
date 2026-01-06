from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base

# 1. 🟢 IMPORT MODELS (Add 'alerts')
# This ensures SQLAlchemy creates the 'alerts' table on startup
from app.models import user, station, readings, reports, searches, alert

# 2. 🟢 IMPORT ROUTER (Add 'alerts')
from app.routers import auth, stations, users, reports, gov, alerts

from app.core.scheduler import start_scheduler, fetch_initial_data

# 🔹 Lifespan: create tables & start scheduler on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 {settings.PROJECT_NAME} is starting...")

    # 1. Create Tables
    # Since you added 'alerts' to the imports above, this line will now 
    # automatically create the "alerts" table in your database.
    Base.metadata.create_all(bind=engine)
    
    # 2. FORCE IMMEDIATE SYNC
    await fetch_initial_data()
    
    # 3. Start the Background Scheduler
    start_scheduler()

    yield
    print(f"🛑 {settings.PROJECT_NAME} is shutting down...")


# 🔹 Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan
)

# 🔹 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Register Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(stations.router)
app.include_router(reports.router)
app.include_router(gov.router)
app.include_router(alerts.router)  # 3. 🟢 REGISTER ROUTER (Enable the API)

# 🔹 Root endpoint
@app.get("/")
def read_root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs_url": "http://127.0.0.1:8000/docs",
        "scheduler_status": "Running 24/7 in background"
    }