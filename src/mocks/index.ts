import type { components } from '../api/schema';
import { ApiError } from '../api/errors';
import productsPage from './products.json';
import productDetails from './product-details.json';
import instructors from './instructors.json';
import * as cart from './cart';
import * as auth from './auth';
import blogPosts from './blog-posts.json';

/**
 * Mock router — the fake backend for phase 1 (spec 4.2, 4.3).
 *
 * http.ts calls resolveMock() when VITE_USE_MOCKS=true; nothing else imports
 * this file. Shapes must match openapi.yaml exactly, because a mock that
 * invents a field turns phase 3 into a rewrite of every component.
 */

type ProductSummary = components['schemas']['ProductSummary'];
type ProductDetail = components['schemas']['ProductDetail'];
type ProductPage = components['schemas']['ProductPage'];
type InstructorSummary = components['schemas']['InstructorSummary'];
type BlogPostPage = components['schemas']['BlogPostPage'];
type BlogPostSummary = components['schemas']['BlogPostSummary'];
type Grade = components['schemas']['Grade'];
type SubjectArea = components['schemas']['SubjectArea'];

/**
 * The extra fields a detail response carries on top of the summary.
 *
 * `includedProductSlugs` is the only thing here that is not in the contract:
 * it keeps the mock file readable, and gets resolved into real
 * `includedProducts` before the response leaves this module.
 */
type DetailSource = Omit<ProductDetail, keyof ProductSummary> & {
  includedProductSlugs?: string[];
};

const ALL_PRODUCTS = productsPage.content as ProductSummary[];

/**
 * `owned` is per-caller by contract — "true samo ako je zahtev autentifikovan
 * i korisnik ima pristup" — so it is stamped on the way out rather than stored
 * with the product.
 */
function withOwnership<T extends ProductSummary>(product: T): T {
  return { ...product, owned: auth.currentEntitlements().includes(product.slug) };
}
const DETAILS = productDetails as unknown as Record<string, DetailSource>;
const ALL_INSTRUCTORS = instructors as InstructorSummary[];
const ALL_POSTS = (blogPosts.content ?? []) as BlogPostSummary[];
const DEFAULT_SIZE = 12;

type MockContext = { path: string; query: URLSearchParams; body: unknown };
type MockHandler = (context: MockContext) => unknown;

/** Keyed by "METHOD /path"; checked before the prefix table. */
const EXACT: Record<string, MockHandler> = {
  'GET /catalog/products': ({ query }) => listProducts(query),
  'GET /catalog/filters': () => buildFilters(),
  'GET /catalog/instructors': () => ALL_INSTRUCTORS,
  'GET /blog/posts': ({ query }) => listBlogPosts(query),

  'GET /cart': () => cart.getCart(),
  'DELETE /cart': () => cart.clearCart(),
  'POST /cart/items': ({ body }) => cart.addItem((body as { productId: string }).productId),
  'POST /cart/coupon': ({ body }) => cart.applyCoupon((body as { code: string }).code),
  'DELETE /cart/coupon': () => cart.removeCoupon(),

  'POST /auth/login': ({ body }) => auth.login(body as never),
  'POST /auth/register': ({ body }) => auth.register(body as never),
  'POST /auth/refresh': ({ body }) => auth.refresh((body as { refreshToken: string }).refreshToken),
  'POST /auth/logout': () => undefined,
  'POST /auth/password-reset/request': () => undefined,
  'GET /auth/me': () => auth.me(),
};

/** Prefix handlers for paths that carry an id or slug. */
const PREFIXED: Array<{ method: string; prefix: string; handle: MockHandler }> = [
  {
    method: 'GET',
    prefix: '/catalog/products/',
    handle: ({ path }) => getProductDetail(path.slice('/catalog/products/'.length)),
  },
  {
    method: 'GET',
    prefix: '/catalog/instructors/',
    handle: ({ path }) => getInstructorDetail(path.slice('/catalog/instructors/'.length)),
  },
  {
    method: 'DELETE',
    prefix: '/cart/items/',
    handle: ({ path }) => cart.removeItem(path.slice('/cart/items/'.length)),
  },
];

/**
 * GET /catalog/instructors/{slug}.
 *
 * The instructor's programmes are derived from the areas they teach, so the
 * profile cannot list a course the catalogue does not have.
 */
function getInstructorDetail(slug: string) {
  const instructor = ALL_INSTRUCTORS.find((candidate) => candidate.slug === slug);

  if (!instructor) {
    throw new ApiError(404, 'INSTRUCTOR_NOT_FOUND', `Nema mentora sa slug-om "${slug}"`);
  }

  return {
    ...instructor,
    products: ALL_PRODUCTS.filter((product) =>
      product.areas?.some((area) => instructor.areas?.includes(area))
    ).map(withOwnership),
  };
}

