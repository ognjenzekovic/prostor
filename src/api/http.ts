/**
 * HTTP client with mock layer support.
 *
 * When VITE_USE_MOCKS=true, intercepts requests and returns mock data.
 * This is the ONLY place where fetch happens. Components never call fetch directly.
 */

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.srpski-online.rs/api/v1';

/**
 * API error with code for i18n mapping.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public detail?: string,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(detail || code);
    this.name = 'ApiError';
  }

  static async fromResponse(res: Response): Promise<ApiError> {
    try {
      const problem = await res.json();
      return new ApiError(
        res.status,
        problem.code || 'UNKNOWN_ERROR',
        problem.detail || problem.title,
        problem.errors
      );
    } catch {
      return new ApiError(res.status, 'NETWORK_ERROR', res.statusText);
    }
  }
}

/**
 * Sleep utility for mock artificial delay (250-550ms).
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Resolve mock data for a given path.
 */
function resolveMock<T>(path: string): T {
  // Remove query string for routing
  const [pathname] = path.split('?');

  // Catalog endpoints
  if (pathname === '/catalog/products') {
    return import('../mocks/products.json').then((m) => m.default) as T;
  }

  if (pathname.startsWith('/catalog/products/')) {
    const slug = pathname.replace('/catalog/products/', '');
    return import('../mocks/products.json').then((m) => {
      const product = m.default.content.find((p: { slug: string }) => p.slug === slug);
      if (!product) {
        throw new ApiError(404, 'PRODUCT_NOT_FOUND', `Product with slug "${slug}" not found`);
      }
      return product;
    }) as T;
  }

  if (pathname === '/catalog/filters') {
    // Generate filters from products.json
    return import('../mocks/products.json').then((m) => {
      const products = m.default.content;
      const grades = new Map<string, number>();
      const areas = new Map<string, number>();
      const examPrep = new Map<string, number>();

      products.forEach((p: { grades?: string[]; areas?: string[]; examPrep?: string }) => {
        p.grades?.forEach((g) => grades.set(g, (grades.get(g) || 0) + 1));
        p.areas?.forEach((a) => areas.set(a, (areas.get(a) || 0) + 1));
        if (p.examPrep) examPrep.set(p.examPrep, (examPrep.get(p.examPrep) || 0) + 1);
      });

      return {
        grades: Array.from(grades.entries()).map(([value, count]) => ({
          value,
          label: value,
          count,
        })),
        areas: Array.from(areas.entries()).map(([value, count]) => ({
          value,
          label: value,
          count,
        })),
        examPrep: Array.from(examPrep.entries()).map(([value, count]) => ({
          value,
          label: value,
          count,
        })),
      };
    }) as T;
  }

  throw new ApiError(404, 'MOCK_NOT_FOUND', `No mock data for ${path}`);
}

/**
 * GET request with mock layer support.
 */
export async function apiGet<T>(path: string): Promise<T> {
  if (USE_MOCKS) {
    // Artificial delay to see loading states (250-550ms)
    await sleep(250 + Math.random() * 300);

    // Allow forcing errors via env variable (e.g., VITE_MOCK_FAIL=/catalog/products)
    if (import.meta.env.VITE_MOCK_FAIL === path) {
      throw new ApiError(500, 'INTERNAL_ERROR', 'Forced mock error for testing');
    }

    return resolveMock<T>(path);
  }

  // Real API call (not used in Phase 1)
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw await ApiError.fromResponse(res);
  }

  return res.json();
}

/**
 * POST request with mock layer support.
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  if (USE_MOCKS) {
    await sleep(250 + Math.random() * 300);

    if (import.meta.env.VITE_MOCK_FAIL === path) {
      throw new ApiError(500, 'INTERNAL_ERROR', 'Forced mock error for testing');
    }

    return resolveMock<T>(path);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw await ApiError.fromResponse(res);
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

/**
 * PUT request with mock layer support.
 */
export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  if (USE_MOCKS) {
    await sleep(250 + Math.random() * 300);

    if (import.meta.env.VITE_MOCK_FAIL === path) {
      throw new ApiError(500, 'INTERNAL_ERROR', 'Forced mock error for testing');
    }

    return resolveMock<T>(path);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
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
 * DELETE request with mock layer support.
 */
export async function apiDelete<T>(path: string): Promise<T> {
  if (USE_MOCKS) {
    await sleep(250 + Math.random() * 300);

    if (import.meta.env.VITE_MOCK_FAIL === path) {
      throw new ApiError(500, 'INTERNAL_ERROR', 'Forced mock error for testing');
    }

    return resolveMock<T>(path);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
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
 * Get auth headers (Bearer token from sessionStorage).
 * TODO: Token refresh logic (401 -> /auth/refresh -> retry original request).
 */
function getAuthHeaders(): Record<string, string> {
  const token = sessionStorage.getItem('accessToken');

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
