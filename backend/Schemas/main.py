from fastapi import FastAPI
from schemas.routes import users  # import routes

app = FastAPI(title="Water Quality Monitor - Backend")

# include routes
app.include_router(users.router, prefix="/users", tags=["users"])

@app.get("/")
def read_root():
    return {"message": "Hello from Water Quality Backend"}

