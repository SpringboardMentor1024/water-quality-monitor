

# from pydantic_settings import BaseSettings

# class Settings(BaseSettings):
#     DATABASE_URL: str = "postgresql://postgres:1234@localhost:5432/water_quality_db"
#     JWT_SECRET_KEY: str = "your_secret_key"
#     JWT_ALGORITHM: str = "HS256"
#     ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
#     CORS_ORIGINS: list[str] = ["*"]  # ADD THIS
#     # 🔹 Email settings (just declared, not used yet)
#     MAIL_USERNAME: str
#     MAIL_PASSWORD: str
#     MAIL_FROM: str
#     MAIL_PORT: int
#     MAIL_SERVER: str
#     MAIL_TLS: bool
#     MAIL_SSL: bool

#     class Config:
#         env_file = ".env"

# settings = Settings()



from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    CORS_ORIGINS: list[str] = ["*"]

    # Email (fastapi-mail compatible)
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool

    class Config:
        env_file = ".env"

settings = Settings()


