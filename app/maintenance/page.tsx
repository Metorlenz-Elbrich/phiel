"use client";

import { motion } from "framer-motion";
import { SITE, SOCIALS } from "@/lib/data";
import { useLang } from "@/lib/language-context";
import { Logo } from "@/components/ui/logo";
import { Icon, type IconName } from "@/components/ui/icon";
import { LangToggle } from "@/components/ui/lang-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const COPY = {
  fr: {
    badge: "Maintenance en cours",
    title: "On améliore votre expérience",
    text: "Notre site est temporairement indisponible pendant que nous effectuons des travaux de maintenance. Nous revenons très vite, plus rapides et plus performants.",
    contactTitle: "Besoin de nous joindre ?",
    contactText: "Notre équipe reste disponible pendant la maintenance.",
    email: "Écrivez-nous",
    call: "Appelez-nous",
    follow: "Suivez-nous",
    thanks: "Merci pour votre patience.",
  },
  en: {
    badge: "Maintenance in progress",
    title: "We're improving your experience",
    text: "Our website is temporarily unavailable while we carry out maintenance work. We'll be back very soon, faster and better than ever.",
    contactTitle: "Need to reach us?",
    contactText: "Our team remains available during the maintenance.",
    email: "Email us",
    call: "Call us",
    follow: "Follow us",
    thanks: "Thank you for your patience.",
  },
} as const;

export default function MaintenancePage() {
  const { lang } = useLang();
  const c = COPY[lang];
  const whatsapp = `https://wa.me/${SITE.phones[0].replace(/\D/g, "")}`;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Halos de fond */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-phi-gradient opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-phi-gradient opacity-10 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo height={44} />
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-6 text-center sm:px-6 sm:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Icône engrenage animée */}
          <div className="relative mb-8 grid h-24 w-24 place-items-center rounded-3xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-phi-cyan">
            <svg
              viewBox="0 0 24 24"
              width="44"
              height="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-[spin_8s_linear_infinite]"
              aria-hidden
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>

          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-phi-cyan">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-phi-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-phi-cyan" />
            </span>
            {c.badge}
          </span>

          <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-5 max-w-xl text-base text-foreground/70 sm:text-lg">
            {c.text}
          </p>

          {/* Barre de progression indéterminée */}
          <div
            className="mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[color:var(--surface-muted)]"
            role="progressbar"
            aria-label={c.badge}
          >
            <div className="h-full w-1/3 animate-[maint-slide_1.8s_ease-in-out_infinite] rounded-full bg-phi-gradient" />
          </div>
        </motion.div>

        {/* Contacts */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 w-full rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-left sm:p-8"
        >
          <h2 className="font-display text-xl font-semibold">{c.contactTitle}</h2>
          <p className="mt-1 text-sm text-foreground/60">{c.contactText}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] p-4 transition-colors hover:border-phi-cyan/60"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-phi-gradient-soft text-phi-cyan">
                <Icon name="mail" size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wider text-foreground/60">
                  {c.email}
                </span>
                <span className="block truncate text-sm font-medium">{SITE.email}</span>
              </span>
            </a>

            {SITE.phones.map((p, i) => (
              <a
                key={p}
                href={i === 0 ? whatsapp : `tel:${p.replace(/\s+/g, "")}`}
                target={i === 0 ? "_blank" : undefined}
                rel={i === 0 ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] p-4 transition-colors hover:border-phi-cyan/60"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-phi-gradient-soft text-phi-cyan">
                  <Icon name="phone" size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-foreground/60">
                    {i === 0 ? "WhatsApp" : c.call}
                  </span>
                  <span className="block text-sm font-medium">{p}</span>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-start gap-3 border-t border-[color:var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-foreground/70">{c.follow}</span>
            <ul className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-black/15 text-foreground/80 transition-colors hover:border-phi-cyan/60 hover:text-phi-cyan dark:border-white/25 dark:bg-white/5 dark:text-white/70"
                  >
                    <Icon name={s.icon as IconName} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        <p className="mt-10 text-sm text-foreground/60">{c.thanks}</p>
        <p className="mt-2 text-xs text-foreground/40">
          © {new Date().getFullYear()} {SITE.name} · {SITE.location}
        </p>
      </main>

      <style>{`
        @keyframes maint-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
