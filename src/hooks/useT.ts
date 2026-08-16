import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useScript } from '../app/ScriptContext';
import { toCyrillic } from '../lib/cyrillic';

/**
 * Translation hook that applies the script preference.
 *
 * Use this instead of react-i18next's useTranslation everywhere text is shown
 * to the user: it returns `t` with Cyrillic transliteration already applied
 * when language is 'sr' and the reader chose Cyrillic.
 *
 * The one exception is the script switcher itself, whose labels must stay in
 * the script they name — it uses useTranslation directly.
 */
export function useT() {
  const { t, i18n } = useTranslation();
  const { script } = useScript();
  // startsWith, not ===: the language can arrive as 'sr-RS' or 'sr-Latn'.
  const transliterate = i18n.language.startsWith('sr') && script === 'cyrillic';

  const translate = useCallback(
    (key: string, options?: Record<string, unknown>): string => {
      const text = t(key, options);
      return transliterate ? toCyrillic(text) : text;
    },
    [t, transliterate]
  );

  return { t: translate, i18n };
}
