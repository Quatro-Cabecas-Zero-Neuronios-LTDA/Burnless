from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class ValueObject:
    """Objeto sem identidade, imutável, com igualdade por valor.

    As subclasses também devem usar `@dataclass(frozen=True, slots=True)` e
    validar invariantes em `__post_init__`, levantando `DomainError`.
    """
