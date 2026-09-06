/**
 * HTTP client.
 *
 * This is the ONLY place where fetch happens — components go through
 * src/api/*.ts. That single rule is what makes "mocks -> real backend" an env
 * variable instead of a rewrite (spec 4.2).
 *
 * When VITE_USE_MOCKS=true every request is answered by src/mocks instead.
 */
import { ApiError } from './errors';
import { clearTokens, getAccessToken, getRefreshToken, storeTokens } from './tokens';

export { ApiError };

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.srpski-online.rs/api/v1';

/** Paths that must never trigger a refresh — refreshing them would recurse. */
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

/** Artificial mock delay, so loading states are visible and get written (spec 4.3). */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Answers a request from the mock layer.
 *
 * The mock router is imported dynamically so a production build with
 * VITE_USE_MOCKS=false drops this branch and ships no mock data.
 */
async function mockResponse<T>(method: string, path: string, body?: unknown): Promise<T> {
  await sleep(250 + Math.random() * 300);

  // Force an error to check error states, e.g. VITE_MOCK_FAIL=/catalog/products
  if (import.meta.env.VITE_MOCK_FAIL === path) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Forced mock error for testing');
  }

  const { resolveMock } = await import('../mocks');
  return resolveMock<T>(method, path, body);
}

/** Bearer header for the current access token. */
function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * The refresh in flight, if any.
 *
 * Parallel requests that all hit 401 must wait on ONE refresh: firing five
 * refreshes at once makes token rotation invalidate them against each other,
 * and everybody gets logged out (spec 4.5).
 */
let refreshInFlight: Promise<boolean> | null = null;

/**
 * Exchanges the refresh token for a new pair.
 *
 * @returns true when the session was renewed; false means the caller should
 *   surface the original 401 and let the app sign the user out
 */
function refreshSession(): Promise<boolean> {
  refreshInFlight ??= (async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) return false;

    try {
      const renewed = await send<{ accessToken: string; refreshToken: string }>(
        'POST',
        '/auth/refresh',
        { refreshToken }
      );
      storeTokens(renewed.accessToken, renewed.refreshToken);
      return true;
    } catch {
      clearTokens();
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/** One round trip, with no refresh handling — used by request() and by refresh itself. */
async function send<T>(method: string, path: string, body?: unknown): Promise<T> {
  if (USE_MOCKS) {
    return mockResponse<T>(method, path, body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    throw await ApiError.fromResponse(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

/**
 * A request that renews an expired session once and retries.
 *
 * Only 401 TOKEN_EXPIRED is retried. A 401 for any other reason — wrong
 * password, revoked session — is the answer, not a hiccup.
 */
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  try {
    return await send<T>(method, path, body);
  } catch (error) {
    const expired =
      error instanceof ApiError && error.status === 401 && error.code === 'TOKEN_EXPIRED';

    if (!expired || AUTH_PATHS.includes(path)) {
      throw error;
    }

    const renewed = await refreshSession();

    if (!renewed) {
      throw error;
    }

    return send<T>(method, path, body);
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body);
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('PUT', path, body);
}

export async function apiDelete<T>(path: string): Promise<T> {
  return request<T>('DELETE', path);
}
