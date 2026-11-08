from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

# Nomes de constraints previsíveis, para as migrações do Alembic ficarem estáveis.
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    """Base dos modelos ORM.

    Os modelos ORM são detalhe de infraestrutura e ficam separados das entidades
    do domínio. Os repositórios fazem o mapeamento entre os dois.
    """

    metadata = MetaData(naming_convention=NAMING_CONVENTION)
