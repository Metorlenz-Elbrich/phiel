"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLang } from "@/lib/language-context";

const BrainAnimation = dynamic(
  () => import("@/components/ui/brain-animation"),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

export default function HeroSection() {
  const { t } = useLang();
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:`
            linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)
          `,
          backgroundSize:"48px 48px",
        }}
      />
      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{background:"linear-gradient(to bottom,transparent,var(--background))"}}
      />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 min-h-screen py-24">

          {/* ── LEFT: text ── */}
          <div className="flex-1 max-w-lg">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="block w-6 h-px"
                style={{background:"linear-gradient(90deg,#0066cc,#00d4ff)"}}/>
              <span className="text-xs font-semibold tracking-[0.22em] uppercase"
                style={{color:"var(--color-phi-cyan)"}}>
                {t.hero.eyebrow}
              </span>
            </div>

            {/* Headline — t.hero.title (colore "PhiBrain") */}
            <h1 className="font-display leading-[1.08] mb-6"
              style={{fontSize:"clamp(2.4rem,4.5vw,3.5rem)",fontWeight:900}}>
              {(() => {
                const parts = t.hero.title.split("PhiBrain");
                return (
                  <>
                    {parts[0]}
                    {parts.length > 1 && (
                      <>
                        <span style={{color:"var(--color-phi-cyan)"}}>PhiBrain</span>
                        {parts.slice(1).join("PhiBrain")}
                      </>
                    )}
                  </>
                );
              })()}
            </h1>

            {/* Description */}
            <p className="text-base leading-relaxed mb-8 max-w-md"
              style={{color:"var(--foreground)",opacity:0.65}}>
              {t.hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12">
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background:"linear-gradient(135deg,#0066cc,#00d4ff)",
                  boxShadow:"0 4px 24px rgba(0,212,255,0.2)",
                }}
              >
                {t.hero.cta1}
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="#portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  border:"1px solid var(--border)",
                  color:"var(--foreground)",
                  background:"var(--surface)",
                }}
              >
                {t.hero.cta2}
              </Link>
            </div>

            {/* Stats strip */}
            <div className="flex gap-10 pt-6"
              style={{borderTop:"1px solid var(--border)"}}>
              {[
                {value:"20+",label:t.stats.items[0]},
                {value:"13", label:t.stats.items[1]},
                {value:"4",  label:t.stats.items[3]},
              ].map(s=>(
                <div key={s.label}>
                  <div className="text-2xl font-black"
                    style={{color:"var(--color-phi-cyan)"}}>{s.value}</div>
                  <div className="text-xs mt-0.5"
                    style={{color:"var(--foreground)",opacity:0.5}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: brain ── */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative w-full" style={{maxWidth:"500px",aspectRatio:"1/1"}}>
              {/* Background glow */}
              <div aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:"radial-gradient(circle,rgba(0,102,204,0.18) 0%,transparent 65%)",
                  transform:"scale(1.25)",
                  filter:"blur(35px)",
                }}/>
              <BrainAnimation />
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{opacity:0.4}} aria-hidden="true">
        <span className="text-xs tracking-widest uppercase"
          style={{color:"var(--foreground)",fontSize:"10px",letterSpacing:"0.3em"}}>
          Explorer
        </span>
        <div className="w-px h-10"
          style={{background:"linear-gradient(to bottom,var(--color-phi-cyan),transparent)"}}/>
      </div>
    </section>
  );
}

export { HeroSection };
