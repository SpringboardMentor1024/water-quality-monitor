# backend/config.py
from datetime import timedelta
import os

SECRET_KEY = os.getenv("SECRET_KEY", "change_this_to_a_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
