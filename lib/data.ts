export const SITE = {
  name: "PhiBrain Inc",
  shortName: "PhiBrain",
  url: "https://phibraininc.github.io/site/",
  description:
    "PhiBrain Inc — agence tech qui conçoit des sites web, des applications mobiles et des identités de marque qui mêlent design, IA et performance.",
  tagline: "Là où la créativité rencontre l'intelligence.",
  email: "phibraininc@gmail.com",
  phones: ["+237 696 41 57 59", "+237 657 23 55 96"],
  location: "Douala · Yaoundé · Cameroun",
};

export const NAV_LINKS = [
  { label: "Accueil", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Compétences", href: "#skills" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Équipe", href: "#team" },
  { label: "Contact", href: "#contact" },
] as const;

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/phibraininc", icon: "github" as const },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" as const },
  { label: "Twitter", href: "https://twitter.com/", icon: "twitter" as const },
  { label: "Instagram", href: "https://instagram.com/", icon: "instagram" as const },
];

export type ServiceIcon = "branding" | "web" | "mobile";
export const SERVICES: {
  id: string;
  icon: ServiceIcon;
  title: string;
  description: string;
  features: string[];
}[] = [
  {
    id: "branding",
    icon: "branding",
    title: "Branding & Identité",
    description:
      "Logos, chartes graphiques, supports print et social — une marque cohérente qui se reconnaît partout.",
    features: ["Logo & système visuel", "Charte graphique", "Réseaux sociaux", "Print & packaging"],
  },
  {
    id: "web",
    icon: "web",
    title: "Sites & Plateformes Web",
    description:
      "Sites vitrines, dashboards et plateformes sur-mesure conçus pour la performance, le SEO et la conversion.",
    features: ["Sites vitrines", "E-commerce", "Dashboards SaaS", "SEO & analytics"],
  },
  {
    id: "mobile",
    icon: "mobile",
    title: "Apps Mobiles",
    description:
      "Applications iOS et Android natives ou cross-platform, pensées pour des expériences fluides au quotidien.",
    features: ["Flutter & Kotlin", "UX mobile", "Notifications & offline", "Publication stores"],
  },
];

export type SkillCategory = "Front-end" | "Back-end" | "Mobile" | "Design";
export const SKILLS: {
  name: string;
  level: number;
  category: SkillCategory;
}[] = [
  { name: "HTML5",      level: 95, category: "Front-end" },
  { name: "CSS3",       level: 92, category: "Front-end" },
  { name: "JavaScript", level: 90, category: "Front-end" },
  { name: "React",      level: 88, category: "Front-end" },
  { name: "TypeScript", level: 82, category: "Front-end" },
  { name: "PHP",        level: 80, category: "Back-end" },
  { name: "Laravel",    level: 82, category: "Back-end" },
  { name: "Node.js",    level: 78, category: "Back-end" },
  { name: "Flutter",    level: 86, category: "Mobile" },
  { name: "Kotlin",     level: 75, category: "Mobile" },
  { name: "Adobe CC",   level: 88, category: "Design" },
  { name: "Figma",      level: 85, category: "Design" },
];

export type StatIcon = "sparkle" | "smartphone" | "code" | "palette";
export const STATS: { label: string; value: number; suffix?: string; icon: StatIcon }[] = [
  { label: "Projets livrés",          value: 20, icon: "sparkle" },
  { label: "Apps mobiles",            value: 13, icon: "smartphone" },
  { label: "Sites web",               value: 3,  icon: "code" },
  { label: "Identités & designs",     value: 4,  icon: "palette" },
];

export type PortfolioCategory = "Tous" | "Apps" | "Design" | "Sites";
export const PORTFOLIO_FILTERS: PortfolioCategory[] = ["Tous", "Apps", "Design", "Sites"];

