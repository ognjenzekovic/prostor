/**
 * Transport-level error carrying the API's `code`.
 *
 * Lives apart from http.ts so the mock router can throw it without importing
 * the client that imports the mock router.
 *
 * TODO: lib/errors.ts maps `code` -> localized message, with the response
 * `title` as fallback (spec 4.7).
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
