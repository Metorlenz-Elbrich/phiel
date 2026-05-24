"use client";

import { useLang } from "@/lib/language-context";

export function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
      className="flex items-center gap-1 h-9 px-3 rounded-full border border-[color:var(--border)] text-sm font-semibold transition-all hover:border-phi-cyan hover:text-phi-cyan focus-visible:outline-2 focus-visible:outline-phi-cyan focus-visible:outline-offset-2"
      style={{ color: "var(--foreground)", opacity: 0.8 }}
    >
      <span style={{ opacity: lang === "fr" ? 1 : 0.4 }}>FR</span>
      <span style={{ opacity: 0.3 }}>|</span>
      <span style={{ opacity: lang === "en" ? 1 : 0.4 }}>EN</span>
    </button>
  );
}
