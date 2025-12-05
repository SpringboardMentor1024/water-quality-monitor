import os
from dotenv import load_dotenv

# Load the .env file immediately
load_dotenv()

class Settings:
    # General Project Info
    PROJECT_NAME: str = "Water Quality Monitor"
    PROJECT_VERSION: str = "1.0.0"

    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # Security Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256") 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Create a single instance of settings
settings = Settings()