from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuração lida de variáveis de ambiente (ou do arquivo .env)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Burnless API"
    app_env: Literal["development", "test", "production"] = "development"
    database_url: str = "postgresql+asyncpg://burnless:burnless@localhost:5432/burnless"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
