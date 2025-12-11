# backend/main.py
from fastapi import FastAPI
from .database import engine, Base
from . import models  # ensure models are imported so SQLAlchemy can find them
from .routes_auth import router as auth_router
from .routes_stations import router as stations_router
from .routes_sensors import router as sensors_router
from fastapi.middleware.cors import CORSMiddleware

# create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Water Quality Monitor API")

# CORS (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(stations_router)
app.include_router(sensors_router)

@app.get("/")
def root():
    return {"message": "Water Quality Monitor API running"}
