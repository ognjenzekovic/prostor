import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { useT } from '../hooks/useT';
import { routes } from '../lib/routes';

export function NotFoundPage() {
  const { t } = useT();

  return (
    <Container className="py-16">
      {/* TODO: the owl belongs here once the illustration exists (docs/06.4). */}
      <p className="font-display text-5xl text-neutral-500">404</p>
      <h1 className="mt-4">{t('notFound.title')}</h1>
      <p className="mt-4 max-w-prose text-neutral-700">{t('notFound.body')}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to={routes.catalog()}
          className="rounded-sm bg-brand-500 px-4 py-2 text-sm font-medium text-neutral-900"
        >
          {t('notFound.toCatalog')}
        </Link>
        <Link
          to={routes.home()}
          className="rounded-sm border border-neutral-900/15 px-4 py-2 text-sm text-neutral-700 hover:text-neutral-900"
        >
          {t('notFound.toHome')}
        </Link>
      </div>
    </Container>
  );
}
