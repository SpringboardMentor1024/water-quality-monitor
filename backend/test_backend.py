from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI(title="Water Quality Monitor API")

# Allow ALL origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ALLOW EVERYTHING
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
async def login(login_data: LoginRequest):
    print(f"LOGIN ATTEMPT: {login_data.email}")
    return {
        "access_token": f"test_token_{login_data.email}",
        "token_type": "bearer",
        "user": {
            "email": login_data.email,
            "full_name": "Test User",
            "role": "user"
        }
    }

@app.get("/api/auth/me")
async def get_current_user(request: Request):
    # Get token from header
    auth_header = request.headers.get("Authorization")
    print(f"AUTH HEADER: {auth_header}")
    
    return {
        "email": "test@example.com",
        "full_name": "Test User",
        "role": "user"
    }

@app.get("/")
async def root():
    return {"message": "Backend is running!"}
