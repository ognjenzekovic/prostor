import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../api/errors';

/**
 * Shared query client.
 *
 * Retrying a 404 or a 403 only delays the error screen the user is going to
 * see anyway, so retries are limited to server and network failures.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
