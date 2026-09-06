import type { components } from '../../api/schema';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

type ProductSummary = components['schemas']['ProductSummary'];

/** One column at 360px, two from sm, three from lg. */
const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <div className={GRID}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/** Loading twin of the grid — same columns, same card shape. */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
