/**
 * POST /api/admin/seed — importe lib/data.ts dans MongoDB.
 * Idempotent : ne fait rien si la collection contient déjà des docs.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { apiError, unauthorized } from "@/lib/api-error";
import { securityLog } from "@/lib/security-log";
import { SERVICES, SKILLS, STATS, PORTFOLIO, TEAM, TESTIMONIALS } from "@/lib/data";
import { Service } from "@/lib/models/Service";
import { Skill } from "@/lib/models/Skill";
import { Stat } from "@/lib/models/Stat";
import { Project } from "@/lib/models/Project";
import { TeamMember } from "@/lib/models/TeamMember";
import { Testimonial } from "@/lib/models/Testimonial";

const STAT_COLORS = ["#00d4ff", "#0066cc", "#00d4ff", "#0066cc"];

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) return unauthorized();

    await connectDB();
    const results: Record<string, number> = {};

    if ((await Service.countDocuments()) === 0) {
      const docs = SERVICES.map((s, i) => ({
        icon: s.icon,
        title: s.title,
        description: s.description,
        features: s.features,
        order: i,
      }));
      results.services = (await Service.insertMany(docs)).length;
    }

    if ((await Skill.countDocuments()) === 0) {
      const docs = SKILLS.map((s, i) => ({
        name: s.name,
        level: s.level,
        category: s.category,
        devicon: s.devicon ?? "",
        order: i,
      }));
      results.skills = (await Skill.insertMany(docs)).length;
    }

    if ((await Stat.countDocuments()) === 0) {
      const docs = STATS.map((s, i) => ({
        label: s.label,
        value: s.value,
        suffix: s.suffix ?? "+",
        icon: s.icon,
        color: STAT_COLORS[i % STAT_COLORS.length],
        order: i,
      }));
      results.stats = (await Stat.insertMany(docs)).length;
    }

    if ((await Project.countDocuments()) === 0) {
      const docs = PORTFOLIO.map((p, i) => ({
        title: p.title,
        category: p.category,
        description: p.description,
        tags: p.tags,
        link: p.link,
        repo: p.repo,
        gradient: p.gradient,
        order: i,
      }));
      results.projects = (await Project.insertMany(docs)).length;
    }

    if ((await TeamMember.countDocuments()) === 0) {
      const docs = TEAM.map((m, i) => ({
        name: m.name,
        role: m.role,
        bio: m.bio,
        linkedin: m.linkedin,
        order: i,
      }));
      results.team = (await TeamMember.insertMany(docs)).length;
    }

    if ((await Testimonial.countDocuments()) === 0) {
      const docs = TESTIMONIALS.map((t, i) => ({
        name: t.name,
        role: t.role,
        quote: t.quote,
        order: i,
      }));
      results.testimonials = (await Testimonial.insertMany(docs)).length;
    }

    securityLog.adminAction({
      userId: session.user.email ?? "admin",
      action: "create",
      resource: "seed",
    });

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    return apiError(err, { context: "POST /api/admin/seed" });
  }
}
