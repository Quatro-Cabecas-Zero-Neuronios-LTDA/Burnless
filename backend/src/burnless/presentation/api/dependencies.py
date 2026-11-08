"""Composition root: o único ponto em que a presentation conhece a infrastructure.

É aqui que cada port (interface) é ligado à sua implementação concreta. Nos
testes, basta sobrescrever estas funções com `app.dependency_overrides`.
"""

from typing import Annotated

from fastapi import Depends

from burnless.application.health import CheckHealth
from burnless.infrastructure.database.probe import SqlAlchemyDatabaseProbe
from burnless.infrastructure.database.session import get_engine


def get_check_health() -> CheckHealth:
    return CheckHealth(database=SqlAlchemyDatabaseProbe(get_engine()))


CheckHealthDep = Annotated[CheckHealth, Depends(get_check_health)]
