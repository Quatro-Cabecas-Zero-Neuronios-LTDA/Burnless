import type { ApiHealth } from './api-health';

/** Port: de onde vem o estado de saúde da API. A implementação fica em `infrastructure`. */
export interface HealthRepository {
  check(): Promise<ApiHealth>;
}
