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
  SERVICES  as STATIC_SERVICES,
  SKILLS    as STATIC_SKILLS,
  STATS     as STATIC_STATS,
  PORTFOLIO as STATIC_PORTFOLIO,
  TEAM      as STATIC_TEAM,
  TESTIMONIALS as STATIC_TESTIMONIALS,
  type ServiceIcon,
  type StatIcon,
} from "@/lib/data";

const REVALIDATE = 60;

// ─── Types publics ────────────────────────────────────────────────────────────

export type CmsService = {
  id:             string;
  icon:           ServiceIcon;
  title_fr:       string;
  title_en:       string;
  description_fr: string;
  description_en: string;
  features_fr:    string[];
  features_en:    string[];
};

export type CmsSkill = {
  name_fr:  string;
  name_en:  string;
  level:    number;
  category: string;
  devicon?: string;
};

export type CmsStat = {
  label_fr: string;
  label_en: string;
  value:    number;
  suffix:   string;
  icon:     StatIcon;
  color:    string;
};

export type CmsProject = {
  id:             string;
  title_fr:       string;
  title_en:       string;
  category:       string;
  description_fr: string;
  description_en: string;
  tags:     string[];
  link?:    string;
  repo?:    string;
  imageUrl?: string;
  gradient: [string, string];
};

export type CmsTeamMember = {
  name_fr: string;
  name_en: string;
  role_fr: string;
  role_en: string;
  bio_fr:  string;
  bio_en:  string;
  linkedin?: string;
};

export type CmsTestimonial = {
  name_fr:  string;
  name_en:  string;
  role_fr:  string;
  role_en:  string;
  quote_fr: string;
  quote_en: string;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

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

const s = (v: unknown) => String(v ?? "");

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export const getServices = unstable_cache(
  async (): Promise<CmsService[]> =>
    safeFetch(async () => {
      const docs = await Service.find({}).sort({ order: 1 }).lean();
      if (docs.length === 0) throw new Error("empty");
      return docs.map((d) => ({
        id:             String(d._id),
        icon:           s(d.icon) as ServiceIcon,
        title_fr:       s(d.title_fr),
        title_en:       s(d.title_en),
        description_fr: s(d.description_fr),
        description_en: s(d.description_en),
        features_fr:    (d.features_fr as string[]) ?? [],
        features_en:    (d.features_en as string[]) ?? [],
      }));
    }, STATIC_SERVICES.map((sv): CmsService => ({
      id:             sv.id,
      icon:           sv.icon as ServiceIcon,
      title_fr:       sv.title,
      title_en:       "",
      description_fr: sv.description,
      description_en: "",
      features_fr:    sv.features,
      features_en:    [],
    }))),
  ["cms:services"],
  { revalidate: REVALIDATE, tags: ["cms:services"] }
);

export const getSkills = unstable_cache(
  async (): Promise<CmsSkill[]> =>
    safeFetch(async () => {
      const docs = await Skill.find({}).sort({ category: 1, order: 1 }).lean();
      if (docs.length === 0) throw new Error("empty");
      return docs.map((d) => ({
        name_fr:  s(d.name_fr),
        name_en:  s(d.name_en),
        level:    d.level as number,
        category: s(d.category),
        devicon:  (d.devicon as string) || undefined,
      }));
    }, STATIC_SKILLS.map((sk): CmsSkill => ({
      name_fr:  sk.name,
      name_en:  "",
      level:    sk.level,
      category: sk.category,
      devicon:  sk.devicon || undefined,
    }))),
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
          label_fr: s(d.label_fr),
          label_en: s(d.label_en),
          value:    d.value as number,
          suffix:   s(d.suffix) || "+",
          icon:     (s(d.icon) || "sparkle") as StatIcon,
          color:    s(d.color) || "#00d4ff",
        }));
      },
      STATIC_STATS.map((st, i): CmsStat => ({
        label_fr: st.label,
        label_en: "",
        value:    st.value,
        suffix:   st.suffix ?? "+",
        icon:     st.icon,
        color:    STAT_DEFAULT_COLORS[i % STAT_DEFAULT_COLORS.length],
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
        id:             String(d._id),
        title_fr:       s(d.title_fr),
        title_en:       s(d.title_en),
        category:       s(d.category),
        description_fr: s(d.description_fr),
        description_en: s(d.description_en),
        tags:     (d.tags as string[]) ?? [],
        link:     d.link as string | undefined,
        repo:     d.repo as string | undefined,
        imageUrl: (d.imageUrl as string) || undefined,
        gradient: [
          (d.gradient as string[])?.[0] ?? "#0066cc",
          (d.gradient as string[])?.[1] ?? "#00d4ff",
        ] as [string, string],
      }));
    }, STATIC_PORTFOLIO.map((p): CmsProject => ({
      id:             p.id,
      title_fr:       p.title,
      title_en:       "",
      category:       p.category,
      description_fr: p.description,
      description_en: "",
      tags:     p.tags,
      link:     p.link,
      repo:     p.repo,
      imageUrl: undefined,
      gradient: p.gradient,
    }))),
  ["cms:projects"],
  { revalidate: REVALIDATE, tags: ["cms:projects"] }
);

export const getTeam = unstable_cache(
  async (): Promise<CmsTeamMember[]> =>
    safeFetch(async () => {
      const docs = await TeamMember.find({}).sort({ order: 1 }).lean();
      if (docs.length === 0) throw new Error("empty");
      return docs.map((d) => ({
        name_fr:  s(d.name_fr),
        name_en:  s(d.name_en),
        role_fr:  s(d.role_fr),
        role_en:  s(d.role_en),
        bio_fr:   s(d.bio_fr),
        bio_en:   s(d.bio_en),
        linkedin: d.linkedin as string | undefined,
      }));
    }, STATIC_TEAM.map((m): CmsTeamMember => ({
      name_fr:  m.name,
      name_en:  "",
      role_fr:  m.role,
      role_en:  "",
      bio_fr:   m.bio,
      bio_en:   "",
      linkedin: m.linkedin,
    }))),
  ["cms:team"],
  { revalidate: REVALIDATE, tags: ["cms:team"] }
);

export const getTestimonials = unstable_cache(
  async (): Promise<CmsTestimonial[]> =>
    safeFetch(async () => {
      const docs = await Testimonial.find({}).sort({ order: 1 }).lean();
      if (docs.length === 0) throw new Error("empty");
      return docs.map((d) => ({
        name_fr:  s(d.name_fr),
        name_en:  s(d.name_en),
        role_fr:  s(d.role_fr),
        role_en:  s(d.role_en),
        quote_fr: s(d.quote_fr),
        quote_en: s(d.quote_en),
      }));
    }, STATIC_TESTIMONIALS.map((t): CmsTestimonial => ({
      name_fr:  t.name,
      name_en:  "",
      role_fr:  t.role,
      role_en:  "",
      quote_fr: t.quote,
      quote_en: "",
    }))),
  ["cms:testimonials"],
  { revalidate: REVALIDATE, tags: ["cms:testimonials"] }
);
