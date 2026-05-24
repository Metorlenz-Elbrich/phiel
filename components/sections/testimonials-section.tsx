"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CmsTestimonial } from "@/lib/cms";
import { SectionHeading } from "./section-heading";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: CmsTestimonial[];
}) {
  const { lang, t } = useLang();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const current  = testimonials[idx];
  const name     = lang === "en" && current.name_en  ? current.name_en  : current.name_fr;
  const role     = lang === "en" && current.role_en  ? current.role_en  : current.role_fr;
  const quote    = lang === "en" && current.quote_en ? current.quote_en : current.quote_fr;

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-24 py-24 sm:py-32"
      aria-labelledby="testimonials-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.testimonials.eyebrow}
          title={(() => {
            const words = t.testimonials.title.trim().split(" ");
            if (words.length < 2) {
              return <span className="text-phi-gradient">{t.testimonials.title}</span>;
            }
            const last = words[words.length - 1];
            const head = words.slice(0, -1).join(" ");
            return (
              <>
                {head} <span className="text-phi-gradient">{last}</span>
              </>
            );
          })()}
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 sm:p-12 min-h-[260px]">
            <Icon
              name="sparkle"
              size={32}
              className="absolute right-6 top-6 text-phi-cyan/40"
            />
            <AnimatePresence mode="wait">
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <blockquote className="text-lg sm:text-xl font-medium leading-relaxed text-foreground/90">
                  « {quote} »
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-phi-gradient text-white text-sm font-semibold">
                    {name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-foreground/60">{role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`${lang === "en" ? "Testimonial" : "Témoignage"} ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === idx ? "w-8 bg-phi-gradient" : "w-2 bg-[color:var(--border-strong)] hover:bg-phi-cyan/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