/** GET /blog/posts — newest first, then sliced into a page. */
function listBlogPosts(query: URLSearchParams): BlogPostPage {
  const area = query.get('area');
  const grade = query.get('grade');

  const matched = [...ALL_POSTS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .filter((post) => {
      if (area && !post.areas?.includes(area as SubjectArea)) return false;
      if (grade && !post.grades?.includes(grade as Grade)) return false;
      return true;
    });

  const size = Number(query.get('size')) || DEFAULT_SIZE;
  const page = Number(query.get('page')) || 0;
  const start = page * size;

  return {
    content: matched.slice(start, start + size),
    page,
    size,
    totalElements: matched.length,
    totalPages: Math.ceil(matched.length / size),
  };
}

/**
 * GET /catalog/products/{slug} — summary plus the detail-only fields.
 *
 * A COURSE carries `lessons`, a BUNDLE carries `includedProducts`; both come
 * from the same file so lesson counts and durations cannot drift apart from
 * the summary the catalog card shows.
 */
function getProductDetail(slug: string): ProductDetail {
  const summary = ALL_PRODUCTS.find((product) => product.slug === slug);

  if (!summary) {
    throw new ApiError(404, 'PRODUCT_NOT_FOUND', `Nema proizvoda sa slug-om "${slug}"`);
  }

  const { includedProductSlugs, ...detail } = DETAILS[slug] ?? {};

  return {
    ...withOwnership(summary),
    ...detail,
    ...(includedProductSlugs && {
      includedProducts: includedProductSlugs.flatMap((included) =>
        ALL_PRODUCTS.filter((product) => product.slug === included).map(withOwnership)
      ),
    }),
  };
}

/** Case-insensitive, diacritic-tolerant enough for a mock search box. */
function matchesQuery(product: ProductSummary, q: string): boolean {
  const haystack = `${product.title} ${product.shortDescription ?? ''}`.toLowerCase();
  return haystack.includes(q.toLowerCase());
}

/**
 * Sorting.
 *
 * Number(amount) is safe here and only here: this stands in for the server,
 * which is the side allowed to do arithmetic on money (spec 4.5a).
 * ProductSummary carries no timestamp, so 'newest' is the reverse of the file
 * order — the real endpoint sorts by createdAt.
 */
function sortProducts(products: ProductSummary[], sort: string | null): ProductSummary[] {
  switch (sort) {
    case 'priceAsc':
      return [...products].sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
    case 'priceDesc':
      return [...products].sort((a, b) => Number(b.price.amount) - Number(a.price.amount));
    case 'newest':
      return [...products].reverse();
    default:
      return products;
  }
}

/** GET /catalog/products — filter, sort, then slice into a page. */
function listProducts(query: URLSearchParams): ProductPage {
  const type = query.get('type');
  const grade = query.get('grade');
  const area = query.get('area');
  const examPrep = query.get('examPrep');
  const q = query.get('q');

  const matched = ALL_PRODUCTS.filter((product) => {
    if (type && product.type !== type) return false;
    if (grade && !product.grades?.includes(grade as Grade)) return false;
    if (area && !product.areas?.includes(area as SubjectArea)) return false;
    if (examPrep && product.examPrep !== examPrep) return false;
    if (q && !matchesQuery(product, q)) return false;
    return true;
  });

  const sorted = sortProducts(matched, query.get('sort'));
  const size = Number(query.get('size')) || DEFAULT_SIZE;
  const page = Number(query.get('page')) || 0;
  const start = page * size;

  return {
    content: sorted.slice(start, start + size).map(withOwnership),
    page,
    size,
    totalElements: sorted.length,
    // 0 when nothing matched, the way a Spring Page reports it.
    totalPages: Math.ceil(sorted.length / size),
  };
}

/**
 * Builds /catalog/filters from the product list, so counts stay in sync with
 * the mock catalog instead of being a second thing to keep updated.
 *
 * TODO: labels are the raw enum values (OS_7, PRAVOPIS). The real endpoint
 * sends display labels; the filter panel needs them translated.
 */
function buildFilters() {
  const grades = new Map<string, number>();
  const areas = new Map<string, number>();
  const examPrep = new Map<string, number>();

  for (const product of ALL_PRODUCTS) {
    product.grades?.forEach((g) => grades.set(g, (grades.get(g) ?? 0) + 1));
    product.areas?.forEach((a) => areas.set(a, (areas.get(a) ?? 0) + 1));
    if (product.examPrep) examPrep.set(product.examPrep, (examPrep.get(product.examPrep) ?? 0) + 1);
  }

  const toOptions = (counts: Map<string, number>) =>
    Array.from(counts, ([value, count]) => ({ value, label: value, count }));

  return {
    grades: toOptions(grades),
    areas: toOptions(areas),
    examPrep: toOptions(examPrep),
  };
}

/**
 * Resolves a mock response for an API call.
 *
 * TODO: error mocks still missing for expired access on playback (spec 4.3).
 *
 * @param method - HTTP method, uppercase
 * @param path - API path with query string, e.g. '/catalog/products?grade=OS_7'
 * @param body - Parsed request body, for POST and PUT
 * @throws ApiError - 404 for unknown routes, so a typo shows up as an error state
 */
export function resolveMock<T>(method: string, path: string, body?: unknown): T {
  const [pathname, search = ''] = path.split('?');
  const context: MockContext = { path: pathname, query: new URLSearchParams(search), body };

  const exact = EXACT[`${method} ${pathname}`];
  if (exact) {
    return exact(context) as T;
  }

  const prefixed = PREFIXED.find(
    (entry) => entry.method === method && pathname.startsWith(entry.prefix)
  );
  if (prefixed) {
    return prefixed.handle(context) as T;
  }

  throw new ApiError(404, 'MOCK_NOT_FOUND', `Nema mock podataka za ${method} ${path}`);
}
