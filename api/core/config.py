import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Ma Collection API"
    DATABASE_URL: str = "sqlite+aiosqlite:///./collection.db"
    SECRET_KEY: str = "cle-par-defaut-non-securisee"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "..", ".env"),
        extra="ignore"
    )


settings = Settings()