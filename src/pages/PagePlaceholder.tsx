import { Container } from '../components/layout/Container';
import { useT } from '../hooks/useT';

/**
 * Temporary body for routes that exist but have no content yet (task 4:
 * "rute iz sekcije 4.4 — stranice zasad prazne"). Each real page replaces it
 * with its own file as the task list moves on.
 */
export function PagePlaceholder({ titleKey }: { titleKey: string }) {
  const { t } = useT();

  return (
    <Container className="py-12">
      <h1>{t(titleKey)}</h1>
      <p className="mt-4 text-neutral-700">{t('common.underConstruction')}</p>
    </Container>
  );
}
