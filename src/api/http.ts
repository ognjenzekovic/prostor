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

export { ApiError };

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.srpski-online.rs/api/v1';

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
async function mockResponse<T>(path: string): Promise<T> {
  await sleep(250 + Math.random() * 300);

  // Force an error to check error states, e.g. VITE_MOCK_FAIL=/catalog/products
  if (import.meta.env.VITE_MOCK_FAIL === path) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Forced mock error for testing');
  }

  const { resolveMock } = await import('../mocks');
  return resolveMock<T>(path);
}

/**
 * Sends a real request and unwraps the response.
 *
 * TODO: intercept 401 TOKEN_EXPIRED -> /auth/refresh -> retry, with a promise
 * lock so parallel requests wait on one refresh (spec 4.5).
 */
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
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
 * Bearer token header.
 *
 * TODO: sessionStorage is the phase 1 choice — it dies with the tab, which is
 * bad UX but keeps the token out of long-lived storage until we decide.
 */
function authHeaders(): Record<string, string> {
  const token = sessionStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  return USE_MOCKS ? mockResponse<T>(path) : request<T>('GET', path);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return USE_MOCKS ? mockResponse<T>(path) : request<T>('POST', path, body);
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return USE_MOCKS ? mockResponse<T>(path) : request<T>('PUT', path, body);
}

export async function apiDelete<T>(path: string): Promise<T> {
  return USE_MOCKS ? mockResponse<T>(path) : request<T>('DELETE', path);
}
