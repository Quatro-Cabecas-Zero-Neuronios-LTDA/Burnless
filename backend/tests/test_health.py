import pytest
from fastapi.testclient import TestClient

from burnless.application.health import CheckHealth, DatabaseProbe
from burnless.main import app
from burnless.presentation.api.dependencies import get_check_health


class FakeDatabaseProbe(DatabaseProbe):
    def __init__(self, *, reachable: bool) -> None:
        self._reachable = reachable

    async def is_reachable(self) -> bool:
        return self._reachable


@pytest.fixture
def client_with_database(request: pytest.FixtureRequest) -> TestClient:
    reachable: bool = request.param
    app.dependency_overrides[get_check_health] = lambda: CheckHealth(
        FakeDatabaseProbe(reachable=reachable)
    )
    request.addfinalizer(app.dependency_overrides.clear)
    return TestClient(app)


@pytest.mark.parametrize("client_with_database", [True], indirect=True)
def test_health_ok_when_database_is_reachable(client_with_database: TestClient) -> None:
    response = client_with_database.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


@pytest.mark.parametrize("client_with_database", [False], indirect=True)
def test_health_degraded_when_database_is_down(client_with_database: TestClient) -> None:
    response = client_with_database.get("/api/v1/health")

    assert response.status_code == 503
    assert response.json() == {"status": "degraded", "database": "unreachable"}
