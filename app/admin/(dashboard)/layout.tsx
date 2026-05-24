import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { LogoutButton } from "./_components/logout-button";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/skills", label: "Compétences" },
  { href: "/admin/stats", label: "Statistiques" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/team", label: "Équipe" },
  { href: "/admin/testimonials", label: "Témoignages" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#050810", color: "#fff" }}>
      <aside
        className="w-60 shrink-0 border-r p-6 flex flex-col gap-1"
        style={{ borderColor: "rgba(0,212,255,0.12)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="mb-6 flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg"
            style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}
          />
          <span className="font-semibold tracking-tight">PhiBrain</span>
        </div>
        {NAV.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/5 hover:text-white"
          >
            {l.label}
          </Link>
        ))}
        <div className="mt-auto pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="mb-3 text-xs text-white/50 truncate">{session.user.email}</p>
          <form action={doSignOut}>
            <LogoutButton />
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
