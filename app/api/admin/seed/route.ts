/**
 * POST /api/admin/seed — importe les données bilingues FR/EN dans MongoDB.
 * Idempotent : ne fait rien si la collection contient déjà des docs.
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
import { Slide } from "@/lib/models/Slide";

// ─── Données bilingues complètes ─────────────────────────────────────────────

const SERVICES_DATA = [
  {
    icon: "palette", order: 0,
    title_fr: "Branding & Identité",
    title_en: "Branding & Identity",
    description_fr: "Logos, chartes graphiques, supports print et social — une marque cohérente qui se reconnaît partout.",
    description_en: "Logos, graphic charters, print and social assets — a consistent brand recognized everywhere.",
    features_fr: ["Logo & système visuel", "Charte graphique", "Réseaux sociaux", "Print & packaging"],
    features_en: ["Logo & visual system", "Brand guidelines", "Social media", "Print & packaging"],
  },
  {
    icon: "code", order: 1,
    title_fr: "Sites & Plateformes Web",
    title_en: "Websites & Web Platforms",
    description_fr: "Sites vitrines, dashboards et plateformes sur-mesure conçus pour la performance, le SEO et la conversion.",
    description_en: "Showcase sites, dashboards and custom platforms built for performance, SEO and conversion.",
    features_fr: ["Sites vitrines", "E-commerce", "Dashboards SaaS", "SEO & analytics"],
    features_en: ["Showcase websites", "E-commerce", "SaaS Dashboards", "SEO & analytics"],
  },
  {
    icon: "smartphone", order: 2,
    title_fr: "Apps Mobiles",
    title_en: "Mobile Apps",
    description_fr: "Applications iOS et Android natives ou cross-platform, pensées pour des expériences fluides au quotidien.",
    description_en: "Native or cross-platform iOS and Android apps built for smooth everyday experiences.",
    features_fr: ["Flutter & Kotlin", "UX mobile", "Notifications & offline", "Publication stores"],
    features_en: ["Flutter & Kotlin", "Mobile UX", "Notifications & offline", "Store publishing"],
  },
];

const SKILLS_DATA = [
  { name_fr: "HTML5",      name_en: "HTML5",       level: 95, category: "Front-end", devicon: "html5",       order: 0 },
  { name_fr: "CSS3",       name_en: "CSS3",        level: 92, category: "Front-end", devicon: "css3",        order: 1 },
  { name_fr: "JavaScript", name_en: "JavaScript",  level: 90, category: "Front-end", devicon: "javascript",  order: 2 },
  { name_fr: "React",      name_en: "React",       level: 88, category: "Front-end", devicon: "react",       order: 3 },
  { name_fr: "TypeScript", name_en: "TypeScript",  level: 82, category: "Front-end", devicon: "typescript",  order: 4 },
  { name_fr: "PHP",        name_en: "PHP",         level: 80, category: "Back-end",  devicon: "php",         order: 5 },
  { name_fr: "Laravel",    name_en: "Laravel",     level: 82, category: "Back-end",  devicon: "laravel",     order: 6 },
  { name_fr: "Node.js",    name_en: "Node.js",     level: 78, category: "Back-end",  devicon: "nodejs",      order: 7 },
  { name_fr: "Flutter",    name_en: "Flutter",     level: 86, category: "Mobile",    devicon: "flutter",     order: 8 },
  { name_fr: "Kotlin",     name_en: "Kotlin",      level: 75, category: "Mobile",    devicon: "kotlin",      order: 9 },
  { name_fr: "Adobe CC",   name_en: "Adobe CC",    level: 88, category: "Design",    devicon: "photoshop",   order: 10 },
  { name_fr: "Figma",      name_en: "Figma",       level: 85, category: "Design",    devicon: "figma",       order: 11 },
];

const STATS_DATA = [
  { label_fr: "Projets livrés",      label_en: "Projects delivered",   value: 20, suffix: "+", icon: "sparkle",    color: "#00d4ff", order: 0 },
  { label_fr: "Apps mobiles",        label_en: "Mobile apps",          value: 13, suffix: "+", icon: "smartphone", color: "#0066cc", order: 1 },
  { label_fr: "Sites web",           label_en: "Websites",             value: 3,  suffix: "+", icon: "code",       color: "#00d4ff", order: 2 },
  { label_fr: "Identités & designs", label_en: "Identities & designs", value: 4,  suffix: "+", icon: "palette",    color: "#0066cc", order: 3 },
];

const PROJECTS_DATA = [
  {
    title_fr: "PhiMind", title_en: "PhiMind",
    category: "Apps",
    description_fr: "Application mobile de productivité augmentée par IA, agenda et notes intelligents.",
    description_en: "AI-powered mobile productivity app with smart agenda and intelligent notes.",
    tags: ["Flutter", "IA", "Productivité"],
    link: "", repo: "https://github.com/phibraininc",
    imageUrl: "", gradient: ["#6366f1", "#22d3ee"], order: 0,
  },
  {
    title_fr: "PhiPay", title_en: "PhiPay",
    category: "Apps",
    description_fr: "Wallet mobile et plateforme de paiement marchand pour PME locales.",
    description_en: "Mobile wallet and merchant payment platform for local SMEs.",
    tags: ["Kotlin", "Fintech", "QR"],
    link: "", repo: "https://github.com/phibraininc",
    imageUrl: "", gradient: ["#16a34a", "#0ea5e9"], order: 1,
  },
  {
    title_fr: "PhiShop", title_en: "PhiShop",
    category: "Sites",
    description_fr: "Plateforme e-commerce headless multi-vendeurs avec back-office sur-mesure.",
    description_en: "Headless multi-vendor e-commerce platform with a custom back-office.",
    tags: ["Next.js", "Laravel", "E-commerce"],
    link: "", repo: "https://github.com/phibraininc",
    imageUrl: "", gradient: ["#f97316", "#ec4899"], order: 2,
  },
  {
    title_fr: "PhiStudio", title_en: "PhiStudio",
    category: "Design",
    description_fr: "Identité visuelle complète pour un studio de production audiovisuelle.",
    description_en: "Complete visual identity for an audiovisual production studio.",
    tags: ["Branding", "Print", "Motion"],
    link: "", repo: "",
    imageUrl: "", gradient: ["#8b5cf6", "#ec4899"], order: 3,
  },
  {
    title_fr: "PhiTrack", title_en: "PhiTrack",
    category: "Apps",
    description_fr: "Suivi de flotte et géolocalisation temps réel pour entreprises logistiques.",
    description_en: "Fleet tracking and real-time geolocation for logistics companies.",
    tags: ["Flutter", "Maps", "Realtime"],
    link: "", repo: "https://github.com/phibraininc",
    imageUrl: "", gradient: ["#0ea5e9", "#14b8a6"], order: 4,
  },
  {
    title_fr: "PhiBrain.com", title_en: "PhiBrain.com",
    category: "Sites",
    description_fr: "Site vitrine officiel de l'agence — Next.js, design system maison.",
    description_en: "Official agency showcase site — Next.js, custom design system.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    link: "", repo: "https://github.com/phibraininc/site",
    imageUrl: "", gradient: ["#0066cc", "#00d4ff"], order: 5,
  },
];

const TEAM_DATA = [
  {
    name_fr: "Ange Boli", name_en: "Ange Boli",
    role_fr: "CEO & Lead Developer", role_en: "CEO & Lead Developer",
    bio_fr: "Architecte web et mobile, passionné d'IA et d'expériences produit. Pilote la stratégie technique et le delivery client.",
    bio_en: "Web and mobile architect, passionate about AI and product experiences. Drives technical strategy and client delivery.",
    linkedin: "https://www.linkedin.com/", order: 0,
  },
];

const SLIDES_DATA = [
  { phrase_fr: "On transforme vos idées en code.",        phrase_en: "We turn your ideas into code.",              imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80", order: 0 },
  { phrase_fr: "Du premier croquis au déploiement.",      phrase_en: "From first sketch to deployment.",           imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80", order: 1 },
  { phrase_fr: "Une marque qui se reconnaît partout.",    phrase_en: "A brand that stands out everywhere.",        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80", order: 2 },
  { phrase_fr: "Chaque pixel a une raison d'être.",       phrase_en: "Every pixel has a purpose.",                imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80", order: 3 },
  { phrase_fr: "Le futur, on le construit maintenant.",   phrase_en: "The future, we build it now.",              imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=80", order: 4 },
  { phrase_fr: "L'ingénierie au service de l'ambition.", phrase_en: "Engineering at the service of ambition.",   imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=80", order: 5 },
];

const TESTIMONIALS_DATA = [
  {
    name_fr: "Client #1", name_en: "Client #1",
    role_fr: "Fondateur, startup logistique", role_en: "Founder, logistics startup",
    quote_fr: "L'équipe a transformé notre idée en une app fonctionnelle en 6 semaines. La qualité du design et de l'exécution est impressionnante.",
    quote_en: "The team transformed our idea into a working app in 6 weeks. The quality of design and execution is impressive.",
    order: 0,
  },
  {
    name_fr: "Client #2", name_en: "Client #2",
    role_fr: "Directrice marketing, retail", role_en: "Marketing Director, retail",
    quote_fr: "PhiBrain a refondu notre identité et notre site. Nos visites ont doublé et nos prospects sont enfin qualifiés.",
    quote_en: "PhiBrain redesigned our identity and website. Our visits doubled and our leads are finally qualified.",
    order: 1,
  },
  {
    name_fr: "Client #3", name_en: "Client #3",
    role_fr: "CTO, fintech", role_en: "CTO, fintech",
    quote_fr: "Une équipe rare : à l'aise sur le produit, le code et le design. Communication claire, livrables au rendez-vous.",
    quote_en: "A rare team: comfortable with product, code and design. Clear communication, deliverables on time.",
    order: 2,
  },
];

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) return unauthorized();

    await connectDB();
    const results: Record<string, number> = {};

    if ((await Service.countDocuments()) === 0) {
      results.services = (await Service.insertMany(SERVICES_DATA)).length;
    }

    if ((await Skill.countDocuments()) === 0) {
      results.skills = (await Skill.insertMany(SKILLS_DATA)).length;
    }

    if ((await Stat.countDocuments()) === 0) {
      results.stats = (await Stat.insertMany(STATS_DATA)).length;
    }

    if ((await Project.countDocuments()) === 0) {
      results.projects = (await Project.insertMany(PROJECTS_DATA)).length;
    }

    if ((await TeamMember.countDocuments()) === 0) {
      results.team = (await TeamMember.insertMany(TEAM_DATA)).length;
    }

    if ((await Testimonial.countDocuments()) === 0) {
      results.testimonials = (await Testimonial.insertMany(TESTIMONIALS_DATA)).length;
    }

    if ((await Slide.countDocuments()) === 0) {
      results.slides = (await Slide.insertMany(SLIDES_DATA)).length;
    }

    securityLog.adminAction({
      userId:   session.user.email ?? "admin",
      action:   "create",
      resource: "seed",
    });

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    return apiError(err, { context: "POST /api/admin/seed" });
  }
}
