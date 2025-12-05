from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
import os

from app.core.config import settings
from app.core.database import engine
from app.routers import auth, stations, users

# 1. Database Setup Logic
def init_db():
    script_path = "database_setup.sql"
    if os.path.exists(script_path):
        try:
            with open(script_path, "r") as file:
                sql_script = file.read()
            with engine.connect() as connection:
                connection.execute(text(sql_script))
                connection.commit()
                print(f"✅ Startup: executed {script_path} successfully.")
        except Exception as e:
            print(f"❌ Startup Error: Could not run SQL script. Reason: {e}")
    else:
        print(f"⚠️ Startup: {script_path} not found.")

# 2. Lifespan (Startup/Shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 {settings.PROJECT_NAME} is starting...")
    init_db()
    yield
    print(f"🛑 {settings.PROJECT_NAME} is shutting down...")

# 3. Initialize App
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan
)

# 4. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Include Routers (Check this section carefully!)
# Ensure each router is listed exactly ONCE.
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(stations.router)

# 6. Root Endpoint
@app.get("/")
def read_root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs_url": "http://127.0.0.1:8000/docs"
    }