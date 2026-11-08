from dataclasses import dataclass, field
from uuid import UUID, uuid7


@dataclass(eq=False, kw_only=True)
class Entity:
    """Objeto com identidade. Duas entidades são iguais quando têm o mesmo `id`.

    O UUIDv7 é ordenado no tempo, o que é bom para índices no banco.
    """

    id: UUID = field(default_factory=uuid7)

    def __eq__(self, other: object) -> bool:
        return isinstance(other, type(self)) and other.id == self.id

    def __hash__(self) -> int:
        return hash(self.id)
