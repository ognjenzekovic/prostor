import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import sr from './sr.json';
import en from './en.json';

const STORAGE_KEY = 'uiLanguage';
const SUPPORTED = ['sr', 'en'];

/**
 * Serbian unless the reader picked otherwise — the browser locale does not
 * get a vote. The audience is Serbian and en.json is a stub, so an English
 * browser must not silently swap the language out from under them.
 */
function initialLanguage(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && SUPPORTED.includes(stored) ? stored : 'sr';
}

i18n.use(initReactI18next).init({
  resources: {
    sr: { translation: sr },
    en: { translation: en },
  },
  lng: initialLanguage(),
  fallbackLng: 'sr',
  supportedLngs: SUPPORTED,
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
});

// <html lang> is set by ScriptProvider, which knows the script too (sr-Latn / sr-Cyrl).

export default i18n;
