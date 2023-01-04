import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import no from 'app/configs/translations-i18n/no';
import en from 'app/configs/translations-i18n/en';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en,
  no
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    // lng: 'no',

    fallbackLng: "en",
    // debug: true,

    // have a common namespace used around the full app
    ns: ["label"],
    // defaultNS: "translations",
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