export const PORTFOLIO: {
  id: string;
  title: string;
  category: Exclude<PortfolioCategory, "Tous">;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
  /** Couleurs du dégradé d'illustration (background carte). */
  gradient: [string, string];
}[] = [
  {
    id: "phimind",
    title: "PhiMind",
    category: "Apps",
    description: "Application mobile de productivité augmentée par IA, agenda et notes intelligents.",
    tags: ["Flutter", "IA", "Productivité"],
    repo: "https://github.com/phibraininc",
    gradient: ["#6366f1", "#22d3ee"],
  },
  {
    id: "phipay",
    title: "PhiPay",
    category: "Apps",
    description: "Wallet mobile et plateforme de paiement marchand pour PME locales.",
    tags: ["Kotlin", "Fintech", "QR"],
    repo: "https://github.com/phibraininc",
    gradient: ["#16a34a", "#0ea5e9"],
  },
  {
    id: "phishop",
    title: "PhiShop",
    category: "Sites",
    description: "Plateforme e-commerce headless multi-vendeurs avec back-office sur-mesure.",
    tags: ["Next.js", "Laravel", "E-commerce"],
    repo: "https://github.com/phibraininc",
    gradient: ["#f97316", "#ec4899"],
  },
  {
    id: "phistudio",
    title: "PhiStudio",
    category: "Design",
    description: "Identité visuelle complète pour un studio de production audiovisuelle.",
    tags: ["Branding", "Print", "Motion"],
    gradient: ["#8b5cf6", "#ec4899"],
  },
  {
    id: "phitrack",
    title: "PhiTrack",
    category: "Apps",
    description: "Suivi de flotte et géolocalisation temps réel pour entreprises logistiques.",
    tags: ["Flutter", "Maps", "Realtime"],
    repo: "https://github.com/phibraininc",
    gradient: ["#0ea5e9", "#14b8a6"],
  },
  {
    id: "phibrain-site",
    title: "PhiBrain.com",
    category: "Sites",
    description: "Site vitrine officiel de l'agence — Next.js, Three.js, design system maison.",
    tags: ["Next.js", "Three.js", "Tailwind"],
    repo: "https://github.com/phibraininc/site",
    gradient: ["#0066cc", "#00d4ff"],
  },
  {
    id: "phiacademy",
    title: "PhiAcademy",
    category: "Design",
    description: "Identité et supports d'une académie de formation tech.",
    tags: ["Branding", "Social", "Print"],
    gradient: ["#f59e0b", "#ef4444"],
  },
  {
    id: "phicare",
    title: "PhiCare",
    category: "Apps",
    description: "App santé pour la prise de rendez-vous médicaux en ligne.",
    tags: ["Flutter", "Santé", "Booking"],
    repo: "https://github.com/phibraininc",
    gradient: ["#10b981", "#06b6d4"],
  },
];

export const TEAM: {
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
}[] = [
  {
    name: "Ange Boli",
    role: "CEO & Lead Developer",
    bio: "Architecte web et mobile, passionné d'IA et d'expériences produit. Pilote la stratégie technique et le delivery client.",
    linkedin: "https://www.linkedin.com/",
  },
];

export const TEAM_EXPANSION_MESSAGE =
  "Notre équipe est en pleine expansion — nous recrutons designers, mobile engineers et back-end developers. Envie de nous rejoindre ?";

export const TESTIMONIALS: {
  name: string;
  role: string;
  quote: string;
}[] = [
  {
    name: "Client #1",
    role: "Fondateur, startup logistique",
    quote:
      "L'équipe a transformé notre idée en une app fonctionnelle en 6 semaines. La qualité du design et de l'exécution est impressionnante.",
  },
  {
    name: "Client #2",
    role: "Directrice marketing, retail",
    quote:
      "PhiBrain a refondu notre identité et notre site. Nos visites ont doublé et nos prospects sont enfin qualifiés.",
  },
  {
    name: "Client #3",
    role: "CTO, fintech",
    quote:
      "Une équipe rare : à l'aise sur le produit, le code et le design. Communication claire, livrables au rendez-vous.",
  },
];
