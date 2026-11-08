/**
 * Composition root: o único lugar que liga interfaces (ports) a implementações.
 * Para testar ou trocar uma implementação (mock, outra API), basta mudar aqui.
 */
import { CheckApiHealth } from '@/application/health/check-api-health';
import { env } from '@/infrastructure/config/env';
import { FetchHttpClient } from '@/infrastructure/http/http-client';
import { HttpHealthRepository } from '@/infrastructure/repositories/http-health-repository';

const httpClient = new FetchHttpClient(env.apiUrl);
const healthRepository = new HttpHealthRepository(httpClient);

export const container = {
  apiUrl: env.apiUrl,
  checkApiHealth: new CheckApiHealth(healthRepository),
} as const;
