import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import sr from './sr.json';
import en from './en.json';

const resources = {
  sr: { translation: sr },
  en: { translation: en },
};

// Detect language from localStorage or browser, fallback to 'sr'
const storedLang = localStorage.getItem('language');
const browserLang = navigator.language.split('-')[0];
const detectedLang = storedLang || (browserLang === 'en' ? 'en' : 'sr');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectedLang,
    fallbackLng: 'sr',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

// Persist language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
});

// Set initial lang attribute
document.documentElement.lang = i18n.language;

export default i18n;
