import { useSearchParams } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';
import { ProductGrid, ProductGridSkeleton } from '../components/catalog/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useT } from '../hooks/useT';

/**
 * Catalog listing.
 *
 * Page and search live in the query string so a filtered view can be shared as
 * a link (spec 4.6b) and the back button behaves.
 */
export function CatalogPage() {
  const { t } = useT();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(0, Number(searchParams.get('page')) || 0);
  const q = searchParams.get('q') ?? undefined;

  const { data, isPending, isError, refetch } = useProducts({ page, q });

  function goToPage(nextPage: number) {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set('page', String(nextPage));
      return next;
    });
    window.scrollTo({ top: 0 });
  }

  return (
    <Container className="py-8 sm:py-12">
      <h1>{t('catalog.title')}</h1>
      <p className="mt-3 max-w-prose text-neutral-700">{t('catalog.subtitle')}</p>

      <div className="mt-8">
        {isPending ? (
          <ProductGridSkeleton />
        ) : isError ? (
          <ErrorState
            title={t('catalog.error.title')}
            description={t('catalog.error.description')}
            onRetry={() => void refetch()}
          />
        ) : data.totalElements === 0 ? (
          <EmptyState
            title={t('catalog.empty.title')}
            description={t('catalog.empty.description')}
            action={
              <Button onClick={() => setSearchParams(new URLSearchParams())}>
                {t('catalog.empty.action')}
              </Button>
            }
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-neutral-500">
              {t('catalog.count', { count: data.totalElements })}
            </p>
            <ProductGrid products={data.content} />
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>
    </Container>
  );
}
