from fastapi import FastAPI
from database import Base, engine
from routers import user, waterstation

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(user.router)
app.include_router(waterstation.router)

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}
