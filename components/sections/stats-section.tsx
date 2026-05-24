"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import type { CmsStat } from "@/lib/cms";
import { useLang } from "@/lib/language-context";

const STAT_ICONS: Record<string, ReactNode> = {
  sparkle: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  smartphone: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  code: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  palette: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="14.5" r="2.5"/><circle cx="8.5" cy="14.5" r="2.5"/>
      <line x1="13.5" y1="9" x2="17.5" y2="12"/><line x1="13.5" y1="9" x2="8.5" y2="12"/>
    </svg>
  ),
};

function Counter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration  = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [active, target]);

  return <>{count}{suffix}</>;
}

export default function StatsSection({ stats }: { stats: CmsStat[] }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { lang, t } = useLang();

  const STATS = stats.map((s) => ({
    ...s,
    icon:  STAT_ICONS[s.icon] ?? STAT_ICONS.sparkle,
    label: lang === "en" && s.label_en ? s.label_en : s.label_fr,
  }));

  return (
    <section id="stats" className="relative py-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,102,204,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="block h-px w-8" style={{ background: "linear-gradient(90deg,transparent,#00d4ff)" }} />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "var(--color-phi-cyan)" }}>
              {t.stats.eyebrow}
            </span>
            <span className="block h-px w-8" style={{ background: "linear-gradient(90deg,#00d4ff,transparent)" }} />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black mb-4">
            {t.stats.title1}{" "}
            <span style={{
              background: "linear-gradient(135deg,#0066cc,#00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              backgroundClip:       "text",
            }}>
              {t.stats.title2}
            </span>
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: "var(--foreground)", opacity: 0.55 }}>
            {t.stats.description}
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div
              key={s.label_fr}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background:      "var(--surface)",
                border:          "1px solid var(--border)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="absolute top-0 left-6 right-6 h-px rounded-full"
                style={{ background: `linear-gradient(90deg,transparent,${s.color},transparent)` }}
              />

              <div
                className="flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                style={{
                  background: `linear-gradient(135deg,${s.color}18,${s.color}08)`,
                  border:     `1px solid ${s.color}30`,
                  color:      s.color,
                }}
              >
                {s.icon}
              </div>

              <div
                className="font-display text-5xl font-black mb-2 tabular-nums"
                style={{ color: s.color, lineHeight: 1 }}
              >
                <Counter target={s.value} suffix={s.suffix} active={inView} />
              </div>

              <div className="text-sm font-medium" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                {s.label}
              </div>

              <div
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-px"
                style={{ background: `linear-gradient(90deg,transparent,${s.color}50,transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { StatsSection };
