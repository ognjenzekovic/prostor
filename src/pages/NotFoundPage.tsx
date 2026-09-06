import { Container } from '../components/layout/Container';
import { LinkButton } from '../components/common/Button';
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
        <LinkButton to={routes.catalog()}>{t('notFound.toCatalog')}</LinkButton>
        <LinkButton to={routes.home()} variant="outline">
          {t('notFound.toHome')}
        </LinkButton>
      </div>
    </Container>
  );
}
