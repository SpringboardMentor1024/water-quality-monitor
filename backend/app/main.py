from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base

# 🔴 IMPORTANT: Import ALL models so SQLAlchemy knows to create their tables
# Update this line to include the new files we created (readings, reports, searches)
from app.models import user, station, readings, reports, searches

# 🔵 Import the new routers
# Ensure you have created these files in 'app/routers/'
from app.routers import auth, stations, users, reports, gov 

# 🔹 Lifespan: create tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 {settings.PROJECT_NAME} is starting...")

    # ✅ CREATE ALL TABLES (This will now create Reports, Readings, Searches too)
    Base.metadata.create_all(bind=engine)

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
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(stations.router)

# ✅ Register the new routers here
app.include_router(reports.router)  # For User Reports
app.include_router(gov.router)      # For External Government Data (EPA, WHO, CPCB)

# 🔹 Root endpoint
@app.get("/")   
def read_root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs_url": "http://127.0.0.1:8000/docs"
    }