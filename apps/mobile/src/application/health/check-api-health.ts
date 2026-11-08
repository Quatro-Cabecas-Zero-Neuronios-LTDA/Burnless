import { isHealthy } from '@/domain/health/api-health';
import type { HealthRepository } from '@/domain/health/health-repository';

/** online: tudo ok · degraded: API responde, mas algo por trás falhou · offline: sem resposta */
export type ApiConnectivity = 'online' | 'degraded' | 'offline';

export class CheckApiHealth {
  private readonly repository: HealthRepository;

  constructor(repository: HealthRepository) {
    this.repository = repository;
  }

  async execute(): Promise<ApiConnectivity> {
    try {
      const health = await this.repository.check();
      return isHealthy(health) ? 'online' : 'degraded';
    } catch {
      return 'offline';
    }
  }
}
