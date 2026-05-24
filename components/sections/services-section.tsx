"use client";

import { motion } from "framer-motion";
import type { CmsService } from "@/lib/cms";
import { Icon, type IconName } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { useLang } from "@/lib/language-context";

const ICON_MAP: Record<string, IconName> = {
  palette:    "palette",
  code:       "code",
  smartphone: "smartphone",
  sparkle:    "sparkle",
  server:     "code",
  mail:       "mail",
  // Valeurs legacy
  branding: "palette",
  web:      "code",
  mobile:   "smartphone",
};

/** Fallback chain : EN si disponible, sinon FR. */
function pick(fr: string, en: string, lang: string) {
  return lang === "en" && en ? en : fr;
}
function pickArr(fr: string[], en: string[], lang: string) {
  return lang === "en" && en.length ? en : fr;
}

export function ServicesSection({ services }: { services: CmsService[] }) {
  const { lang, t } = useLang();

  return (
    <section
      id="services"
      className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden"
      aria-labelledby="services-title"
    >
      <div aria-hidden className="absolute inset-0 bg-grid bg-grid-fade opacity-70 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.services.eyebrow}
          title={(() => {
            const parts = t.services.title.split("PhiBrain");
            return parts.length > 1 ? (
              <>
                {parts[0]}
                <span className="text-phi-gradient">PhiBrain</span>
                {parts.slice(1).join("PhiBrain")}
              </>
            ) : (
              t.services.title
            );
          })()}
          description={t.services.description}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s, i) => {
            const title       = pick(s.title_fr,       s.title_en,       lang);
            const description = pick(s.description_fr, s.description_en, lang);
            const features    = pickArr(s.features_fr, s.features_en,    lang);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              >
                <Card interactive className="h-full">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-phi-gradient text-white">
                    <Icon name={ICON_MAP[s.icon] ?? "sparkle"} size={22} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{description}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Icon name="check" size={14} className="text-phi-cyan" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
