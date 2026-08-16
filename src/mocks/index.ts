import { ApiError } from '../api/errors';
import productsPage from './products.json';

/**
 * Mock router — the fake backend for phase 1 (spec 4.2, 4.3).
 *
 * http.ts calls resolveMock() when VITE_USE_MOCKS=true; nothing else imports
 * this file. Shapes must match openapi.yaml exactly, because a mock that
 * invents a field turns phase 3 into a rewrite of every component.
 */

type MockHandler = (path: string, query: URLSearchParams) => unknown;

/** Exact-path handlers, checked before the prefix ones. */
const EXACT: Record<string, MockHandler> = {
  '/catalog/products': () => productsPage,
  '/catalog/filters': () => buildFilters(),
};

/** Prefix handlers for paths that carry an id or slug. */
const PREFIXED: Array<{ prefix: string; handle: MockHandler }> = [
  {
    prefix: '/catalog/products/',
    handle: (path) => {
      const slug = path.slice('/catalog/products/'.length);
      const product = productsPage.content.find((p) => p.slug === slug);

      if (!product) {
        throw new ApiError(404, 'PRODUCT_NOT_FOUND', `Nema proizvoda sa slug-om "${slug}"`);
      }

      return product;
    },
  },
];

/**
 * Builds /catalog/filters from the product list, so counts stay in sync with
 * the mock catalog instead of being a second thing to keep updated.
 *
 * TODO: labels are the raw enum values (OS_7, PRAVOPIS). The real endpoint
 * sends display labels; the filter panel (task 5) needs them translated.
 */
function buildFilters() {
  const grades = new Map<string, number>();
  const areas = new Map<string, number>();
  const examPrep = new Map<string, number>();

  for (const product of productsPage.content) {
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
 * Resolves a mock response for an API path.
 *
 * TODO (task 5): /catalog/products ignores grade/area/examPrep/sort/page —
 * the catalog filters will need it to actually filter.
 * TODO: error mocks still missing — empty cart, expired access, invalid
 * coupon (spec 4.3, rule 3).
 *
 * @param path - API path with query string, e.g. '/catalog/products?grade=OS_7'
 * @throws ApiError - 404 for unknown paths, so a typo shows up as an error state
 */
export function resolveMock<T>(path: string): T {
  const [pathname, search = ''] = path.split('?');
  const query = new URLSearchParams(search);

  const exact = EXACT[pathname];
  if (exact) {
    return exact(pathname, query) as T;
  }

  const prefixed = PREFIXED.find((entry) => pathname.startsWith(entry.prefix));
  if (prefixed) {
    return prefixed.handle(pathname, query) as T;
  }

  throw new ApiError(404, 'MOCK_NOT_FOUND', `Nema mock podataka za ${path}`);
}
