import { connectDB } from "@/lib/mongodb";
import { Service } from "@/lib/models/Service";
import { Skill } from "@/lib/models/Skill";
import { Stat } from "@/lib/models/Stat";
import { Project } from "@/lib/models/Project";
import { TeamMember } from "@/lib/models/TeamMember";
import { Testimonial } from "@/lib/models/Testimonial";
import { SeedButton } from "./_components/seed-button";
import { MigrateButton } from "./_components/migrate-button";

export const dynamic = "force-dynamic";

async function getCounts() {
  try {
    await connectDB();
    const [services, skills, stats, projects, team, testimonials] = await Promise.all([
      Service.countDocuments(),
      Skill.countDocuments(),
      Stat.countDocuments(),
      Project.countDocuments(),
      TeamMember.countDocuments(),
      Testimonial.countDocuments(),
    ]);
    return { services, skills, stats, projects, team, testimonials };
  } catch {
    return null;
  }
}

export default async function AdminHomePage() {
  const counts = await getCounts();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-white/55">
          Vue d&apos;ensemble du contenu géré.
        </p>
      </header>

      {!counts && (
        <div
          className="rounded-2xl border p-6 text-sm text-amber-300"
          style={{ borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.05)" }}
        >
          MongoDB est inaccessible. Vérifie <code>MONGODB_URI</code> dans
          <code> .env.local</code>.
        </div>
      )}

      {counts && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Services", counts.services, "/admin/services"],
              ["Compétences", counts.skills, "/admin/skills"],
              ["Statistiques", counts.stats, "/admin/stats"],
              ["Projets", counts.projects, "/admin/projects"],
              ["Équipe", counts.team, "/admin/team"],
              ["Témoignages", counts.testimonials, "/admin/testimonials"],
            ] as const
          ).map(([label, count, href]) => (
            <a
              key={label}
              href={href}
              className="rounded-2xl border p-6 hover:border-[#00d4ff] transition-colors"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(0,212,255,0.12)",
              }}
            >
              <p className="text-xs uppercase tracking-wider text-white/55">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{count}</p>
            </a>
          ))}
        </div>
      )}

      <section
        className="rounded-2xl border p-6"
        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(0,212,255,0.12)" }}
      >
        <h2 className="text-lg font-semibold">Données initiales</h2>
        <p className="mt-1 text-sm text-white/60">
          Importer le contenu actuel de <code>lib/data.ts</code> dans MongoDB
          (idempotent — n&apos;écrase pas les collections déjà peuplées).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <SeedButton />
          <MigrateButton />
        </div>
      </section>
    </div>
  );
}
