from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ATM Banking API"
    database_url: str = Field(default=f"sqlite:///{Path('atm.db').resolve()}")
    log_level: str = "INFO"
    cors_origins: list[str] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    ]

    model_config = SettingsConfigDict(env_file=".env", env_prefix="ATM_")


@lru_cache
def get_settings() -> Settings:
    return Settings()