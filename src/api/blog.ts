import type { components } from './schema';
import { apiGet } from './http';

type BlogPostPage = components['schemas']['BlogPostPage'];
type BlogPostDetail = components['schemas']['BlogPostDetail'];

/**
 * Get published blog posts.
 *
 * The blog is the main SEO channel, so posts carry the same grade and area
 * tags as products and can be filtered by them.
 *
 * @param params - Query parameters (grade, area, tag, page, size)
 */
export async function getBlogPosts(params?: {
  grade?: components['schemas']['Grade'];
  area?: components['schemas']['SubjectArea'];
  tag?: string;
  page?: number;
  size?: number;
}): Promise<BlogPostPage> {
  const query = new URLSearchParams();

  if (params?.grade) query.set('grade', params.grade);
  if (params?.area) query.set('area', params.area);
  if (params?.tag) query.set('tag', params.tag);
  if (params?.page !== undefined) query.set('page', String(params.page));
  if (params?.size !== undefined) query.set('size', String(params.size));

  return apiGet<BlogPostPage>(`/blog/posts${query.toString() ? `?${query}` : ''}`);
}

/**
 * Get one post by slug.
 *
 * @param slug - Post slug
 */
export async function getBlogPost(slug: string): Promise<BlogPostDetail> {
  return apiGet<BlogPostDetail>(`/blog/posts/${slug}`);
}
