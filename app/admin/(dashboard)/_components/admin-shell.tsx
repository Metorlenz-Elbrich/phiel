"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin",             label: "Dashboard" },
  { href: "/admin/slider",      label: "Slider" },
  { href: "/admin/services",    label: "Services" },
  { href: "/admin/skills",      label: "Compétences" },
  { href: "/admin/stats",       label: "Statistiques" },
  { href: "/admin/projects",    label: "Projets" },
  { href: "/admin/team",        label: "Équipe" },
  { href: "/admin/testimonials",label: "Témoignages" },
];

function SidebarContent({
  email,
  onClose,
  signOutForm,
}: {
  email: string;
  onClose?: () => void;
  signOutForm: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg shrink-0"
            style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}
          />
          <span className="font-semibold tracking-tight">PhiBrain</span>
        </div>
        {/* Bouton fermer sur mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
            aria-label="Fermer le menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm transition-all"
              style={{
                color:      active ? "#00d4ff" : "rgba(255,255,255,0.75)",
                background: active ? "rgba(0,212,255,0.1)" : "transparent",
                borderLeft: active ? "2px solid #00d4ff" : "2px solid transparent",
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="mb-3 text-xs text-white/50 truncate">{email}</p>
        {signOutForm}
      </div>
    </div>
  );
}

export function AdminShell({
  email,
  signOutForm,
  children,
}: {
  email:       string;
  signOutForm: ReactNode;
  children:    ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#050810", color: "#fff" }}>

      {/* ── Sidebar desktop (toujours visible ≥ md) ── */}
      <aside
        className="hidden md:flex w-60 shrink-0 border-r flex-col p-6"
        style={{ borderColor: "rgba(0,212,255,0.12)", background: "rgba(255,255,255,0.02)" }}
      >
        <SidebarContent email={email} signOutForm={signOutForm} />
      </aside>

      {/* ── Overlay mobile ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer mobile ── */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col p-6 md:hidden transition-transform duration-300"
        style={{
          background:  "#050c1a",
          borderRight: "1px solid rgba(0,212,255,0.12)",
          transform:   open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent
          email={email}
          onClose={() => setOpen(false)}
          signOutForm={signOutForm}
        />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">

        {/* Top bar mobile */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{
            borderColor: "rgba(0,212,255,0.12)",
            background:  "rgba(5,8,16,0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
            aria-label="Ouvrir le menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-md"
              style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}
            />
            <span className="text-sm font-semibold">PhiBrain</span>
          </div>

          {/* Placeholder pour centrer le logo */}
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
