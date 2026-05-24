/**
 * CMS fetchers — connecte les sections publiques à MongoDB avec
 * fallback gracieux sur lib/data.ts si la DB est vide ou indisponible.
 * Revalidation 60 s via Next 16 cache.
 */

import { unstable_cache } from "next/cache";
import { tryConnectDB } from "@/lib/mongodb";
import { Service } from "@/lib/models/Service";
import { Skill } from "@/lib/models/Skill";
import { Stat } from "@/lib/models/Stat";
import { Project } from "@/lib/models/Project";
import { TeamMember } from "@/lib/models/TeamMember";
import { Testimonial } from "@/lib/models/Testimonial";
import {
  SERVICES as STATIC_SERVICES,
  SKILLS as STATIC_SKILLS,
  STATS as STATIC_STATS,
  PORTFOLIO as STATIC_PORTFOLIO,
  TEAM as STATIC_TEAM,
  TESTIMONIALS as STATIC_TESTIMONIALS,
  type ServiceIcon,
  type SkillCategory,
  type StatIcon,
  type PortfolioCategory,
} from "@/lib/data";

const REVALIDATE = 60;

export type CmsService = {
  id: string;
  icon: ServiceIcon;
  title: string;
  description: string;
  features: string[];
};

export type CmsSkill = { name: string; level: number; category: SkillCategory };

export type CmsStat = {
  label: string;
  value: number;
  suffix: string;
  icon: StatIcon;
  color: string;
};

export type CmsProject = {
  id: string;
  title: string;
  category: Exclude<PortfolioCategory, "Tous">;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
  gradient: [string, string];
};

export type CmsTeamMember = {
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
};

export type CmsTestimonial = { name: string; role: string; quote: string };

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  const db = await tryConnectDB();
  if (!db) return fallback;
  try {
    return await fn();
  } catch (err) {
    void err;
    return fallback;
  }
}

export const getServices = unstable_cache(
  async (): Promise<CmsService[]> =>
    safeFetch(async () => {
      const docs = await Service.find({}).sort({ order: 1 }).lean();
      if (docs.length === 0) throw new Error("empty");
      return docs.map((d) => ({
        id: String(d._id),
        icon: d.icon as ServiceIcon,
        title: d.title as string,
        description: d.description as string,
        features: (d.features as string[]) ?? [],
      }));
    }, STATIC_SERVICES.map((s) => ({ ...s }))),
  ["cms:services"],
  { revalidate: REVALIDATE, tags: ["cms:services"] }
);

export const getSkills = unstable_cache(
  async (): Promise<CmsSkill[]> =>
    safeFetch(async () => {
      const docs = await Skill.find({}).sort({ category: 1, order: 1 }).lean();
      if (docs.length === 0) throw new Error("empty");
      return docs.map((d) => ({
        name: d.name as string,
        level: d.level as number,
        category: d.category as SkillCategory,
      }));
    }, STATIC_SKILLS.map((s) => ({ ...s }))),
  ["cms:skills"],
  { revalidate: REVALIDATE, tags: ["cms:skills"] }
);

const STAT_DEFAULT_COLORS = ["#00d4ff", "#0066cc", "#00d4ff", "#0066cc"];

export const getStats = unstable_cache(
  async (): Promise<CmsStat[]> =>
    safeFetch(
      async () => {
        const docs = await Stat.find({}).sort({ order: 1 }).lean();
        if (docs.length === 0) throw new Error("empty");
        return docs.map((d) => ({
          label: d.label as string,
          value: d.value as number,
          suffix: (d.suffix as string) ?? "+",
          icon: (d.icon as StatIcon) ?? "sparkle",
          color: (d.color as string) ?? "#00d4ff",
        }));
      },
      STATIC_STATS.map((s, i) => ({
        label: s.label,
        value: s.value,
        suffix: s.suffix ?? "+",
        icon: s.icon,
        color: STAT_DEFAULT_COLORS[i % STAT_DEFAULT_COLORS.length],
      }))
    ),
  ["cms:stats"],
  { revalidate: REVALIDATE, tags: ["cms:stats"] }
);

export const getProjects = unstable_cache(
  async (): Promise<CmsProject[]> =>
    safeFetch(async () => {
      const docs = await Project.find({}).sort({ order: 1 }).lean();
      if (docs.length === 0) throw new Error("empty");
      return docs.map((d) => ({
        id: String(d._id),
        title: d.title as string,
        category: d.category as Exclude<PortfolioCategory, "Tous">,
        description: d.description as string,
        tags: (d.tags as string[]) ?? [],
        link: d.link as string | undefined,
        repo: d.repo as string | undefined,
        gradient: [
          (d.gradient as string[])?.[0] ?? "#0066cc",
          (d.gradient as string[])?.[1] ?? "#00d4ff",
        ] as [string, string],
      }));
    }, STATIC_PORTFOLIO.map((p) => ({ ...p }))),
  ["cms:projects"],
  { revalidate: REVALIDATE, tags: ["cms:projects"] }
);

export const getTeam = unstable_cache(
  async (): Promise<CmsTeamMember[]> =>
    safeFetch(async () => {
      const docs = await TeamMember.find({}).sort({ order: 1 }).lean();
      if (docs.length === 0) throw new Error("empty");
      return docs.map((d) => ({
        name: d.name as string,
        role: d.role as string,
        bio: d.bio as string,
        linkedin: d.linkedin as string | undefined,
      }));
    }, STATIC_TEAM.map((m) => ({ ...m }))),
  ["cms:team"],
  { revalidate: REVALIDATE, tags: ["cms:team"] }
);

export const getTestimonials = unstable_cache(
  async (): Promise<CmsTestimonial[]> =>
    safeFetch(async () => {
      const docs = await Testimonial.find({}).sort({ order: 1 }).lean();
      if (docs.length === 0) throw new Error("empty");
      return docs.map((d) => ({
        name: d.name as string,
        role: d.role as string,
        quote: d.quote as string,
      }));
    }, STATIC_TESTIMONIALS.map((t) => ({ ...t }))),
  ["cms:testimonials"],
  { revalidate: REVALIDATE, tags: ["cms:testimonials"] }
);
