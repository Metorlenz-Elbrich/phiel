/**
 * POST /api/admin/migrate
 * Copie les anciennes données mono-langue vers les champs bilingues _fr/_en.
 * Idempotent : seuls les documents qui n'ont pas encore title_fr / name_fr… sont traités.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { apiError, unauthorized } from "@/lib/api-error";
import { securityLog } from "@/lib/security-log";
import { Service } from "@/lib/models/Service";
import { Skill } from "@/lib/models/Skill";
import { Stat } from "@/lib/models/Stat";
import { Project } from "@/lib/models/Project";
import { TeamMember } from "@/lib/models/TeamMember";
import { Testimonial } from "@/lib/models/Testimonial";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) return unauthorized();

    await connectDB();
    const results: Record<string, number> = {};

    // ── Services : title/description/features → _fr + _en ──────────────────
    const services = await Service.find(
      { title_fr: { $exists: false } }
    ).lean() as Array<Record<string, unknown>>;

    for (const s of services) {
      await Service.updateOne(
        { _id: s._id },
        {
          $set: {
            title_fr:       String(s.title       ?? ""),
            title_en:       String(s.title       ?? ""),
            description_fr: String(s.description ?? ""),
            description_en: String(s.description ?? ""),
            features_fr:    Array.isArray(s.features) ? s.features : [],
            features_en:    Array.isArray(s.features) ? s.features : [],
          },
        }
      );
    }
    results.services = services.length;

    // ── Skills : name → name_fr + name_en ──────────────────────────────────
    const skills = await Skill.find(
      { name_fr: { $exists: false } }
    ).lean() as Array<Record<string, unknown>>;

    for (const s of skills) {
      await Skill.updateOne(
        { _id: s._id },
        {
          $set: {
            name_fr: String(s.name ?? ""),
            name_en: String(s.name ?? ""),
          },
        }
      );
    }
    results.skills = skills.length;

    // ── Stats : label → label_fr + label_en ────────────────────────────────
    const stats = await Stat.find(
      { label_fr: { $exists: false } }
    ).lean() as Array<Record<string, unknown>>;

    for (const s of stats) {
      await Stat.updateOne(
        { _id: s._id },
        {
          $set: {
            label_fr: String(s.label ?? ""),
            label_en: String(s.label ?? ""),
          },
        }
      );
    }
    results.stats = stats.length;

    // ── Projects : title/description → _fr + _en ───────────────────────────
    const projects = await Project.find(
      { title_fr: { $exists: false } }
    ).lean() as Array<Record<string, unknown>>;

    for (const p of projects) {
      await Project.updateOne(
        { _id: p._id },
        {
          $set: {
            title_fr:       String(p.title       ?? ""),
            title_en:       String(p.title       ?? ""),
            description_fr: String(p.description ?? ""),
            description_en: String(p.description ?? ""),
          },
        }
      );
    }
    results.projects = projects.length;

    // ── TeamMembers : name/role/bio → _fr + _en ────────────────────────────
    const members = await TeamMember.find(
      { name_fr: { $exists: false } }
    ).lean() as Array<Record<string, unknown>>;

    for (const m of members) {
      await TeamMember.updateOne(
        { _id: m._id },
        {
          $set: {
            name_fr: String(m.name ?? ""),
            name_en: String(m.name ?? ""),
            role_fr: String(m.role ?? ""),
            role_en: String(m.role ?? ""),
            bio_fr:  String(m.bio  ?? ""),
            bio_en:  String(m.bio  ?? ""),
          },
        }
      );
    }
    results.members = members.length;

    // ── Testimonials : name/role/quote → _fr + _en ─────────────────────────
    const testimonials = await Testimonial.find(
      { name_fr: { $exists: false } }
    ).lean() as Array<Record<string, unknown>>;

    for (const t of testimonials) {
      await Testimonial.updateOne(
        { _id: t._id },
        {
          $set: {
            name_fr:  String(t.name  ?? ""),
            name_en:  String(t.name  ?? ""),
            role_fr:  String(t.role  ?? ""),
            role_en:  String(t.role  ?? ""),
            quote_fr: String(t.quote ?? ""),
            quote_en: String(t.quote ?? ""),
          },
        }
      );
    }
    results.testimonials = testimonials.length;

    securityLog.adminAction({
      userId:   session.user.email ?? "admin",
      action:   "update",
      resource: "migrate",
    });

    return NextResponse.json({
      success: true,
      migrated: results,
      message: "Migration terminée avec succès",
    });
  } catch (err) {
    return apiError(err, { context: "POST /api/admin/migrate" });
  }
}
