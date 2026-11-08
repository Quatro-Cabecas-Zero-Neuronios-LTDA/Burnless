from fastapi import APIRouter, Response, status
from pydantic import BaseModel

from burnless.presentation.api.dependencies import CheckHealthDep

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: str
    database: str


@router.get(
    "/health",
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"model": HealthResponse}},
)
async def health(use_case: CheckHealthDep, response: Response) -> HealthResponse:
    report = await use_case.execute()
    if not report.healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return HealthResponse(status=report.status, database=report.database)
