ARG PYTHON_VERSION=3.15

# ---------------------------------------------------------------- base
FROM python:${PYTHON_VERSION}-slim-trixie AS base
COPY --from=ghcr.io/astral-sh/uv:0.13.7 /uv /uvx /bin/
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_LINK_MODE=copy \
    UV_NO_CACHE=1 \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/opt/venv \
    PATH="/opt/venv/bin:$PATH"
WORKDIR /app

# ----------------------------------------------------------------- dev
# O código entra por bind mount (docker-compose.yml). O venv fica em /opt/venv
# para não ser escondido pelo volume. Roda com o UID/GID do host para os arquivos
# criados no bind mount (uv.lock, caches) não ficarem com dono root.
FROM base AS dev
ARG UID=1000
ARG GID=1000
RUN groupadd --gid ${GID} dev \
    && useradd --uid ${UID} --gid ${GID} --create-home dev \
    && mkdir -p /opt/venv \
    && chown dev:dev /opt/venv /app
USER dev
COPY --chown=dev:dev pyproject.toml uv.lock* ./
RUN uv sync --no-install-project
COPY --chown=dev:dev . .
RUN uv sync
EXPOSE 8000
CMD ["uvicorn", "burnless.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "src"]

# ------------------------------------------------------------- builder
FROM base AS builder
ENV UV_COMPILE_BYTECODE=1
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --no-install-project
COPY src ./src
RUN uv sync --locked --no-dev --no-editable

# ---------------------------------------------------------------- prod
FROM python:${PYTHON_VERSION}-slim-trixie AS prod
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"
RUN groupadd --system app && useradd --system --gid app --home-dir /app app
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
COPY alembic.ini ./
COPY alembic ./alembic
USER app
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["python", "-c", "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/api/v1/health', timeout=4).status == 200 else 1)"]
CMD ["uvicorn", "burnless.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--proxy-headers", "--no-server-header"]
