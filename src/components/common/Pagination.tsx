import { Button } from './Button';
import { useT } from '../../hooks/useT';

type PaginationProps = {
  /** Zero-based, as the API counts pages. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/**
 * Previous / next with a position readout.
 *
 * Numbered pages are deliberately left out: the catalog is browsed by filter,
 * not by page number, and a row of numbers does not fit at 360px.
 */
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useT();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label={t('pagination.label')} className="mt-8 flex items-center justify-between gap-4">
      <Button variant="outline" onClick={() => onPageChange(page - 1)} disabled={page <= 0}>
        {t('pagination.previous')}
      </Button>

      <span aria-live="polite" className="text-sm text-neutral-700">
        {t('pagination.position', { page: page + 1, totalPages })}
      </span>

      <Button
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        {t('pagination.next')}
      </Button>
    </nav>
  );
}
