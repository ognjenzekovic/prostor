import type { components } from './schema';
import { apiGet } from './http';

type ProductPage = components['schemas']['ProductPage'];
type ProductDetail = components['schemas']['ProductDetail'];
type CatalogFilters = components['schemas']['CatalogFilters'];

/**
 * Get list of published products with optional filters.
 *
 * @param params - Query parameters (type, grade, area, examPrep, q, sort, page, size)
 * @returns Paginated product list
 */
export async function getProducts(params?: {
  type?: components['schemas']['ProductType'];
  grade?: components['schemas']['Grade'];
  area?: components['schemas']['SubjectArea'];
  examPrep?: components['schemas']['ExamPrep'];
  q?: string;
  sort?: 'popular' | 'newest' | 'priceAsc' | 'priceDesc';
  page?: number;
  size?: number;
}): Promise<ProductPage> {
  const query = new URLSearchParams();

  if (params?.type) query.set('type', params.type);
  if (params?.grade) query.set('grade', params.grade);
  if (params?.area) query.set('area', params.area);
  if (params?.examPrep) query.set('examPrep', params.examPrep);
  if (params?.q) query.set('q', params.q);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.page !== undefined) query.set('page', String(params.page));
  if (params?.size !== undefined) query.set('size', String(params.size));

  const path = `/catalog/products${query.toString() ? `?${query}` : ''}`;
  return apiGet<ProductPage>(path);
}

/**
 * Get product detail by slug.
 *
 * @param slug - Product slug
 * @returns Product detail with lessons (for COURSE) or included products (for BUNDLE)
 */
export async function getProduct(slug: string): Promise<ProductDetail> {
  return apiGet<ProductDetail>(`/catalog/products/${slug}`);
}

/**
 * Get available filters with product counts.
 *
 * @returns Filter options for grades, areas, and exam prep
 */
export async function getFilters(): Promise<CatalogFilters> {
  return apiGet<CatalogFilters>('/catalog/filters');
}
