import type { ApiHealth } from '@/domain/health/api-health';
import type { HealthRepository } from '@/domain/health/health-repository';
import { HttpError, type HttpClient } from '@/infrastructure/http/http-client';

function toApiHealth(body: unknown): ApiHealth {
  if (
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    'database' in body &&
    (body.status === 'ok' || body.status === 'degraded') &&
    (body.database === 'ok' || body.database === 'unreachable')
  ) {
    return { status: body.status, database: body.database };
  }
  throw new Error('Resposta inesperada de /health');
}

export class HttpHealthRepository implements HealthRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async check(): Promise<ApiHealth> {
    try {
      return toApiHealth(await this.http.get('/api/v1/health'));
    } catch (error) {
      // 503 também traz o corpo com o detalhe ("degraded").
      if (error instanceof HttpError && error.status === 503) return toApiHealth(error.body);
      throw error;
    }
  }
}
