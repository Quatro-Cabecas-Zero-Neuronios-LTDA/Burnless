export type ApiStatus = 'ok' | 'degraded';
export type DatabaseStatus = 'ok' | 'unreachable';

/** Estado de saúde reportado pela API. */
export interface ApiHealth {
  readonly status: ApiStatus;
  readonly database: DatabaseStatus;
}

export function isHealthy(health: ApiHealth): boolean {
  return health.status === 'ok';
}
