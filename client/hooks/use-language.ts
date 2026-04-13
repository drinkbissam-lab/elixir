import { useEffect, useState } from "react";

import { Language, translations } from "@/lib/translations";

export type { Language };

const LANGUAGE_UPDATED_EVENT = "language-updated";

const applyLanguageSettings = (lang: Language) => {
  const htmlElement = document.documentElement;

  htmlElement.setAttribute("lang", lang);
  htmlElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  htmlElement.setAttribute("data-language", lang);

  if (lang === "ar") {
    htmlElement.style.textAlign = "right";
    document.body.style.textAlign = "right";
  } else {
    htmlElement.style.textAlign = "left";
    document.body.style.textAlign = "left";
  }
};

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const syncLanguage = (lang: Language) => {
      setLanguageState(lang);
      applyLanguageSettings(lang);
    };

    const savedLanguage = localStorage.getItem("language") as Language | null;
    syncLanguage(savedLanguage || "ar");
    setMounted(true);

    const handleLanguageUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<Language>;
      syncLanguage(customEvent.detail);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "language" && event.newValue) {
        syncLanguage(event.newValue as Language);
      }
    };

    window.addEventListener(LANGUAGE_UPDATED_EVENT, handleLanguageUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(LANGUAGE_UPDATED_EVENT, handleLanguageUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setLanguageState(lang);
    applyLanguageSettings(lang);
    window.dispatchEvent(new CustomEvent(LANGUAGE_UPDATED_EVENT, { detail: lang }));
  };

  const t = (key: keyof typeof translations.ar): string => {
    return translations[language][key] || key;
  };

  return {
    language,
    setLanguage,
    t,
    mounted,
    dir: language === "ar" ? "rtl" : "ltr",
    isArabic: language === "ar",
    isEnglish: language === "en",
    isFrench: language === "fr",
  };
}
