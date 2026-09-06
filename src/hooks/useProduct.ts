import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../api/catalog';

/**
 * Course or bundle detail by slug.
 *
 * A 404 is a normal outcome here — an old link, a renamed slug — so the page
 * tells those apart from a failed request instead of showing "try again" for
 * something retrying will never fix.
 */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug),
  });
}
