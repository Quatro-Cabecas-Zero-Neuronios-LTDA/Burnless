export class HttpError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

export interface HttpClient {
  get(path: string): Promise<unknown>;
}

const DEFAULT_TIMEOUT_MS = 5000;

/** Cliente HTTP sobre `fetch`. Respostas fora de 2xx viram `HttpError`. */
export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(baseUrl: string, timeoutMs = DEFAULT_TIMEOUT_MS) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.timeoutMs = timeoutMs;
  }

  async get(path: string): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new HttpError(response.status, body);
      return body;
    } finally {
      clearTimeout(timer);
    }
  }
}
