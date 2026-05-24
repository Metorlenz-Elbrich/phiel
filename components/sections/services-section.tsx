"use client";

import { motion } from "framer-motion";
import { type ServiceIcon } from "@/lib/data";
import type { CmsService } from "@/lib/cms";
import { Icon, type IconName } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { useLang } from "@/lib/language-context";

const ICONS: Record<ServiceIcon, IconName> = {
  branding: "palette",
  web: "code",
  mobile: "smartphone",
};

export function ServicesSection({ services }: { services: CmsService[] }) {
  const { t } = useLang();
  const SERVICES = services;
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
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <Card interactive className="h-full">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-phi-gradient text-white">
                  <Icon name={ICONS[s.icon]} size={22} />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{s.description}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Icon name="check" size={14} className="text-phi-cyan" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
