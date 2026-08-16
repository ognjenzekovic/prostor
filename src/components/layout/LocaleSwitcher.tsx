import { useTranslation } from 'react-i18next';
import { useScript, type Script } from '../../app/ScriptContext';

/**
 * Language and script in one control.
 *
 * Underneath these stay two independent axes (spec 4.7) — i18next holds the
 * language, ScriptContext holds the script — but only three combinations are
 * meaningful, so the reader picks from three, not from two switches.
 *
 * A native <select> on purpose: keyboard and screen reader support come for
 * free, and phones open their own picker, which beats any custom menu at
 * 360px.
 */

type Option = {
  id: string;
  labelKey: string;
  language: string;
  /** null = leave the Serbian script preference alone. */
  script: Script | null;
};

const OPTIONS: Option[] = [
  { id: 'sr-latin', labelKey: 'locale.srLatin', language: 'sr', script: 'latin' },
  { id: 'sr-cyrillic', labelKey: 'locale.srCyrillic', language: 'sr', script: 'cyrillic' },
  { id: 'en', labelKey: 'locale.en', language: 'en', script: null },
];

export function LocaleSwitcher() {
  // useTranslation, not useT: every option is written in the language and
  // script it stands for, so none of these labels may be transliterated.
  const { t, i18n } = useTranslation();
  const { script, setScript } = useScript();

  const currentId = i18n.language.startsWith('sr')
    ? `sr-${script === 'cyrillic' ? 'cyrillic' : 'latin'}`
    : 'en';

  function handleChange(id: string) {
    const option = OPTIONS.find((candidate) => candidate.id === id);

    if (!option) {
      return;
    }

    if (option.script) {
      setScript(option.script);
    }

    void i18n.changeLanguage(option.language);
  }

  return (
    <select
      value={currentId}
      onChange={(event) => handleChange(event.target.value)}
      aria-label={t('locale.label')}
      className="rounded-sm border border-neutral-900/15 bg-neutral-50 px-2 py-1.5 text-sm text-neutral-700 hover:text-neutral-900"
    >
      {OPTIONS.map((option) => (
        <option key={option.id} value={option.id}>
          {t(option.labelKey)}
        </option>
      ))}
    </select>
  );
}
