"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PORTFOLIO_FILTERS, type PortfolioCategory } from "@/lib/data";
import type { CmsProject } from "@/lib/cms";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

export function PortfolioSection({ projects: allProjects }: { projects: CmsProject[] }) {
  const { t } = useLang();
  const [filter, setFilter] = useState<PortfolioCategory>("Tous");
  const projects = useMemo(
    () => (filter === "Tous" ? allProjects : allProjects.filter((p) => p.category === filter)),
    [filter, allProjects]
  );

  return (
    <section
      id="portfolio"
      className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden"
      aria-labelledby="portfolio-title"
    >
      <div aria-hidden className="absolute inset-0 bg-grid bg-grid-fade opacity-50 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.portfolio.eyebrow}
          title={
            <>
              {t.portfolio.title1} <span className="text-phi-gradient">{t.portfolio.title2}</span>
            </>
          }
        />

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {PORTFOLIO_FILTERS.map((f, i) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium border transition",
                  active
                    ? "border-transparent bg-phi-gradient text-white shadow-[0_8px_22px_-12px_rgba(0,212,255,0.55)]"
                    : "border-[color:var(--border)] text-foreground/80 hover:border-phi-cyan/60 hover:text-phi-cyan"
                )}
              >
                {t.portfolio.filters[i] ?? f}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
              >
                <Card interactive className="h-full flex flex-col">
                  <div
                    className="mb-5 aspect-[16/10] w-full rounded-xl border border-white/10 grid place-items-center text-white relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`,
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-30 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.4), transparent 50%)",
                      }}
                    />
                    <span className="relative text-5xl font-display font-semibold drop-shadow-lg">
                      {p.title.slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                    <span className="rounded-full border border-[color:var(--border)] px-2.5 py-0.5 text-xs text-foreground/70">
                      {p.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/70 line-clamp-3 flex-1">
                    {p.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-[color:var(--surface-muted)] px-2.5 py-0.5 text-xs text-foreground/70"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  {(p.link || p.repo) && (
                    <div className="mt-5 flex items-center gap-3 text-sm">
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-phi-cyan hover:underline"
                        >
                          Voir le projet <Icon name="external" size={14} />
                        </a>
                      )}
                      {p.repo && (
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-phi-cyan"
                          aria-label={`Voir ${p.title} sur GitHub`}
                        >
                          <Icon name="github" size={16} /> GitHub
                        </a>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
