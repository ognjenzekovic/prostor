import { Button } from './Button';
import { useT } from '../../hooks/useT';

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry: () => void;
};

/**
 * Something failed and the reader can do something about it.
 *
 * Retry is mandatory (rule 4): an error screen without a way back forces a
 * page reload, which on the catalog means losing the filters too.
 *
 * TODO: map ApiError.code to a specific message via lib/errors.ts; until then
 * the caller passes a generic one.
 */
export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const { t } = useT();

  return (
    <div
      role="alert"
      className="rounded-md border border-danger/30 bg-neutral-100 px-6 py-12 text-center"
    >
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-prose text-neutral-700">{description}</p>
      <Button onClick={onRetry} className="mt-6">
        {t('common.retry')}
      </Button>
    </div>
  );
}
