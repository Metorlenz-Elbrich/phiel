"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/language-context";

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=80",
];

/** Mapping fixe : 2 phrases par background (0/0/1/1/2/2). */
const BG_BY_PHRASE = [0, 0, 1, 1, 2, 2] as const;

type Mode = "typing" | "pausing" | "erasing" | "switching";

export default function HeroSlider() {
  const { t, lang } = useLang();
  const PHRASES = t.slider.phrases.map((text, i) => ({ text, bg: BG_BY_PHRASE[i] ?? 0 }));

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [mode,      setMode]      = useState<Mode>("typing");
  const [bgIdx,     setBgIdx]     = useState(0);
  const [bgFade,    setBgFade]    = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Quand la langue change, on retape la phrase courante depuis le début
  useEffect(() => {
    setCharIdx(0);
    setMode("typing");
  }, [lang]);

  const phrase = PHRASES[phraseIdx];
  const displayed = phrase.text.slice(0, charIdx);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (mode === "typing") {
      if (charIdx < phrase.text.length) {
        timeoutRef.current = setTimeout(() => setCharIdx(c => c + 1), 55);
      } else {
        timeoutRef.current = setTimeout(() => setMode("pausing"), 2200);
      }
    }

    if (mode === "pausing") {
      timeoutRef.current = setTimeout(() => setMode("erasing"), 100);
    }

    if (mode === "erasing") {
      if (charIdx > 0) {
        timeoutRef.current = setTimeout(() => setCharIdx(c => c - 1), 28);
      } else {
        setMode("switching");
      }
    }

    if (mode === "switching") {
      const next = (phraseIdx + 1) % PHRASES.length;
      const nextBg = PHRASES[next].bg;

      if (nextBg !== bgIdx) {
        setBgFade(true);
        timeoutRef.current = setTimeout(() => {
          setBgIdx(nextBg);
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
  }, [mode, charIdx, phraseIdx, bgIdx, phrase.text]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 560 }}
    >
      {/* ── Backgrounds ── */}
      {BACKGROUNDS.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === bgIdx ? (bgFade ? 0 : 1) : 0,
            transition: "opacity 0.8s ease",
            zIndex: 0,
          }}
        />
      ))}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg,rgba(5,8,16,0.90) 0%,rgba(5,8,16,0.72) 60%,rgba(5,8,16,0.82) 100%)",
          zIndex: 1,
        }}
      />



      {/* ── Centred content ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ zIndex: 3 }}
      >
        {/* Category eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-8" style={{ background:"linear-gradient(90deg,transparent,#00d4ff)" }} />
          <span
            className="text-xs font-semibold tracking-[0.28em] uppercase transition-opacity duration-500"
            style={{ color:"#00d4ff", opacity: bgFade ? 0 : 1 }}
          >
            PhiBrain Inc
          </span>
          <span className="h-px w-8" style={{ background:"linear-gradient(90deg,#00d4ff,transparent)" }} />
        </div>

        {/* Typewriter text */}
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
            style={{ fontSize:"clamp(2.4rem,5.5vw,5rem)", maxWidth:"16ch" }}
          >
            {displayed}
            {/* Blinking cursor */}
            <span
              style={{
                display:"inline-block",
                width:"3px",
                height:"0.85em",
                background:"#00d4ff",
                marginLeft:"4px",
                verticalAlign:"middle",
                borderRadius:"2px",
                animation:"blink 1s step-end infinite",
              }}
              aria-hidden="true"
            />
          </h1>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40"
          aria-hidden="true"
        >
          <span style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#fff", textTransform:"uppercase" }}>
            Explorer
          </span>
          <div className="w-px h-8" style={{ background:"linear-gradient(to bottom,#00d4ff,transparent)" }}/>
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      {([
        { dir: "prev", icon: "M10 4l-6 4 6 4", action: () => {
          const prev = (phraseIdx - 1 + PHRASES.length) % PHRASES.length;
          setPhraseIdx(prev); setCharIdx(0); setMode("typing"); setBgIdx(PHRASES[prev].bg);
        }},
        { dir: "next", icon: "M6 4l6 4-6 4", action: () => {
          const next = (phraseIdx + 1) % PHRASES.length;
          setPhraseIdx(next); setCharIdx(0); setMode("typing"); setBgIdx(PHRASES[next].bg);
        }},
      ] as const).map(({ dir, icon, action }) => (
        <button
          key={dir}
          onClick={action}
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
            <path d={icon}/>
          </svg>
        </button>
      ))}

      {/* Progress dots */}
      <div
        className="absolute bottom-8 right-8 flex items-center gap-2"
        style={{ zIndex: 4 }}
      >
        {BACKGROUNDS.map((_,i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width:  i === bgIdx ? "20px" : "6px",
              height: "6px",
              background: i === bgIdx
                ? "linear-gradient(90deg,#0066cc,#00d4ff)"
                : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 flex" style={{ zIndex:4 }}>
        {BACKGROUNDS.map((_,i)=>(
          <div key={i} className="flex-1 h-0.5 overflow-hidden" style={{background:"rgba(255,255,255,0.08)"}}>
            {i===bgIdx && (
              <div
                className="h-full origin-left"
                style={{
                  background:"linear-gradient(90deg,#0066cc,#00d4ff)",
                  animation:`progress ${PHRASES.filter(p=>p.bg===i).length * 7}s linear forwards`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes progress { from{transform:scaleX(0)} to{transform:scaleX(1)} }
      `}</style>
    </section>
  );
}

export { HeroSlider };
