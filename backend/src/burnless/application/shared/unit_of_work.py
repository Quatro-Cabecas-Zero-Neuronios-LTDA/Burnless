from abc import ABC, abstractmethod
from types import TracebackType
from typing import Self


class UnitOfWork(ABC):
    """Delimita uma transação atômica de um caso de uso.

    Uso:
        async with uow:
            ...
            await uow.commit()

    Sem `commit()` explícito, ou se ocorrer uma exceção, a transação é desfeita.
    """

    async def __aenter__(self) -> Self:
        return self

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        await self.rollback()

    @abstractmethod
    async def commit(self) -> None: ...

    @abstractmethod
    async def rollback(self) -> None: ...
