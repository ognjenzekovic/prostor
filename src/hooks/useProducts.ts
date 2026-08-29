import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/catalog';

type ProductParams = Parameters<typeof getProducts>[0];

/**
 * Catalog listing.
 *
 * The params object is the query key, so a different filter or page is a
 * different cache entry and going back to a page the reader already saw is
 * instant. Retry policy lives in app/queryClient.ts.
 */
export function useProducts(params?: ProductParams) {
  return useQuery({
    queryKey: ['products', params ?? {}],
    queryFn: () => getProducts(params),
  });
}
