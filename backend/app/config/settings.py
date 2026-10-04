"""Application settings and configuration"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration."""

    app_name: str = "RAKSHAK Backend"
    app_version: str = "0.1.0"
    debug: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()