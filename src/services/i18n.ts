import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import * as HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(HttpApi as any)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/assets/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
