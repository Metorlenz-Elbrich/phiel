"use client";

import Link from "next/link";
import { SITE, SOCIALS } from "@/lib/data";
import { useLang } from "@/lib/language-context";
import { Logo } from "./logo";
import { Icon, type IconName } from "./icon";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  const NAV_LINKS: { label: string; href: string }[] = [
    { label: t.nav.home, href: "#hero" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.portfolio, href: "#portfolio" },
    { label: t.nav.team, href: "#team" },
    { label: t.nav.contact, href: "#contact" },
  ];
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Logo height={100} />
          <p className="max-w-md text-sm text-foreground/70">
            {t.footer.description}
          </p>
          <ul className="flex items-center gap-3 pt-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border text-foreground/80 hover:text-phi-cyan hover:border-phi-cyan/60 border-black/15 dark:border-white/25 dark:text-white/70 dark:bg-white/5 dark:hover:border-phi-cyan dark:hover:text-phi-cyan"                >
                  <Icon name={s.icon as IconName} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80">
            {t.footer.navigation}
          </h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-foreground/70 hover:text-phi-cyan">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80">
            {t.footer.contact}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${SITE.email}`} className="text-foreground/70 hover:text-phi-cyan flex items-center gap-2">
                <Icon name="mail" size={16} /> {SITE.email}
              </a>
            </li>
            {SITE.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s+/g, "")}`} className="text-foreground/70 hover:text-phi-cyan flex items-center gap-2">
                  <Icon name="phone" size={16} /> {p}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-2 text-foreground/70">
              <Icon name="mapPin" size={16} /> {SITE.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/60">
          <p>© {year} {SITE.name}. {t.footer.rights}</p>
          <p className="text-foreground/50">{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
