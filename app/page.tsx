import HeroSlider from "@/components/sections/hero-slider";
import HeroSection from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { StatsSection } from "@/components/sections/stats-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { TeamSection } from "@/components/sections/team-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactSection } from "@/components/sections/contact-section";
import {
  getServices,
  getSkills,
  getStats,
  getProjects,
  getTeam,
  getTestimonials,
} from "@/lib/cms";

// Revalidation 60 s — cf. lib/cms.ts (unstable_cache).
export const revalidate = 60;

export default async function HomePage() {
  const [services, skills, stats, projects, team, testimonials] = await Promise.all([
    getServices(),
    getSkills(),
    getStats(),
    getProjects(),
    getTeam(),
    getTestimonials(),
  ]);

  return (
    <>
      <HeroSlider />
      <HeroSection />
      <ServicesSection services={services} />
      <SkillsSection skills={skills} />
      <StatsSection stats={stats} />
      <PortfolioSection projects={projects} />
      <TeamSection team={team} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection />
    </>
  );
}
