# from fastapi import FastAPI
# from database import Base, engine
# from routers import user, waterstation

# app = FastAPI()

# # Create tables
# Base.metadata.create_all(bind=engine)

# # Include routers
# app.include_router(user.router)
# app.include_router(waterstation.router)

# @app.get("/")
# def read_root():
#     return {"message": "Backend is running!"}

from routers import password_reset


from fastapi import FastAPI
from database import Base, engine
from config import settings
from routers import auth, user, waterstation   # ensure routers package is importable
from fastapi.middleware.cors import CORSMiddleware

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Water Quality Monitor API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(waterstation.router)

app.include_router(password_reset.router)


@app.get("/")
def read_root():
    return {"message": "Backend is running!"}
