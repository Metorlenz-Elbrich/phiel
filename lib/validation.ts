/**
 * Zod schemas — OWASP A03 (Injection).
 * Tout input client passe par un schéma avant de toucher la DB.
 */

import { z } from "zod";

// eslint-disable-next-line no-control-regex
const ctrlChars = /[ -]/;

const safeString = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((v) => !ctrlChars.test(v), {
      message: "Caractères de contrôle interdits",
    });

/** Champ texte optionnel (traduction EN peut être vide ou absente) */
const optText = (max: number) => z.string().trim().max(max).optional().default("");

const urlField  = z.string().url().max(2048);
const hexColor  = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const SERVICE_ICONS = [
  "palette", "code", "smartphone", "sparkle", "server", "mail",
  "branding", "web", "mobile", // legacy
] as const;

export const ServiceSchema = z.object({
  icon:           z.enum(SERVICE_ICONS),
  title_fr:       safeString(100),
  title_en:       optText(100),
  description_fr: safeString(500),
  description_en: optText(500),
  features_fr:    z.array(safeString(80)).max(10).optional().default([]),
  features_en:    z.array(z.string().trim().max(80)).max(10).optional().default([]),
  order:          z.number().int().min(0).default(0),
});
export type ServiceInput = z.infer<typeof ServiceSchema>;

export const SkillSchema = z.object({
  name_fr:  safeString(80),
  name_en:  optText(80),
  level:    z.number().int().min(0).max(100),
  category: z.string().trim().min(1).max(60),
  devicon:  z.string().trim().max(40).default(""),
  order:    z.number().int().min(0).default(0),
});
export type SkillInput = z.infer<typeof SkillSchema>;

export const StatSchema = z.object({
  label_fr: safeString(80),
  label_en: optText(80),
  value:    z.number().int().min(0),
  suffix:   z.string().trim().max(8).default(""),
  icon:     z.string().trim().max(32).default("sparkle"),
  color:    hexColor.default("#00d4ff"),
  order:    z.number().int().min(0).default(0),
});
export type StatInput = z.infer<typeof StatSchema>;

export const ProjectSchema = z.object({
  title_fr:       safeString(100),
  title_en:       optText(100),
  category:       z.string().trim().min(1).max(60),
  description_fr: safeString(500),
  description_en: optText(500),
  tags:     z.array(safeString(40)).max(8).optional().default([]),
  link:     urlField.optional().or(z.literal("").transform(() => undefined)),
  repo:     urlField.optional().or(z.literal("").transform(() => undefined)),
  imageUrl: z.string().max(2048).default(""),
  gradient: z.tuple([hexColor, hexColor]).default(["#0066cc", "#00d4ff"]),
  order:    z.number().int().min(0).default(0),
});
export type ProjectInput = z.infer<typeof ProjectSchema>;

export const TeamMemberSchema = z.object({
  name_fr:  safeString(80),
  name_en:  optText(80),
  role_fr:  safeString(120),
  role_en:  optText(120),
  bio_fr:   safeString(600),
  bio_en:   optText(600),
  linkedin: urlField.optional().or(z.literal("").transform(() => undefined)),
  order:    z.number().int().min(0).default(0),
});
export type TeamMemberInput = z.infer<typeof TeamMemberSchema>;

export const TestimonialSchema = z.object({
  name_fr:  safeString(80),
  name_en:  optText(80),
  role_fr:  safeString(120),
  role_en:  optText(120),
  quote_fr: safeString(800),
  quote_en: optText(800),
  order:    z.number().int().min(0).default(0),
});
export type TestimonialInput = z.infer<typeof TestimonialSchema>;

export const LoginSchema = z.object({
  email:    z.string().email().max(254),
  password: z.string().min(8).max(128),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const ObjectIdSchema = z.string().regex(/^[a-f0-9]{24}$/i, "ID invalide");
