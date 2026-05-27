"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type Lang, type Translations } from "./i18n";

type LangContextValue = {
  lang: Lang;
  t: Translations;
  toggle: () => void;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LangContextValue>({
  lang: "fr",
  t: translations.fr,
  toggle: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    try {
      // 1. Priorité : préférence explicitement sauvegardée par l'utilisateur
      const saved = window.localStorage.getItem("phibrain-lang");
      if (saved === "fr" || saved === "en") {
        setLangState(saved);
        return;
      }

      // 2. Sinon : langue du navigateur/appareil
      const browserLang = (navigator.language ?? navigator.languages?.[0] ?? "fr").toLowerCase();
      setLangState(browserLang.startsWith("fr") ? "fr" : "en");

    } catch {
      /* localStorage indisponible (mode privé strict, etc.) */
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem("phibrain-lang", next);
    } catch {
      /* ignore */
    }
  };

  const toggle = () => setLang(lang === "fr" ? "en" : "fr");

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
