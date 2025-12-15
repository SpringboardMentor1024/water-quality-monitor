import os
from dotenv import load_dotenv

load_dotenv()

# --- Application & Security ---
APP_URL = os.getenv("APP_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

# --- Token Expiration ---
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 60))
RESET_TOKEN_EXPIRE_HOURS = int(os.getenv('RESET_TOKEN_EXPIRE_HOURS', 24))

# --- Database ---
# Fallback to a local SQLite database if DATABASE_URL is not set
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./water_quality.db")

# --- Email SMTP ---
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL")