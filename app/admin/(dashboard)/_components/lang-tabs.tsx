"use client";

type LangTabsProps = {
  active: "fr" | "en";
  onChange: (lang: "fr" | "en") => void;
};

export function LangTabs({ active, onChange }: LangTabsProps) {
  return (
    <div className="flex items-center gap-0.5" role="tablist" aria-label="Langue du contenu">
      {(["fr", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          role="tab"
          aria-selected={active === lang}
          onClick={() => onChange(lang)}
          className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest transition-all"
          style={
            active === lang
              ? { background: "linear-gradient(135deg,#0066cc,#00d4ff)", color: "#fff" }
              : {
                  color: "rgba(255,255,255,0.40)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }
          }
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
