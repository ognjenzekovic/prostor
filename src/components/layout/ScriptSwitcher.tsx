import { useTranslation } from 'react-i18next';
import { useScript, type Script } from '../../app/ScriptContext';

const OPTIONS: Array<{ value: Script; key: string }> = [
  { value: 'latin', key: 'script.latin' },
  { value: 'cyrillic', key: 'script.cyrillic' },
];

/**
 * Latin / Cyrillic switch.
 *
 * Uses useTranslation directly, not useT: a button labelled "Ћирилица" must
 * keep saying "Ћирилица" while Latin is active, otherwise the switch names the
 * script the reader is already in.
 */
export function ScriptSwitcher() {
  const { t } = useTranslation();
  const { script, setScript } = useScript();

  return (
    <div
      role="group"
      aria-label={t('script.label')}
      className="inline-flex rounded-sm border border-neutral-900/15"
    >
      {OPTIONS.map((option) => {
        const active = script === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setScript(option.value)}
            className={`px-3 py-1 text-sm first:rounded-l-sm last:rounded-r-sm ${
              active
                ? 'bg-neutral-900 text-neutral-50'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {t(option.key)}
          </button>
        );
      })}
    </div>
  );
}
