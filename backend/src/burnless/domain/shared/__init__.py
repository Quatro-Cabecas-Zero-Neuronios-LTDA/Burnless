"""Shared kernel do domínio: blocos de construção usados por todos os contextos."""

from burnless.domain.shared.entity import Entity
from burnless.domain.shared.exceptions import DomainError, NotFoundError
from burnless.domain.shared.repository import Repository
from burnless.domain.shared.value_object import ValueObject

__all__ = ["DomainError", "Entity", "NotFoundError", "Repository", "ValueObject"]
