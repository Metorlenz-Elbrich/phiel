"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LangToggle } from "./lang-toggle";
import { Icon } from "./icon";

export function NavBar() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const NAV_LINKS: { label: string; href: string }[] = [
    { label: t.nav.home, href: "#hero" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.portfolio, href: "#portfolio" },
    { label: t.nav.team, href: "#team" },
    { label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", "border-b")}
      style={
        scrolled
          ? {
              background: "var(--navbar-bg)",
              borderBottomColor: "var(--navbar-border)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }
          : {
              // Toujours fond sombre quand on est sur le slider (top of page)
              background: "rgba(5, 8, 16, 0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottomColor: "rgba(255,255,255,0.08)",
            }
      }
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Logo — toujours version dark quand sur le slider */}
        <Link
          href="#hero"
          className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-phi-cyan rounded-full"
          aria-label="Aller à l'accueil"
        >
          <Logo height={70} priority={true} forceDark={!scrolled} />
        </Link>

        {/* Nav links — blanc sur le slider, couleur theme après scroll */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-phi-cyan",
                  scrolled
                    ? "text-foreground/80 hover:bg-[color:var(--surface-muted)]"
                    : "text-white/90 hover:bg-white/10"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <Link
            href="#contact"
            className="hidden md:inline-flex h-10 items-center justify-center rounded-full bg-phi-gradient px-5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(0,212,255,0.55)] hover:brightness-110"
          >
            {t.nav.cta}
          </Link>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border",
              scrolled ? "border-[color:var(--border)]" : "border-white/20"
            )}
          >
            <Icon
              name={open ? "close" : "menu"}
              className={scrolled ? undefined : "text-white"}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden overflow-hidden border-t border-[color:var(--border)] bg-[color:var(--surface)]/95 backdrop-blur-xl transition-[max-height,opacity] duration-300",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col px-4 py-2">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-medium text-foreground/85 hover:text-phi-cyan hover:bg-[color:var(--surface-muted)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2 pb-4">
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center justify-center rounded-full bg-phi-gradient px-5 text-sm font-medium text-white"
            >
              {t.nav.cta}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
