from abc import ABC, abstractmethod


class DatabaseProbe(ABC):
    """Port: verifica se o banco de dados responde."""

    @abstractmethod
    async def is_reachable(self) -> bool: ...
