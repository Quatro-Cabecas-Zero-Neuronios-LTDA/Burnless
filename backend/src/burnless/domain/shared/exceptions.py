class DomainError(Exception):
    """Violação de uma regra de negócio."""


class NotFoundError(DomainError):
    """Entidade ou agregado não encontrado."""
