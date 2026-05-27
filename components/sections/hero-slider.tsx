"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/language-context";

type SlideData = {
  phrase_fr: string;
  phrase_en: string;
  imageUrl:  string;
  order:     number;
};

// Fallback statique si MongoDB est inaccessible
const STATIC_SLIDES: SlideData[] = [
  { phrase_fr: "On transforme vos idées en code.",       phrase_en: "We turn your ideas into code.",             imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80", order: 0 },
  { phrase_fr: "Du premier croquis au déploiement.",     phrase_en: "From first sketch to deployment.",          imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80", order: 1 },
  { phrase_fr: "Une marque qui se reconnaît partout.",   phrase_en: "A brand that stands out everywhere.",       imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80", order: 2 },
  { phrase_fr: "Chaque pixel a une raison d'être.",      phrase_en: "Every pixel has a purpose.",               imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80", order: 3 },
  { phrase_fr: "Le futur, on le construit maintenant.",  phrase_en: "The future, we build it now.",             imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=80", order: 4 },
  { phrase_fr: "L'ingénierie au service de l'ambition.", phrase_en: "Engineering at the service of ambition.", imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=80", order: 5 },
];

type Mode = "typing" | "pausing" | "erasing" | "switching";

export default function HeroSlider() {
  const { lang } = useLang();
  const [slides, setSlides]       = useState<SlideData[]>(STATIC_SLIDES);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [mode,      setMode]      = useState<Mode>("typing");
  const [bgFade,    setBgFade]    = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch depuis MongoDB — remplace les slides statiques si dispo
  useEffect(() => {
    fetch("/api/slides")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.slides) && data.slides.length > 0) {
          setSlides(data.slides);
          setPhraseIdx(0);
          setCharIdx(0);
          setMode("typing");
        }
      })
      .catch(() => { /* garder fallback statique */ });
  }, []);

  // Quand la langue change → retaper depuis le début
  useEffect(() => {
    setCharIdx(0);
    setMode("typing");
  }, [lang]);

  const slide   = slides[phraseIdx] ?? slides[0];
  const phrase  = lang === "en" && slide.phrase_en ? slide.phrase_en : slide.phrase_fr;
  const displayed = phrase.slice(0, charIdx);

  // Backgrounds uniques pour le rendu
  const uniqueImages  = Array.from(new Set(slides.map((s) => s.imageUrl)));
  const currentBgIdx  = uniqueImages.indexOf(slide.imageUrl);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (mode === "typing") {
      if (charIdx < phrase.length) {
        timeoutRef.current = setTimeout(() => setCharIdx((c) => c + 1), 55);
      } else {
        timeoutRef.current = setTimeout(() => setMode("pausing"), 2200);
      }
    }

    if (mode === "pausing") {
      timeoutRef.current = setTimeout(() => setMode("erasing"), 100);
    }

    if (mode === "erasing") {
      if (charIdx > 0) {
        timeoutRef.current = setTimeout(() => setCharIdx((c) => c - 1), 28);
      } else {
        setMode("switching");
      }
    }

    if (mode === "switching") {
      const next    = (phraseIdx + 1) % slides.length;
      const sameImg = slides[next]?.imageUrl === slides[phraseIdx]?.imageUrl;

      if (!sameImg) {
        setBgFade(true);
        timeoutRef.current = setTimeout(() => {
          setBgFade(false);
          setPhraseIdx(next);
          setCharIdx(0);
          setMode("typing");
        }, 800);
      } else {
        timeoutRef.current = setTimeout(() => {
          setPhraseIdx(next);
          setCharIdx(0);
          setMode("typing");
        }, 120);
      }
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [mode, charIdx, phraseIdx, phrase, slides]);

  // Helpers navigation manuelle
  function goTo(idx: number) {
    const sameImg = slides[idx]?.imageUrl === slides[phraseIdx]?.imageUrl;
    if (!sameImg) {
      setBgFade(true);
      setTimeout(() => { setBgFade(false); setPhraseIdx(idx); setCharIdx(0); setMode("typing"); }, 400);
    } else {
      setPhraseIdx(idx); setCharIdx(0); setMode("typing");
    }
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 560 }}
    >
      {/* ── Backgrounds ── */}
      {uniqueImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === currentBgIdx ? (bgFade ? 0 : 1) : 0,
            transition: "opacity 0.8s ease",
            zIndex: 0,
          }}
        />
      ))}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg,rgba(5,8,16,0.90) 0%,rgba(5,8,16,0.72) 60%,rgba(5,8,16,0.82) 100%)",
          zIndex: 1,
        }}
      />

      {/* ── Contenu centré ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ zIndex: 3 }}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-8" style={{ background: "linear-gradient(90deg,transparent,#00d4ff)" }} />
          <span
            className="text-xs font-semibold tracking-[0.28em] uppercase transition-opacity duration-500"
            style={{ color: "#00d4ff", opacity: bgFade ? 0 : 1 }}
          >
            PhiBrain Inc
          </span>
          <span className="h-px w-8" style={{ background: "linear-gradient(90deg,#00d4ff,transparent)" }} />
        </div>

        {/* Typewriter */}
        <div
          style={{
            minHeight: "clamp(80px,14vw,160px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            className="font-display font-black text-white leading-tight"
            style={{ fontSize: "clamp(2.4rem,5.5vw,5rem)", maxWidth: "16ch" }}
          >
            {displayed}
            <span
              style={{
                display: "inline-block",
                width: "3px",
                height: "0.85em",
                background: "#00d4ff",
                marginLeft: "4px",
                verticalAlign: "middle",
                borderRadius: "2px",
                animation: "blink 1s step-end infinite",
              }}
              aria-hidden="true"
            />
          </h1>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40" aria-hidden="true">
          <span style={{ fontSize: "9px", letterSpacing: "0.3em", color: "#fff", textTransform: "uppercase" }}>
            Explorer
          </span>
          <div className="w-px h-8" style={{ background: "linear-gradient(to bottom,#00d4ff,transparent)" }} />
        </div>
      </div>

      {/* ── Flèches de navigation ── */}
      {(["prev", "next"] as const).map((dir) => (
        <button
          key={dir}
          onClick={() => goTo(dir === "prev"
            ? (phraseIdx - 1 + slides.length) % slides.length
            : (phraseIdx + 1) % slides.length
          )}
          aria-label={dir === "prev" ? "Précédent" : "Suivant"}
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full transition-all hover:scale-110"
          style={{
            [dir === "prev" ? "left" : "right"]: "2rem",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            color: "#fff",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={dir === "prev" ? "M10 4l-6 4 6 4" : "M6 4l6 4-6 4"} />
          </svg>
        </button>
      ))}

      {/* ── Dots de progression ── */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2" style={{ zIndex: 4 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-500"
            style={{
              width:  i === phraseIdx ? "20px" : "6px",
              height: "6px",
              background: i === phraseIdx
                ? "linear-gradient(90deg,#0066cc,#00d4ff)"
                : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      {/* ── Barre de progression par image ── */}
      <div className="absolute bottom-0 left-0 right-0 flex" style={{ zIndex: 4 }}>
        {uniqueImages.map((img, i) => (
          <div key={img} className="flex-1 h-0.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            {i === currentBgIdx && (
              <div
                className="h-full origin-left"
                style={{
                  background: "linear-gradient(90deg,#0066cc,#00d4ff)",
                  animation: `progress ${slides.filter((s) => s.imageUrl === img).length * 7}s linear forwards`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes progress { from{transform:scaleX(0)} to{transform:scaleX(1)} }
      `}</style>
    </section>
  );
}

export { HeroSlider };
