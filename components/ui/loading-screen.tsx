"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FULL_TEXT = "PhiBrain";

export function LoadingScreen() {
  const [phase, setPhase] = useState<"loading" | "out" | "gone">("loading");
  const [typed, setTyped] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    // Sauter le loader si déjà vu dans cette session
    if (typeof window !== "undefined" && sessionStorage.getItem("phibrain-loaded") === "1") {
      setPhase("gone");
      return;
    }
    startedRef.current = true;

    // Effet typing
    let i = 0;
    const typer = window.setInterval(() => {
      i += 1;
      setTyped(FULL_TEXT.slice(0, i));
      if (i >= FULL_TEXT.length) window.clearInterval(typer);
    }, 110);

    const dismiss = () => {
      // Au moins 1.4 s visible, même si window.load est immédiat
      window.setTimeout(() => {
        setPhase("out");
        window.setTimeout(() => {
          setPhase("gone");
          try {
            sessionStorage.setItem("phibrain-loaded", "1");
          } catch {
            /* sessionStorage indisponible */
          }
        }, 450);
      }, 1400);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    // Failsafe : 6 s max
    const failsafe = window.setTimeout(dismiss, 6000);

    return () => {
      window.clearInterval(typer);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", dismiss);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden={phase === "out"}
      role="status"
      aria-live="polite"
      aria-label="Chargement de PhiBrain"
      className="fixed inset-0 z-[9999] grid place-items-center bg-[#050810] text-white"
      style={{
        transition: "opacity 0.45s ease, visibility 0.45s ease",
        opacity: phase === "out" ? 0 : 1,
        visibility: phase === "out" ? "hidden" : "visible",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
    >
      {/* Glow radial subtil derrière le contenu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 45%, rgba(0,212,255,0.18), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-7">
        {/* Logo PhiBrain en pulse */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl blur-2xl"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(0,212,255,0.4), transparent 70%)",
              animation: "phi-loader-pulse 2.4s ease-in-out infinite",
            }}
          />
          <Image
            src="/phibrain-logo.png"
            alt="PhiBrain logo"
            width={144}
            height={45}
            priority
            style={{ height: 45, width: "auto" }}
            className="relative"
          />
        </div>

        {/* Cerveau SVG animé — circuits gauche + neurones droits */}
        <BrainSvg />

        {/* Texte typing */}
        <p className="font-display text-xl font-medium tracking-tight">
          <span className="text-phi-gradient">{typed}</span>
          <span
            aria-hidden
            className="ml-0.5 inline-block w-[2px] h-[1em] align-[-0.15em] bg-[#00d4ff]"
            style={{ animation: "typing-caret 0.9s steps(2) infinite" }}
          />
        </p>
        <p className="text-xs uppercase tracking-[0.32em] text-white/55">Chargement</p>
      </div>

      <style>{`
        @keyframes phi-loader-pulse {
          0%, 100% { opacity: 0.55; transform: scale(0.95); }
          50%      { opacity: 1;    transform: scale(1.08); }
        }
        @keyframes phi-trace-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes phi-neuron-pulse {
          0%, 100% { transform: scale(0.6); opacity: 0.35; }
          50%      { transform: scale(1.1); opacity: 1; }
        }
        @keyframes phi-particle {
          0%   { offset-distance: 0%;   opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── SVG cerveau (120×120) animé ─────────────────────────────── */
function BrainSvg() {
  // Coordonnées : viewBox 0..120, centre (60, 60). Gauche : x<60, droite : x>60.
  // Traces gauche : 4 chemins de circuit avec stroke-dashoffset
  const traces = [
    "M 18 50 L 28 50 L 28 38 L 44 38 L 44 28",
    "M 14 70 L 26 70 L 26 86 L 42 86 L 42 98",
    "M 22 92 L 38 92 L 38 74 L 50 74 L 50 64",
    "M 10 38 L 22 38 L 22 22 L 38 22 L 38 14",
    "M 30 56 L 46 56 L 46 50 L 56 50",
  ];

  // Noeuds carrés sur les fins / coins de traces
  const traceNodes = [
    [28, 50],
    [28, 38],
    [44, 38],
    [44, 28],
    [26, 70],
    [26, 86],
    [42, 86],
    [42, 98],
    [38, 92],
    [38, 74],
    [50, 74],
    [22, 38],
    [22, 22],
    [38, 22],
    [38, 14],
    [46, 56],
    [46, 50],
    [56, 50],
  ];

  // Neurones droite : positions + tailles
  const neurons = [
    { x: 76, y: 26, r: 3.6 },
    { x: 92, y: 36, r: 2.8 },
    { x: 102, y: 52, r: 3.2 },
    { x: 96, y: 70, r: 2.6 },
    { x: 104, y: 88, r: 3 },
    { x: 84, y: 96, r: 2.8 },
    { x: 70, y: 80, r: 3.4 },
    { x: 72, y: 56, r: 3 },
    { x: 86, y: 56, r: 2.4 },
    { x: 88, y: 76, r: 2.6 },
    { x: 78, y: 40, r: 2.2 },
  ];

  // Connexions synaptiques : indices dans `neurons`
  const synapses: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [0, 10],
    [10, 7],
    [9, 3],
    [2, 8],
    [6, 9],
  ];

  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label="Animation cerveau PhiBrain"
    >
      <defs>
        <linearGradient id="phi-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <radialGradient id="phi-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo cerveau */}
      <ellipse cx="60" cy="60" rx="56" ry="50" fill="url(#phi-glow)" opacity="0.5" />

      {/* Silhouette ellipsoïdale */}
      <ellipse
        cx="60"
        cy="60"
        rx="50"
        ry="44"
        stroke="url(#phi-grad)"
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Séparation hémisphères */}
      <line
        x1="60"
        y1="16"
        x2="60"
        y2="104"
        stroke="#00d4ff"
        strokeOpacity="0.25"
        strokeWidth="0.6"
        strokeDasharray="2 4"
      />

      {/* ── HÉMISPHÈRE GAUCHE : circuits PCB ── */}
      <g>
        {traces.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="url(#phi-grad)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset="100"
            style={{
              animation: `phi-trace-draw 1.4s ${0.15 * i}s ease-out forwards, phi-trace-draw 2.8s ${1.6 + 0.2 * i}s ease-out infinite alternate`,
            }}
          />
        ))}

        {/* Noeuds carrés */}
        {traceNodes.map(([x, y], i) => (
          <rect
            key={i}
            x={x - 1.6}
            y={y - 1.6}
            width={3.2}
            height={3.2}
            rx={0.6}
            fill="#0066cc"
            style={{
              opacity: 0,
              animation: `phi-neuron-pulse 1.8s ${0.6 + 0.06 * i}s ease-in-out forwards, phi-neuron-pulse 2.4s ${2 + 0.05 * i}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* Particule cyan circulant sur la première trace */}
        <circle r="2" fill="#00d4ff">
          <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.6s">
            <mpath href="#circuit-path-anim" />
          </animateMotion>
        </circle>
        <path id="circuit-path-anim" d={traces[0]} fill="none" opacity={0} />
      </g>

      {/* ── HÉMISPHÈRE DROIT : réseau neuronal ── */}
      <g>
        {/* Connexions synaptiques */}
        {synapses.map(([a, b], i) => {
          const A = neurons[a];
          const B = neurons[b];
          return (
            <line
              key={i}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="#00d4ff"
              strokeOpacity="0.45"
              strokeWidth="0.8"
              pathLength={100}
              strokeDasharray="100"
              strokeDashoffset="100"
              style={{
                animation: `phi-trace-draw 1.2s ${0.4 + 0.07 * i}s ease-out forwards`,
              }}
            />
          );
        })}

        {/* Neurones */}
        {neurons.map((n, i) => (
          <g
            key={i}
            style={{
              transformOrigin: `${n.x}px ${n.y}px`,
              animation: `phi-neuron-pulse 1.8s ${0.4 + 0.1 * i}s ease-out infinite`,
            }}
          >
            <circle cx={n.x} cy={n.y} r={n.r + 2} fill="url(#phi-glow)" opacity={0.6} />
            <circle cx={n.x} cy={n.y} r={n.r} fill="#00d4ff" />
          </g>
        ))}
      </g>
    </svg>
  );
}
