"use client";

import { motion } from "framer-motion";
import type { CmsTeamMember } from "@/lib/cms";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "./section-heading";
import { useLang } from "@/lib/language-context";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TeamSection({ team }: { team: CmsTeamMember[] }) {
  const { lang, t } = useLang();

  return (
    <section
      id="team"
      className="relative scroll-mt-24 py-24 sm:py-32 bg-[color:var(--background-alt)]"
      aria-labelledby="team-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.team.eyebrow}
          title={
            <>
              {t.team.title1} <span className="text-phi-gradient">{t.team.title2}</span>
            </>
          }
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {team.map((m, i) => {
            const name = lang === "en" && m.name_en ? m.name_en : m.name_fr;
            const role = lang === "en" && m.role_en ? m.role_en : m.role_fr;
            const bio  = lang === "en" && m.bio_en  ? m.bio_en  : m.bio_fr;
            return (
              <motion.div
                key={m.name_fr}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card interactive className="h-full">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-phi-gradient text-white text-2xl font-semibold tracking-wide shadow-[0_12px_30px_-10px_rgba(0,212,255,0.55)]">
                      {initials(name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
                      <p className="text-sm font-medium text-phi-cyan">{role}</p>
                      <p className="mt-3 text-sm text-foreground/70">{bio}</p>
                      {m.linkedin && (
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`LinkedIn ${lang === "en" ? "of" : "de"} ${name}`}
                          className="mt-4 inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--border)] px-3 text-xs font-medium text-foreground/80 hover:text-phi-cyan hover:border-phi-cyan/60"
                        >
                          <Icon name="linkedin" size={14} /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {/* Carte recrutement */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full relative overflow-hidden border-dashed">
              <div
                aria-hidden
                className="absolute -inset-1 opacity-40 blur-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(60% 50% at 30% 30%, rgba(0,212,255,0.25), transparent 70%), radial-gradient(50% 40% at 80% 70%, rgba(0,102,204,0.20), transparent 70%)",
                }}
              />
              <div className="relative flex flex-col items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-phi-gradient text-white">
                  <Icon name="sparkle" size={20} />
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{t.team.expanding}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{t.team.expandingDesc}</p>
                </div>
                <a
                  href="#contact"
                  className="mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-phi-gradient px-5 text-sm font-semibold text-white shadow-[0_8px_22px_-10px_rgba(0,212,255,0.55)] hover:brightness-110"
                >
                  {t.team.joinBtn} <Icon name="arrowRight" size={14} />
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
