from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from burnless.infrastructure.config.settings import get_settings
from burnless.infrastructure.database.session import get_engine
from burnless.presentation.api.router import api_router


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield
    await get_engine().dispose()


def create_app() -> FastAPI:
    settings = get_settings()
    docs_enabled = not settings.is_production

    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
        docs_url="/docs" if docs_enabled else None,
        redoc_url=None,
        openapi_url="/openapi.json" if docs_enabled else None,
    )
    app.include_router(api_router)
    return app


app = create_app()
