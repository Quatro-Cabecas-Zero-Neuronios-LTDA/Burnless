from abc import ABC, abstractmethod
from uuid import UUID

from burnless.domain.shared.entity import Entity


class Repository[T: Entity](ABC):
    """Port de persistência de um agregado.

    A interface mora no domínio. A implementação (SQLAlchemy, memória…) fica
    em `infrastructure`. Isso é a inversão de dependência (o D do SOLID).
    """

    @abstractmethod
    async def get(self, entity_id: UUID) -> T | None: ...

    @abstractmethod
    async def add(self, entity: T) -> None: ...

    @abstractmethod
    async def remove(self, entity: T) -> None: ...
