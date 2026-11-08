import asyncio

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncEngine

from burnless.application.health.ports import DatabaseProbe

PROBE_TIMEOUT_SECONDS = 2


class SqlAlchemyDatabaseProbe(DatabaseProbe):
    def __init__(self, engine: AsyncEngine) -> None:
        self._engine = engine

    async def is_reachable(self) -> bool:
        try:
            async with asyncio.timeout(PROBE_TIMEOUT_SECONDS), self._engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
        except SQLAlchemyError, OSError:  # OSError cobre conexão recusada, DNS e timeout
            return False
        return True
