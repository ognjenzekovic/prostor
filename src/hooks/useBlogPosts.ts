import { useQuery } from '@tanstack/react-query';
import { getBlogPosts } from '../api/blog';

type BlogParams = Parameters<typeof getBlogPosts>[0];

/** Blog listing; the params object doubles as the cache key. */
export function useBlogPosts(params?: BlogParams) {
  return useQuery({
    queryKey: ['blogPosts', params ?? {}],
    queryFn: () => getBlogPosts(params),
  });
}
