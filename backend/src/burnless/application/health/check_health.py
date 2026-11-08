from dataclasses import dataclass
from typing import Literal

from burnless.application.health.ports import DatabaseProbe
from burnless.application.shared.use_case import UseCase


@dataclass(frozen=True, slots=True)
class HealthReport:
    status: Literal["ok", "degraded"]
    database: Literal["ok", "unreachable"]

    @property
    def healthy(self) -> bool:
        return self.status == "ok"


class CheckHealth(UseCase[None, HealthReport]):
    def __init__(self, database: DatabaseProbe) -> None:
        self._database = database

    async def execute(self, data: None = None) -> HealthReport:
        if await self._database.is_reachable():
            return HealthReport(status="ok", database="ok")
        return HealthReport(status="degraded", database="unreachable")
