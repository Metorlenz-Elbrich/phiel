# Current — components & lib

## components/ui/button.tsx

```tsx
"use client";

import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-phi-gradient text-white shadow-[0_8px_30px_-12px_rgba(0,212,255,0.55)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-[color:var(--surface)] text-foreground border border-[color:var(--border)] hover:border-phi-cyan/60 hover:text-phi-cyan",
  ghost:
    "bg-transparent text-foreground hover:bg-[color:var(--surface-muted)]",
  outline:
    "bg-transparent text-foreground border border-[color:var(--border-strong)] hover:border-phi-cyan hover:text-phi-cyan",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight " +
  "focus-visible:outline-2 focus-visible:outline-phi-cyan focus-visible:outline-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

type CommonProps = { variant?: Variant; size?: Size; children: ReactNode; className?: string };

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | AnchorProps>(
  function Button({ variant = "primary", size = "md", className, children, ...props }, ref) {
    const cls = cn(base, variants[variant], sizes[size], className);
    if ((props as AnchorProps).as === "a") {
      const { as: _as, ...rest } = props as AnchorProps;
      void _as;
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...rest}>
          {children}
        </a>
      );
    }
    const { as: _as, ...rest } = props as ButtonProps;
    void _as;
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...rest}>
        {children}
      </button>
    );
  }
);
```

## components/ui/theme-toggle.tsx

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border border-[color:var(--border)] bg-[color:var(--surface)]",
        "hover:border-phi-cyan/60 hover:text-phi-cyan",
        "focus-visible:outline-2 focus-visible:outline-phi-cyan focus-visible:outline-offset-2",
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-0 grid place-items-center transition-all duration-500",
          isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        )}
      >
        <Icon name="sun" size={18} />
      </span>
      <span
        className={cn(
          "absolute inset-0 grid place-items-center transition-all duration-500",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        )}
      >
        <Icon name="moon" size={18} />
      </span>
      <span className="sr-only">Basculer le thème</span>
    </button>
  );
}
```

## components/sections/section-heading.tsx

```tsx
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 sm:mb-16 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-phi-cyan">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-foreground/70">{description}</p>
      )}
    </div>
  );
}
```

## components/theme-provider.tsx

```tsx
"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
import { type ReactNode } from "react";

export function ThemeProvider({
  children,
  ...props
}: { children: ReactNode } & ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="phibrain-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

## components/ui/card.tsx

```tsx
import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  interactive = false,
  ...rest
}: { children: ReactNode; interactive?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "surface-card relative overflow-hidden p-6 transition",
        interactive &&
          "hover:-translate-y-1 hover:border-phi-cyan/60 hover:shadow-[0_24px_60px_-24px_rgba(0,212,255,0.45)] group",
        className
      )}
    >
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-phi-gradient-soft"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
```

## components/ui/loading-screen.tsx

```tsx
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
```

## components/ui/brain-animation.tsx

```tsx
"use client";

import { useEffect, useRef } from "react";

export default function BrainAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let animFrame: number;
    let W = 0, H = 0;
    let isDark = document.documentElement.classList.contains("dark");
    let mouseX = -9999, mouseY = -9999;
    let isMouseInLeft = false, isMouseInRight = false;

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseInLeft  = mouseX < W / 2;
      isMouseInRight = mouseX > W / 2;
    };
    const onMouseLeave = () => { mouseX = -9999; mouseY = -9999; isMouseInLeft = false; isMouseInRight = false; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    function rgba(hex: string, a: number) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${Math.min(1,Math.max(0,a))})`;
    }
    const CYAN = "#00d4ff", BLUE = "#0066cc";

    // ── Brain path ─────────────────────────────────────────
    function makeBrainPath(cx: number, cy: number, R: number): Path2D {
      const p = new Path2D();
      const x = (d: number) => cx + d * R, y = (d: number) => cy + d * R;
      p.moveTo(x(0), y(-0.72));
      p.bezierCurveTo(x(-0.10),y(-0.95),x(-0.30),y(-1.05),x(-0.42),y(-0.88));
      p.bezierCurveTo(x(-0.52),y(-0.75),x(-0.68),y(-0.82),x(-0.72),y(-0.65));
      p.bezierCurveTo(x(-0.82),y(-0.55),x(-0.98),y(-0.50),x(-0.95),y(-0.30));
      p.bezierCurveTo(x(-0.92),y(-0.12),x(-1.02),y(-0.02),x(-0.98),y( 0.15));
      p.bezierCurveTo(x(-0.95),y( 0.30),x(-1.00),y( 0.42),x(-0.90),y( 0.52));
      p.bezierCurveTo(x(-0.80),y( 0.62),x(-0.78),y( 0.72),x(-0.62),y( 0.75));
      p.bezierCurveTo(x(-0.48),y( 0.80),x(-0.30),y( 0.82),x(-0.16),y( 0.75));
      p.bezierCurveTo(x(-0.08),y( 0.70),x(-0.02),y( 0.65),x(0),    y( 0.55));
      p.bezierCurveTo(x( 0.01),y( 0.45),x( 0.01),y( 0.40),x(0),    y( 0.30));
      p.bezierCurveTo(x( 0.02),y( 0.65),x( 0.08),y( 0.70),x( 0.16),y( 0.75));
      p.bezierCurveTo(x( 0.30),y( 0.82),x( 0.48),y( 0.80),x( 0.62),y( 0.75));
      p.bezierCurveTo(x( 0.78),y( 0.72),x( 0.80),y( 0.62),x( 0.90),y( 0.52));
      p.bezierCurveTo(x( 1.00),y( 0.42),x( 0.95),y( 0.30),x( 0.98),y( 0.15));
      p.bezierCurveTo(x( 1.02),y(-0.02),x( 0.92),y(-0.12),x( 0.95),y(-0.30));
      p.bezierCurveTo(x( 0.98),y(-0.50),x( 0.82),y(-0.55),x( 0.72),y(-0.65));
      p.bezierCurveTo(x( 0.68),y(-0.82),x( 0.52),y(-0.75),x( 0.42),y(-0.88));
      p.bezierCurveTo(x( 0.30),y(-1.05),x( 0.10),y(-0.95),x(0),    y(-0.72));
      p.closePath();
      return p;
    }

    function inBrain(px: number, py: number, cx: number, cy: number, R: number) {
      const nx=(px-cx)/R, ny=(py-cy)/R;
      if(nx*nx/0.9025+ny*ny/0.7225>0.88) return false;
      if(Math.abs(nx)<0.06&&ny<-0.60) return false;
      return true;
    }
    function inLeft(px:number,py:number,cx:number,cy:number,R:number){return px<cx-5&&inBrain(px,py,cx,cy,R);}
    function inRight(px:number,py:number,cx:number,cy:number,R:number){return px>cx+5&&inBrain(px,py,cx,cy,R);}

    function mulberry32(seed: number){
      return()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};
    }
    const rng = mulberry32(0xc0ffee42);

    interface Pt      { x:number; y:number }
    interface CNode   { hx:number; hy:number; cx:number; cy:number; lit:number; traceIdx:number[] }
    interface Trace   { pts:Pt[]; nodeIndices:number[]; progress:number; speed:number; boost:number }
    interface Neuron  { hx:number; hy:number; cx:number; cy:number; r:number; phase:number; speed:number; cascadeGlow:number }
    interface Synapse { a:number; b:number; progress:number; speed:number; active:boolean; timer:number; cascading:boolean }

    let traces:   Trace[]   = [];
    let cnodes:   CNode[]   = [];
    let neurons:  Neuron[]  = [];
    let synapses: Synapse[] = [];

    function segLen(pts:Pt[]){let l=0;for(let i=1;i<pts.length;i++)l+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);return l;}
    function pointAt(pts:Pt[],t:number):Pt{
      let rem=t*segLen(pts);
      for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);if(rem<=d){const f=rem/d;return{x:pts[i-1].x+(pts[i].x-pts[i-1].x)*f,y:pts[i-1].y+(pts[i].y-pts[i-1].y)*f};}rem-=d;}
      return pts[pts.length-1];
    }

    function build(){
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.42;
      traces=[];cnodes=[];neurons=[];synapses=[];

      // LEFT: circuit traces + nodes
      for(let i=0;i<16;i++){
        let sx=0,sy=0,att=0;
        do{sx=cx-R*(0.08+rng()*0.82);sy=cy+R*(rng()*1.55-0.78);att++;}while(!inLeft(sx,sy,cx,cy,R)&&att<80);
        if(!inLeft(sx,sy,cx,cy,R))continue;

        const pts:Pt[]=[{x:sx,y:sy}];
        const nodeIndices:number[]=[];
        let cur={x:sx,y:sy};
        for(let s=0;s<3+Math.floor(rng()*4);s++){
          const horiz=rng()>0.5,len=20+rng()*55;
          const nx=horiz?cur.x+(rng()>0.5?len:-len):cur.x;
          const ny=horiz?cur.y:cur.y+(rng()>0.5?len:-len);
          if(inLeft(nx,ny,cx,cy,R)){
            cur={x:nx,y:ny};pts.push(cur);
            const ni=cnodes.length;
            cnodes.push({hx:nx,hy:ny,cx:nx,cy:ny,lit:0,traceIdx:[i]});
            nodeIndices.push(ni);
          }
        }
        if(pts.length>1)traces.push({pts,nodeIndices,progress:rng(),speed:0.0014+rng()*0.0032,boost:1});
      }

      // RIGHT: neurons
      for(let i=0;i<30;i++){
        let nx=0,ny=0,att=0;
        do{const angle=(rng()-0.5)*Math.PI,dist=R*(0.10+rng()*0.78);nx=cx+dist*Math.cos(angle);ny=cy+dist*Math.sin(angle);att++;}
        while(!inRight(nx,ny,cx,cy,R)&&att<80);
        if(!inRight(nx,ny,cx,cy,R))continue;
        neurons.push({hx:nx,hy:ny,cx:nx,cy:ny,r:2.2+rng()*3.8,phase:rng()*Math.PI*2,speed:0.009+rng()*0.022,cascadeGlow:0});
      }

      for(let a=0;a<neurons.length;a++){
        let conn=0;
        for(let b=a+1;b<neurons.length&&conn<3;b++){
          if(Math.hypot(neurons[a].hx-neurons[b].hx,neurons[a].hy-neurons[b].hy)<R*0.40){
            synapses.push({a,b,progress:0,speed:0.007+rng()*0.015,active:rng()>0.35,timer:rng()*180,cascading:false});
            conn++;
          }
        }
      }
    }

    // ── CASCADE: trigger synapses from neuron index ──────────
    function triggerCascade(neuronIdx:number,depth:number){
      if(depth<=0)return;
      neurons[neuronIdx].cascadeGlow=1.0;
      synapses.forEach(s=>{
        if((s.a===neuronIdx||s.b===neuronIdx)&&!s.cascading){
          s.cascading=true;s.progress=0;s.active=true;
          // chain: when this synapse ends, trigger the other neuron
          const target=s.a===neuronIdx?s.b:s.a;
          setTimeout(()=>{
            s.cascading=false;
            triggerCascade(target,depth-1);
          },Math.round((1/s.speed)*16*1.2)); // approx duration
        }
      });
    }

    const cascadeCooldowns = new Set<number>();

    function draw(){
      ctx.clearRect(0,0,W,H);
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.42;
      const brainPath=makeBrainPath(cx,cy,R);
      const cyanC=isDark?CYAN:BLUE;
      const borderA=isDark?0.38:0.60;
      const divA=isDark?0.70:0.85;
      const ATTRACT_R = R*0.55; // attraction radius for circuits
      const REPEL_R   = R*0.45; // repulsion radius for neurons
      const CASCADE_R = R*0.12; // cascade trigger radius

      // ── UPDATE POSITIONS ──────────────────────────────────

      // LEFT attraction: circuit nodes drift toward mouse
      cnodes.forEach(n=>{
        if(isMouseInLeft){
          const dx=mouseX-n.hx, dy=mouseY-n.hy;
          const dist=Math.hypot(dx,dy);
          if(dist<ATTRACT_R&&dist>1){
            const force=(1-dist/ATTRACT_R)*0.06;
            const maxD=28;
            const tx=n.hx+dx/dist*Math.min(maxD,dist*force*8);
            const ty=n.hy+dy/dist*Math.min(maxD,dist*force*8);
            n.cx+=(tx-n.cx)*0.08;
            n.cy+=(ty-n.cy)*0.08;
            n.lit=Math.min(1,n.lit+0.15);
          } else {
            n.cx+=(n.hx-n.cx)*0.06;
            n.cy+=(n.hy-n.cy)*0.06;
            n.lit=Math.max(0,n.lit-0.05);
          }
        } else {
          n.cx+=(n.hx-n.cx)*0.06;
          n.cy+=(n.hy-n.cy)*0.06;
          n.lit=Math.max(0,n.lit-0.05);
        }
        // boost trace speed when node is lit
        if(n.lit>0.3) n.traceIdx.forEach(ti=>{ if(traces[ti]) traces[ti].boost=1+n.lit*3; });
      });

      // Decay boosts
      traces.forEach(tr=>{ tr.boost+=(1-tr.boost)*0.05; });

      // RIGHT repulsion: neurons flee the mouse
      neurons.forEach((n,ni)=>{
        if(isMouseInRight){
          const dx=n.hx-mouseX, dy=n.hy-mouseY;
          const dist=Math.hypot(dx,dy);
          if(dist<REPEL_R&&dist>1){
            const force=(1-dist/REPEL_R)*0.18;
            const maxD=40;
            const push=Math.min(maxD,force*80);
            const tx=n.hx+dx/dist*push;
            const ty=n.hy+dy/dist*push;
            n.cx+=(tx-n.cx)*0.10;
            n.cy+=(ty-n.cy)*0.10;
          } else {
            n.cx+=(n.hx-n.cx)*0.04;
            n.cy+=(n.hy-n.cy)*0.04;
          }
          // CASCADE trigger
          if(dist<CASCADE_R&&!cascadeCooldowns.has(ni)){
            cascadeCooldowns.add(ni);
            triggerCascade(ni,3);
            setTimeout(()=>cascadeCooldowns.delete(ni),2500);
          }
        } else {
          n.cx+=(n.hx-n.cx)*0.04;
          n.cy+=(n.hy-n.cy)*0.04;
        }
        n.cascadeGlow=Math.max(0,n.cascadeGlow-0.018);
      });

      // ── DRAW ─────────────────────────────────────────────

      // Outer glow
      ctx.save();
      ctx.filter="blur(28px)";
      ctx.fillStyle=rgba(cyanC,isDark?0.12:0.15);
      ctx.fill(brainPath);
      ctx.filter="none";
      ctx.restore();

      // Brain outline
      ctx.strokeStyle=rgba(cyanC,borderA); ctx.lineWidth=2; ctx.stroke(brainPath);
      ctx.strokeStyle=rgba(cyanC,0.07);   ctx.lineWidth=1; ctx.stroke(brainPath);

      // Clip
      ctx.save();
      ctx.clip(brainPath);

      // Background fill
      const bg=ctx.createRadialGradient(cx-R*0.2,cy,0,cx,cy,R);
      bg.addColorStop(0,rgba(BLUE,isDark?0.10:0.14));
      bg.addColorStop(0.5,rgba(CYAN,isDark?0.05:0.08));
      bg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=bg; ctx.fill(brainPath);

      // Mouse glow LEFT
      if(isMouseInLeft&&mouseX>0){
        const mg=ctx.createRadialGradient(mouseX,mouseY,0,mouseX,mouseY,ATTRACT_R*0.8);
        mg.addColorStop(0,rgba(CYAN,isDark?0.10:0.13));
        mg.addColorStop(1,"rgba(0,212,255,0)");
        ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(mouseX,mouseY,ATTRACT_R*0.8,0,Math.PI*2); ctx.fill();
      }
      // Mouse glow RIGHT
      if(isMouseInRight&&mouseX>0){
        const mg=ctx.createRadialGradient(mouseX,mouseY,0,mouseX,mouseY,REPEL_R*0.9);
        mg.addColorStop(0,rgba(CYAN,isDark?0.08:0.10));
        mg.addColorStop(1,"rgba(0,212,255,0)");
        ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(mouseX,mouseY,REPEL_R*0.9,0,Math.PI*2); ctx.fill();
      }

      // Gyri fold lines
      [[-.62,-.55,-.45,-.72,-.25,-.60],[-.80,-.20,-.60,-.35,-.40,-.22],
       [-.85, .18,-.65, .05,-.42, .20],[-.75, .50,-.55, .38,-.30, .52],
       [-.45,-.10,-.28,-.25,-.10,-.08],
       [ .62,-.55, .45,-.72, .25,-.60],[ .80,-.20, .60,-.35, .40,-.22],
       [ .85, .18, .65, .05, .42, .20],[ .75, .50, .55, .38, .30, .52],
       [ .45,-.10, .28,-.25, .10,-.08],
      ].forEach(([x0,y0,x1,y1,x2,y2])=>{
        ctx.beginPath(); ctx.moveTo(cx+x0*R,cy+y0*R);
        ctx.quadraticCurveTo(cx+x1*R,cy+y1*R,cx+x2*R,cy+y2*R);
        ctx.strokeStyle=rgba(cyanC,isDark?.07:.12); ctx.lineWidth=0.8; ctx.stroke();
      });

      // LEFT: circuit traces (use current node positions for start/end)
      traces.forEach(tr=>{
        tr.progress+=tr.speed*tr.boost;
        if(tr.progress>1)tr.progress=0;

        // Redraw trace from home pts (stable backbone)
        ctx.beginPath(); ctx.moveTo(tr.pts[0].x,tr.pts[0].y);
        tr.pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
        ctx.strokeStyle=rgba(BLUE,isDark?.38:.55); ctx.lineWidth=0.9; ctx.stroke();

        const pos=pointAt(tr.pts,tr.progress);
        const g=ctx.createRadialGradient(pos.x,pos.y,0,pos.x,pos.y,10);
        g.addColorStop(0,rgba(cyanC,isDark?.95:1)); g.addColorStop(1,"rgba(0,212,255,0)");
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(pos.x,pos.y,10,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=isDark?"#fff":"#003388"; ctx.beginPath(); ctx.arc(pos.x,pos.y,2.2,0,Math.PI*2); ctx.fill();
      });

      // Circuit nodes (displaced by attraction)
      cnodes.forEach(n=>{
        const litBoost=n.lit;
        const size=litBoost>0?6+litBoost*6:6;
        if(litBoost>0){
          const ng=ctx.createRadialGradient(n.cx,n.cy,0,n.cx,n.cy,size*2.5);
          ng.addColorStop(0,rgba(CYAN,litBoost*0.6)); ng.addColorStop(1,"rgba(0,212,255,0)");
          ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(n.cx,n.cy,size*2.5,0,Math.PI*2); ctx.fill();
        }
        ctx.fillStyle=rgba(BLUE,isDark?0.70+litBoost*0.3:0.90);
        ctx.fillRect(n.cx-size/2,n.cy-size/2,size,size);
        ctx.fillStyle=rgba(CYAN,0.5+litBoost*0.5);
        ctx.fillRect(n.cx-1,n.cy-1,2,2);
      });

      // RIGHT: synapses
      synapses.forEach(s=>{
        const na=neurons[s.a],nb=neurons[s.b];
        ctx.beginPath(); ctx.moveTo(na.cx,na.cy); ctx.lineTo(nb.cx,nb.cy);
        const synA=s.cascading?(isDark?.35:.50):(isDark?.13:.22);
        ctx.strokeStyle=rgba(cyanC,synA); ctx.lineWidth=s.cascading?1.5:.8; ctx.stroke();
        if(s.active){
          s.progress+=s.speed*(s.cascading?2.5:1);
          if(s.progress>1){s.progress=0;s.active=s.cascading?false:Math.random()>.3;s.cascading=false;}
          const px=na.cx+(nb.cx-na.cx)*s.progress,py=na.cy+(nb.cy-na.cy)*s.progress;
          const r=s.cascading?10:7;
          const gp=ctx.createRadialGradient(px,py,0,px,py,r);
          gp.addColorStop(0,rgba(cyanC,s.cascading?1.0:(isDark?.95:1)));
          gp.addColorStop(1,"rgba(0,212,255,0)");
          ctx.fillStyle=gp; ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.fill();
        } else { s.timer--; if(s.timer<=0){s.active=true;s.timer=60+Math.random()*120;} }
      });

      // Neurons (displaced by repulsion)
      neurons.forEach(n=>{
        n.phase+=n.speed;
        const pulse=0.55+0.45*Math.sin(n.phase);
        const cglow=n.cascadeGlow;
        const alpha=(isDark?.4:.65)+0.6*pulse+cglow*0.5;
        const radius=n.r*(0.8+0.35*pulse)*(1+cglow*0.6);

        const gn=ctx.createRadialGradient(n.cx,n.cy,0,n.cx,n.cy,radius*(cglow>0?5:4));
        gn.addColorStop(0,rgba(cyanC,(isDark?.45:.55)*pulse+cglow*.4));
        gn.addColorStop(1,"rgba(0,212,255,0)");
        ctx.fillStyle=gn; ctx.beginPath(); ctx.arc(n.cx,n.cy,radius*(cglow>0?5:4),0,Math.PI*2); ctx.fill();
        ctx.fillStyle=rgba(cyanC,Math.min(1,alpha));
        ctx.beginPath(); ctx.arc(n.cx,n.cy,radius,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=`rgba(255,255,255,${Math.min(1,alpha*(isDark?.6:.9))})`;
        ctx.beginPath(); ctx.arc(n.cx-radius*.25,n.cy-radius*.25,radius*.32,0,Math.PI*2); ctx.fill();
      });

      // Centre divider
      const divG=ctx.createLinearGradient(cx,cy-R*1.1,cx,cy+R*1.1);
      divG.addColorStop(0,"rgba(0,212,255,0)");
      divG.addColorStop(0.2,rgba(cyanC,divA));
      divG.addColorStop(0.8,rgba(cyanC,divA));
      divG.addColorStop(1,"rgba(0,212,255,0)");
      ctx.strokeStyle=divG; ctx.lineWidth=1.6; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(cx,cy-R*1.1); ctx.lineTo(cx,cy+R*1.1); ctx.stroke();

      ctx.restore();
      animFrame=requestAnimationFrame(draw);
    }

    function resize(){
      W=canvas.offsetWidth; H=canvas.offsetHeight;
      canvas.width=W*devicePixelRatio; canvas.height=H*devicePixelRatio;
      ctx.scale(devicePixelRatio,devicePixelRatio);
      build();
    }

    const prefersReduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(!prefersReduced){
      const ro=new ResizeObserver(resize);
      ro.observe(canvas); resize();
      animFrame=requestAnimationFrame(draw);
      return()=>{
        cancelAnimationFrame(animFrame); ro.disconnect();
        themeObserver.disconnect();
        canvas.removeEventListener("mousemove",onMouseMove);
        canvas.removeEventListener("mouseleave",onMouseLeave);
      };
    }
    return()=>{themeObserver.disconnect();};
  },[]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{display:"block",width:"100%",height:"100%",cursor:"crosshair"}}
    />
  );
}

export { BrainAnimation };
```

## components/ui/logo.tsx

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  height?: number;
  priority?: boolean;
  forceDark?: boolean;
  className?: string;
}

export function Logo({ height = 40, forceDark = false, className }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ height, width: height * 3.5 }} />;

  // forceDark = true quand on est sur le slider (fond toujours sombre)
  const isDark = forceDark || resolvedTheme === "dark";

  const src = isDark
    ? "/phibrain-logo.png"
    : "/phibrain-logo-light-transparent.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="PhiBrain"
      className={className}
      style={{
        height: `${height}px`,
        width: "auto",
        objectFit: "contain",
        flexShrink: 0,
        display: "block",
      }}
    />
  );
}

export default Logo;
```

## components/ui/lang-toggle.tsx

```tsx
"use client";

import { useLang } from "@/lib/language-context";

export function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
      className="flex items-center gap-1 h-9 px-3 rounded-full border border-[color:var(--border)] text-sm font-semibold transition-all hover:border-phi-cyan hover:text-phi-cyan focus-visible:outline-2 focus-visible:outline-phi-cyan focus-visible:outline-offset-2"
      style={{ color: "var(--foreground)", opacity: 0.8 }}
    >
      <span style={{ opacity: lang === "fr" ? 1 : 0.4 }}>FR</span>
      <span style={{ opacity: 0.3 }}>|</span>
      <span style={{ opacity: lang === "en" ? 1 : 0.4 }}>EN</span>
    </button>
  );
}
```

## components/ui/nav-bar.tsx

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LangToggle } from "./lang-toggle";
import { Icon } from "./icon";

export function NavBar() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const NAV_LINKS: { label: string; href: string }[] = [
    { label: t.nav.home, href: "#hero" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.portfolio, href: "#portfolio" },
    { label: t.nav.team, href: "#team" },
    { label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", "border-b")}
      style={
        scrolled
          ? {
              background: "var(--navbar-bg)",
              borderBottomColor: "var(--navbar-border)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }
          : {
              // Toujours fond sombre quand on est sur le slider (top of page)
              background: "rgba(5, 8, 16, 0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottomColor: "rgba(255,255,255,0.08)",
            }
      }
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Logo — toujours version dark quand sur le slider */}
        <Link
          href="#hero"
          className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-phi-cyan rounded-full"
          aria-label="Aller à l'accueil"
        >
          <Logo height={70} priority={true} forceDark={!scrolled} />
        </Link>

        {/* Nav links — blanc sur le slider, couleur theme après scroll */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-phi-cyan",
                  scrolled
                    ? "text-foreground/80 hover:bg-[color:var(--surface-muted)]"
                    : "text-white/90 hover:bg-white/10"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <Link
            href="#contact"
            className="hidden md:inline-flex h-10 items-center justify-center rounded-full bg-phi-gradient px-5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(0,212,255,0.55)] hover:brightness-110"
          >
            {t.nav.cta}
          </Link>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border",
              scrolled ? "border-[color:var(--border)]" : "border-white/20"
            )}
          >
            <Icon
              name={open ? "close" : "menu"}
              className={scrolled ? undefined : "text-white"}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden overflow-hidden border-t border-[color:var(--border)] bg-[color:var(--surface)]/95 backdrop-blur-xl transition-[max-height,opacity] duration-300",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col px-4 py-2">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-medium text-foreground/85 hover:text-phi-cyan hover:bg-[color:var(--surface-muted)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2 pb-4">
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center justify-center rounded-full bg-phi-gradient px-5 text-sm font-medium text-white"
            >
              {t.nav.cta}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
```

## components/sections/hero-section.tsx

```tsx
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
```

## components/sections/hero-slider.tsx

```tsx
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
```

## components/sections/services-section.tsx

```tsx
"use client";

import { motion } from "framer-motion";
import { SERVICES, type ServiceIcon } from "@/lib/data";
import { Icon, type IconName } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { useLang } from "@/lib/language-context";

const ICONS: Record<ServiceIcon, IconName> = {
  branding: "palette",
  web: "code",
  mobile: "smartphone",
};

export function ServicesSection() {
  const { t } = useLang();
  return (
    <section
      id="services"
      className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden"
      aria-labelledby="services-title"
    >
      <div aria-hidden className="absolute inset-0 bg-grid bg-grid-fade opacity-70 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.services.eyebrow}
          title={(() => {
            const parts = t.services.title.split("PhiBrain");
            return parts.length > 1 ? (
              <>
                {parts[0]}
                <span className="text-phi-gradient">PhiBrain</span>
                {parts.slice(1).join("PhiBrain")}
              </>
            ) : (
              t.services.title
            );
          })()}
          description={t.services.description}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <Card interactive className="h-full">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-phi-gradient text-white">
                  <Icon name={ICONS[s.icon]} size={22} />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{s.description}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Icon name="check" size={14} className="text-phi-cyan" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## components/sections/skills-section.tsx

```tsx
"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useLang } from "@/lib/language-context";

const TREE = [
  {
    category: "Front-end",
    color: "#00d4ff",
    nodes: [
      { name: "HTML5",      pct: 95, icon: "🌐", tier: "legendary" },
      { name: "CSS3",       pct: 92, icon: "🎨", tier: "legendary" },
      { name: "JavaScript", pct: 90, icon: "⚡", tier: "epic"      },
      { name: "React",      pct: 88, icon: "⚛️",  tier: "epic"      },
      { name: "TypeScript", pct: 82, icon: "📘", tier: "rare"      },
    ],
  },
  {
    category: "Back-end",
    color: "#5ea8ff",
    nodes: [
      { name: "Laravel",  pct: 82, icon: "🔺", tier: "epic"  },
      { name: "PHP",      pct: 80, icon: "🐘", tier: "rare"  },
      { name: "Node.js",  pct: 78, icon: "🟢", tier: "rare"  },
    ],
  },
  {
    category: "Mobile",
    color: "#7ee787",
    nodes: [
      { name: "Flutter", pct: 86, icon: "💙", tier: "epic" },
      { name: "Kotlin",  pct: 75, icon: "🤖", tier: "rare" },
    ],
  },
  {
    category: "Design",
    color: "#ffa657",
    nodes: [
      { name: "Adobe CC", pct: 88, icon: "🅰️",  tier: "epic" },
      { name: "Figma",    pct: 85, icon: "🖼️", tier: "epic" },
    ],
  },
];

const TIER_STYLES: Record<string, { border: string; bg: string; glow: string; label: string; labelBg: string; labelFg: string }> = {
  legendary: {
    border:  "#00d4ff",
    bg:      "rgba(0,212,255,0.12)",
    glow:    "0 0 16px rgba(0,212,255,0.45), 0 0 32px rgba(0,212,255,0.15)",
    label:   "LÉGENDAIRE",
    labelBg: "rgba(0,212,255,0.18)",
    labelFg: "#00d4ff",
  },
  epic: {
    border:  "#a78bfa",
    bg:      "rgba(167,139,250,0.10)",
    glow:    "0 0 14px rgba(167,139,250,0.35)",
    label:   "ÉPIQUE",
    labelBg: "rgba(167,139,250,0.18)",
    labelFg: "#a78bfa",
  },
  rare: {
    border:  "#60a5fa",
    bg:      "rgba(96,165,250,0.08)",
    glow:    "0 0 10px rgba(96,165,250,0.20)",
    label:   "RARE",
    labelBg: "rgba(96,165,250,0.15)",
    labelFg: "#60a5fa",
  },
};

function SkillNode({ node, catColor, visible, delay }: {
  node: typeof TREE[0]["nodes"][0];
  catColor: string;
  visible: boolean;
  delay: number;
}) {
  const t = TIER_STYLES[node.tier];
  return (
    <div
      className="flex flex-col items-center"
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ${delay}ms, transform 0.5s ${delay}ms`,
      }}
    >
      {/* Node box */}
      <div
        className="relative flex flex-col items-center justify-center rounded-xl cursor-default group"
        style={{
          width: "80px",
          height: "80px",
          border: `1.5px solid ${t.border}`,
          background: t.bg,
          boxShadow: t.glow,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.12)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = t.glow.replace("0.45", "0.8").replace("0.35", "0.6");
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = t.glow;
        }}
      >
        {/* Icon */}
        <span style={{ fontSize: "22px", lineHeight: 1 }}>{node.icon}</span>

        {/* Percentage */}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: t.border,
            marginTop: "4px",
            fontFamily: "monospace",
          }}
        >
          {node.pct}%
        </span>

        {/* Corner accents */}
        {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r",
          "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r",
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${cls}`}
            style={{ borderColor: t.border, opacity: 0.7 }}
          />
        ))}
      </div>

      {/* Skill name */}
      <div
        className="mt-2 text-center"
        style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", maxWidth: "80px" }}
      >
        {node.name}
      </div>

      {/* Tier badge */}
      <div
        className="mt-1 px-2 py-0.5 rounded-full"
        style={{
          fontSize: "8px",
          letterSpacing: "0.08em",
          background: t.labelBg,
          color: t.labelFg,
          fontFamily: "monospace",
        }}
      >
        {t.label}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLang();

  // Split title : dernier mot/segment en gradient (avant le dernier espace)
  const titleTrimmed = t.skills.title.trim();
  const lastSpace = titleTrimmed.lastIndexOf(" ");
  const titlePrefix = lastSpace > 0 ? titleTrimmed.slice(0, lastSpace + 1) : "";
  const titleAccent = lastSpace > 0 ? titleTrimmed.slice(lastSpace + 1) : titleTrimmed;

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      {/* Section heading */}
      <div className="container mx-auto px-6 lg:px-16 mb-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="block h-px w-8" style={{ background: "linear-gradient(90deg,transparent,#00d4ff)" }} />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "var(--color-phi-cyan)" }}>
              {t.skills.eyebrow}
            </span>
            <span className="block h-px w-8" style={{ background: "linear-gradient(90deg,#00d4ff,transparent)" }} />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black mb-4">
            {titlePrefix}
            <span style={{
              background: "linear-gradient(135deg,#0066cc,#00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {titleAccent}
            </span>
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: "var(--foreground)", opacity: 0.55 }}>
            {t.skills.description}
          </p>
        </div>
      </div>

      {/* Skill tree board */}
      <div className="container mx-auto px-6 lg:px-16">
        <div
          ref={ref}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "#07101f",
            border: "1px solid rgba(0,212,255,0.15)",
            boxShadow: "0 0 60px rgba(0,102,204,0.15)",
          }}
        >
          {/* Grid bg */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px)," +
                "linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Top bar — game HUD style */}
          <div
            className="relative flex items-center justify-between px-6 py-3 border-b"
            style={{ borderColor: "rgba(0,212,255,0.12)", background: "rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: "#00d4ff", boxShadow: "0 0 6px #00d4ff" }} />
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "rgba(0,212,255,0.7)", letterSpacing: "0.1em" }}>
                PHIBRAIN — SKILL TREE v2.0
              </span>
            </div>
            <div className="flex items-center gap-6">
              {[
                { label: "LÉGENDAIRE", color: "#00d4ff" },
                { label: "ÉPIQUE",     color: "#a78bfa" },
                { label: "RARE",       color: "#60a5fa" },
              ].map(t => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                  <span style={{ fontSize: "9px", fontFamily: "monospace", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tree content */}
          <div className="relative p-8">
            <div className="flex gap-6 justify-center flex-wrap lg:flex-nowrap">
              {TREE.map((cat, ci) => (
                <div key={cat.category} className="flex flex-col items-center min-w-[96px]">

                  {/* Category header */}
                  <div
                    className="mb-6 px-3 py-1 rounded-full text-center"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      fontFamily: "monospace",
                      color: cat.color,
                      border: `1px solid ${cat.color}40`,
                      background: `${cat.color}12`,
                    }}
                  >
                    {cat.category.toUpperCase()}
                  </div>

                  {/* Nodes with vertical connectors */}
                  {cat.nodes.map((node, ni) => (
                    <div key={node.name} className="flex flex-col items-center">
                      <SkillNode
                        node={node}
                        catColor={cat.color}
                        visible={inView}
                        delay={ci * 80 + ni * 100}
                      />
                      {/* Connector */}
                      {ni < cat.nodes.length - 1 && (
                        <div
                          style={{
                            width: "2px",
                            height: "20px",
                            background: `linear-gradient(to bottom, ${cat.color}60, ${cat.color}20)`,
                            margin: "4px 0",
                            opacity: inView ? 1 : 0,
                            transition: `opacity 0.5s ${ci * 80 + ni * 100 + 200}ms`,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom XP bar */}
            <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "9px", fontFamily: "monospace", color: "rgba(0,212,255,0.5)", letterSpacing: "0.1em" }}>
                  NIVEAU GLOBAL
                </span>
                <span style={{ fontSize: "9px", fontFamily: "monospace", color: "rgba(0,212,255,0.5)" }}>
                  86 / 100 XP
                </span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: "6px", background: "rgba(255,255,255,0.06)" }}>
                <div
                  style={{
                    height: "100%",
                    width: inView ? "86%" : "0%",
                    background: "linear-gradient(90deg,#0066cc,#00d4ff)",
                    borderRadius: "9999px",
                    transition: "width 1.5s 0.8s cubic-bezier(.4,0,.2,1)",
                    boxShadow: "0 0 8px rgba(0,212,255,0.5)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { SkillsSection };
```

## components/sections/stats-section.tsx

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useLang } from "@/lib/language-context";

const STATS_BASE = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    value: 20, suffix: "+", color: "#00d4ff",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    value: 13, suffix: "+", color: "#0066cc",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    value: 3,  suffix: "+", color: "#00d4ff",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="14.5" r="2.5"/><circle cx="8.5" cy="14.5" r="2.5"/>
        <line x1="13.5" y1="9" x2="17.5" y2="12"/><line x1="13.5" y1="9" x2="8.5" y2="12"/>
      </svg>
    ),
    value: 4,  suffix: "+", color: "#0066cc",
  },
];

function Counter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [active, target]);

  return <>{count}{suffix}</>;
}

export default function StatsSection() {
  const ref  = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLang();
  const STATS = STATS_BASE.map((s, i) => ({ ...s, label: t.stats.items[i] }));

  return (
    <section id="stats" className="relative py-24 overflow-hidden">

      {/* Background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,102,204,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-16">

        {/* Section heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="block h-px w-8" style={{ background: "linear-gradient(90deg,transparent,#00d4ff)" }} />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "var(--color-phi-cyan)" }}>
              {t.stats.eyebrow}
            </span>
            <span className="block h-px w-8" style={{ background: "linear-gradient(90deg,#00d4ff,transparent)" }} />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black mb-4">
            {t.stats.title1}{" "}
            <span style={{
              background: "linear-gradient(135deg,#0066cc,#00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {t.stats.title2}
            </span>
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: "var(--foreground)", opacity: 0.55 }}>
            {t.stats.description}
          </p>
        </div>

        {/* Stats grid */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-6 right-6 h-px rounded-full"
                style={{ background: `linear-gradient(90deg,transparent,${s.color},transparent)` }}
              />

              {/* Icon */}
              <div
                className="flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                style={{
                  background: `linear-gradient(135deg,${s.color}18,${s.color}08)`,
                  border: `1px solid ${s.color}30`,
                  color: s.color,
                }}
              >
                {s.icon}
              </div>

              {/* Counter */}
              <div
                className="font-display text-5xl font-black mb-2 tabular-nums"
                style={{ color: s.color, lineHeight: 1 }}
              >
                <Counter target={s.value} suffix={s.suffix} active={inView} />
              </div>

              {/* Label */}
              <div
                className="text-sm font-medium"
                style={{ color: "var(--foreground)", opacity: 0.6 }}
              >
                {s.label}
              </div>

              {/* Bottom glow */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-px"
                style={{ background: `linear-gradient(90deg,transparent,${s.color}50,transparent)` }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export { StatsSection };
```

## components/sections/portfolio-section.tsx

```tsx
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PORTFOLIO, PORTFOLIO_FILTERS, type PortfolioCategory } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

export function PortfolioSection() {
  const { t } = useLang();
  const [filter, setFilter] = useState<PortfolioCategory>("Tous");
  const projects = useMemo(
    () => (filter === "Tous" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section
      id="portfolio"
      className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden"
      aria-labelledby="portfolio-title"
    >
      <div aria-hidden className="absolute inset-0 bg-grid bg-grid-fade opacity-50 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.portfolio.eyebrow}
          title={
            <>
              {t.portfolio.title1} <span className="text-phi-gradient">{t.portfolio.title2}</span>
            </>
          }
        />

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {PORTFOLIO_FILTERS.map((f, i) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium border transition",
                  active
                    ? "border-transparent bg-phi-gradient text-white shadow-[0_8px_22px_-12px_rgba(0,212,255,0.55)]"
                    : "border-[color:var(--border)] text-foreground/80 hover:border-phi-cyan/60 hover:text-phi-cyan"
                )}
              >
                {t.portfolio.filters[i] ?? f}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
              >
                <Card interactive className="h-full flex flex-col">
                  <div
                    className="mb-5 aspect-[16/10] w-full rounded-xl border border-white/10 grid place-items-center text-white relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`,
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-30 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.4), transparent 50%)",
                      }}
                    />
                    <span className="relative text-5xl font-display font-semibold drop-shadow-lg">
                      {p.title.slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                    <span className="rounded-full border border-[color:var(--border)] px-2.5 py-0.5 text-xs text-foreground/70">
                      {p.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/70 line-clamp-3 flex-1">
                    {p.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-[color:var(--surface-muted)] px-2.5 py-0.5 text-xs text-foreground/70"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  {(p.link || p.repo) && (
                    <div className="mt-5 flex items-center gap-3 text-sm">
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-phi-cyan hover:underline"
                        >
                          Voir le projet <Icon name="external" size={14} />
                        </a>
                      )}
                      {p.repo && (
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-phi-cyan"
                          aria-label={`Voir ${p.title} sur GitHub`}
                        >
                          <Icon name="github" size={16} /> GitHub
                        </a>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
```

## components/sections/team-section.tsx

```tsx
"use client";

import { motion } from "framer-motion";
import { TEAM, TEAM_EXPANSION_MESSAGE } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "./section-heading";
import { useLang } from "@/lib/language-context";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TeamSection() {
  const { t } = useLang();
  return (
    <section
      id="team"
      className="relative scroll-mt-24 py-24 sm:py-32 bg-[color:var(--background-alt)]"
      aria-labelledby="team-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.team.eyebrow}
          title={
            <>
              {t.team.title1} <span className="text-phi-gradient">{t.team.title2}</span>
            </>
          }
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card interactive className="h-full">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-phi-gradient text-white text-2xl font-semibold tracking-wide shadow-[0_12px_30px_-10px_rgba(0,212,255,0.55)]">
                    {initials(m.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold tracking-tight">{m.name}</h3>
                    <p className="text-sm font-medium text-phi-cyan">{m.role}</p>
                    <p className="mt-3 text-sm text-foreground/70">{m.bio}</p>
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn de ${m.name}`}
                        className="mt-4 inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--border)] px-3 text-xs font-medium text-foreground/80 hover:text-phi-cyan hover:border-phi-cyan/60"
                      >
                        <Icon name="linkedin" size={14} /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Carte "Équipe en expansion" — recrutement */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full relative overflow-hidden border-dashed">
              <div
                aria-hidden
                className="absolute -inset-1 opacity-40 blur-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(60% 50% at 30% 30%, rgba(0,212,255,0.25), transparent 70%), radial-gradient(50% 40% at 80% 70%, rgba(0,102,204,0.20), transparent 70%)",
                }}
              />
              <div className="relative flex flex-col items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-phi-gradient text-white">
                  <Icon name="sparkle" size={20} />
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{t.team.expanding}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{t.team.expandingDesc}</p>
                </div>
                <a
                  href="#contact"
                  className="mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-phi-gradient px-5 text-sm font-semibold text-white shadow-[0_8px_22px_-10px_rgba(0,212,255,0.55)] hover:brightness-110"
                >
                  {t.team.joinBtn} <Icon name="arrowRight" size={14} />
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

## components/sections/testimonials-section.tsx

```tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/data";
import { SectionHeading } from "./section-heading";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

export function TestimonialsSection() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-24 py-24 sm:py-32"
      aria-labelledby="testimonials-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.testimonials.eyebrow}
          title={(() => {
            const words = t.testimonials.title.trim().split(" ");
            if (words.length < 2) {
              return <span className="text-phi-gradient">{t.testimonials.title}</span>;
            }
            const last = words[words.length - 1];
            const head = words.slice(0, -1).join(" ");
            return (
              <>
                {head} <span className="text-phi-gradient">{last}</span>
              </>
            );
          })()}
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 sm:p-12 min-h-[260px]">
            <Icon
              name="sparkle"
              size={32}
              className="absolute right-6 top-6 text-phi-cyan/40"
            />
            <AnimatePresence mode="wait">
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <blockquote className="text-lg sm:text-xl font-medium leading-relaxed text-foreground/90">
                  « {TESTIMONIALS[idx].quote} »
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-phi-gradient text-white text-sm font-semibold">
                    {TESTIMONIALS[idx].name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{TESTIMONIALS[idx].name}</p>
                    <p className="text-xs text-foreground/60">{TESTIMONIALS[idx].role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Témoignage ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === idx ? "w-8 bg-phi-gradient" : "w-2 bg-[color:var(--border-strong)] hover:bg-phi-cyan/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

## components/sections/contact-section.tsx

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { SITE, SOCIALS } from "@/lib/data";
import { Icon, type IconName } from "@/components/ui/icon";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactSection() {
  const { t } = useLang();
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const subject = encodeURIComponent(`[Site] Demande de ${name}`);
    const body = encodeURIComponent(`${message}\n\n—\nDe : ${name} <${email}>`);
    setTimeout(() => {
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      form.reset();
    }, 350);
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 py-24 sm:py-32 bg-[color:var(--background-alt)]"
      aria-labelledby="contact-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.contact.eyebrow}
          title={(() => {
            const words = t.contact.title.trim().split(" ");
            if (words.length < 2) {
              return <span className="text-phi-gradient">{t.contact.title}</span>;
            }
            const last = words[words.length - 1];
            const head = words.slice(0, -1).join(" ");
            return (
              <>
                {head} <span className="text-phi-gradient">{last}</span>
              </>
            );
          })()}
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            <a
              href={`mailto:${SITE.email}`}
              className="group flex items-start gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 hover:border-phi-cyan/60"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-phi-gradient text-white">
                <Icon name="mail" size={18} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/60">Email</p>
                <p className="text-sm font-medium group-hover:text-phi-cyan break-all">
                  {SITE.email}
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-phi-gradient text-white">
                <Icon name="phone" size={18} />
              </span>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-foreground/60">Téléphone</p>
                {SITE.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s+/g, "")}`}
                    className="block text-sm font-medium hover:text-phi-cyan"
                  >
                    {p}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-phi-gradient text-white">
                <Icon name="mapPin" size={18} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/60">Localisation</p>
                <p className="text-sm font-medium">{SITE.location}</p>
              </div>
            </div>

            <ul className="flex gap-2 pt-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-foreground/80 hover:text-phi-cyan hover:border-phi-cyan/60"
                  >
                    <Icon name={s.icon as IconName} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={onSubmit}
            className="lg:col-span-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 sm:p-8 space-y-5"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label={t.contact.fullName} required type="text" autoComplete="name" />
              <Field id="email" label={t.contact.email} required type="email" autoComplete="email" />
            </div>
            <Field id="subject" label={t.contact.subject} type="text" />
            <Field id="message" label={t.contact.message} required as="textarea" rows={5} />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p
                className={cn(
                  "text-xs",
                  status === "error" ? "text-red-500" :
                  status === "sent" ? "text-phi-cyan" :
                  "text-foreground/60"
                )}
                aria-live="polite"
              >
                {status === "idle" && " "}
                {status === "sending" && t.contact.sending}
                {status === "sent" && t.contact.sent}
                {status === "error" && "Merci de remplir nom, email et message."}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-phi-gradient px-6 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(0,212,255,0.55)] hover:brightness-110 disabled:opacity-60"
              >
                {status === "sending" ? t.contact.sending : t.contact.send}
                <Icon name="arrowRight" size={16} />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  as = "input",
  required = false,
  rows,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  as?: "input" | "textarea";
  required?: boolean;
  rows?: number;
  autoComplete?: string;
}) {
  const cls =
    "w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-phi-cyan focus:outline-none focus:ring-2 focus:ring-phi-cyan/30";
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label} {required && <span className="text-phi-cyan">*</span>}
      </span>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          required={required}
          className={cls}
          placeholder="…"
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={cls}
          placeholder="…"
        />
      )}
    </label>
  );
}
```

## components/ui/footer.tsx

```tsx
"use client";

import Link from "next/link";
import { SITE, SOCIALS } from "@/lib/data";
import { useLang } from "@/lib/language-context";
import { Logo } from "./logo";
import { Icon, type IconName } from "./icon";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  const NAV_LINKS: { label: string; href: string }[] = [
    { label: t.nav.home, href: "#hero" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.portfolio, href: "#portfolio" },
    { label: t.nav.team, href: "#team" },
    { label: t.nav.contact, href: "#contact" },
  ];
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Logo height={100} />
          <p className="max-w-md text-sm text-foreground/70">
            {t.footer.description}
          </p>
          <ul className="flex items-center gap-3 pt-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--border)] text-foreground/80 hover:text-phi-cyan hover:border-phi-cyan/60 dark:border-white/20 dark:text-white/60 dark:hover:border-phi-cyan dark:hover:text-phi-cyan"
                >
                  <Icon name={s.icon as IconName} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80">
            {t.footer.navigation}
          </h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-foreground/70 hover:text-phi-cyan">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80">
            {t.footer.contact}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${SITE.email}`} className="text-foreground/70 hover:text-phi-cyan flex items-center gap-2">
                <Icon name="mail" size={16} /> {SITE.email}
              </a>
            </li>
            {SITE.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s+/g, "")}`} className="text-foreground/70 hover:text-phi-cyan flex items-center gap-2">
                  <Icon name="phone" size={16} /> {p}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-2 text-foreground/70">
              <Icon name="mapPin" size={16} /> {SITE.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/60">
          <p>© {year} {SITE.name}. {t.footer.rights}</p>
          <p className="text-foreground/50">{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
```

## components/ui/icon.tsx

```tsx
import type { SVGProps } from "react";

type IconName =
  | "github"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "mail"
  | "phone"
  | "mapPin"
  | "sun"
  | "moon"
  | "arrowRight"
  | "external"
  | "menu"
  | "close"
  | "code"
  | "palette"
  | "smartphone"
  | "sparkle"
  | "check";

const PATHS: Record<IconName, React.ReactNode> = {
  github: (
    <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.58.11.79-.25.79-.55v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.94.14 2.86.39 2.18-1.49 3.14-1.18 3.14-1.18.63 1.58.24 2.74.12 3.03.74.8 1.18 1.83 1.18 3.08 0 4.4-2.69 5.36-5.25 5.65.41.35.77 1.05.77 2.13v3.16c0 .3.21.66.79.55A11.5 11.5 0 0 0 12 .5z" />
  ),
  linkedin: (
    <>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 4.98 8.5 2.5 2.5 0 0 1 4.98 3.5z" />
      <path d="M3 9.75h4v11.25H3V9.75zM9 9.75h3.84v1.54h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.12V21H17.7v-5.25c0-1.25-.02-2.86-1.74-2.86-1.74 0-2.01 1.36-2.01 2.77V21H10.13V9.75H9z" />
    </>
  ),
  twitter: (
    <path d="M18.244 3H21l-6.49 7.42L22 21h-6.828l-4.56-5.96L5.2 21H2.44l6.95-7.95L2 3h6.91l4.13 5.46L18.244 3zm-2.39 16h1.51L7.23 4.94H5.6L15.854 19z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  phone: (
    <path d="M4.5 3.75A2.25 2.25 0 0 1 6.75 1.5h1.61c.86 0 1.62.55 1.88 1.37l.77 2.39a1.97 1.97 0 0 1-.49 2l-1.18 1.18a13 13 0 0 0 5.96 5.96l1.18-1.18a1.97 1.97 0 0 1 2-.49l2.39.77a1.97 1.97 0 0 1 1.37 1.88v1.61a2.25 2.25 0 0 1-2.25 2.25C10.6 19.24 4.76 13.4 4.5 3.75z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  mapPin: (
    <>
      <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.5" y1="4.5" x2="6" y2="6" />
        <line x1="18" y1="18" x2="19.5" y2="19.5" />
        <line x1="4.5" y1="19.5" x2="6" y2="18" />
        <line x1="18" y1="6" x2="19.5" y2="4.5" />
      </g>
    </>
  ),
  moon: (
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor" />
  ),
  arrowRight: (
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  external: (
    <path d="M14 4h6v6M20 4l-9 9M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  menu: (
    <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  close: (
    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  code: (
    <path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.66 0 2-1.34 2-3 0-1.66 1.34-3 3-3h2a4 4 0 0 0 4-4 9 9 0 0 0-11-8z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.5" cy="10" r="1.2" fill="currentColor" />
      <circle cx="12" cy="7" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="10" r="1.2" fill="currentColor" />
    </>
  ),
  smartphone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zm7 9l.8 2.4L22 15l-2.2.6L19 18l-.8-2.4L16 15l2.2-.6L19 12z" fill="currentColor" />
  ),
  check: (
    <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

export function Icon({
  name,
  className,
  size = 20,
  ...rest
}: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

export type { IconName };
```

## lib/utils.ts

```ts
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
```

## lib/data.ts

```ts
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
```

## lib/language-context.tsx

```tsx
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type Lang, type Translations } from "./i18n";

type LangContextValue = {
  lang: Lang;
  t: Translations;
  toggle: () => void;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LangContextValue>({
  lang: "fr",
  t: translations.fr,
  toggle: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("phibrain-lang");
      if (saved === "fr" || saved === "en") setLangState(saved);
    } catch {
      /* localStorage indisponible */
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem("phibrain-lang", next);
    } catch {
      /* ignore */
    }
  };

  const toggle = () => setLang(lang === "fr" ? "en" : "fr");

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
```

## lib/i18n.ts

```ts
export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      services: "Services",
      skills: "Compétences",
      portfolio: "Portfolio",
      team: "Équipe",
      contact: "Contact",
      cta: "Discuter du projet",
    },
    hero: {
      eyebrow: "Là où la créativité rencontre l'intelligence.",
      title: "On code, on design, on pense en PhiBrain.",
      description:
        "Agence tech qui conçoit des produits numériques où le design, l'intelligence artificielle et l'ingénierie travaillent ensemble — pas l'un contre l'autre.",
      cta1: "Démarrer un projet",
      cta2: "Voir nos réalisations",
    },
    slider: {
      phrases: [
        "On transforme vos idées en code.",
        "Du premier croquis au déploiement.",
        "Une marque qui se reconnaît partout.",
        "Chaque pixel a une raison d'être.",
        "Le futur, on le construit maintenant.",
        "L'ingénierie au service de l'ambition.",
      ],
    },
    services: {
      eyebrow: "Services",
      title: "Ce que PhiBrain fabrique",
      description:
        "Du premier croquis au déploiement en production, une équipe pluridisciplinaire qui prend en charge l'ensemble du cycle produit.",
    },
    skills: {
      eyebrow: "Compétences",
      title: "Une stack complète.",
      description: "Du pixel au serveur, on maîtrise chaque couche.",
    },
    stats: {
      eyebrow: "Statistiques",
      title1: "Chaque ligne compilée.",
      title2: "Chaque pixel justifié.",
      description:
        "Quatre ans à transformer des idées en produits qui existent vraiment.",
      items: [
        "Projets livrés",
        "Apps mobiles",
        "Sites web",
        "Identités & designs",
      ],
    },
    portfolio: {
      eyebrow: "Portfolio",
      title1: "Quelques projets livrés",
      title2: "récemment",
      filters: ["Tous", "Apps", "Design", "Sites"],
    },
    team: {
      eyebrow: "Équipe",
      title1: "Les cerveaux derrière",
      title2: "PhiBrain",
      expanding: "Équipe en expansion",
      expandingDesc:
        "Notre équipe est en pleine expansion — nous recrutons designers, mobile engineers et back-end developers. Envie de nous rejoindre ?",
      joinBtn: "Rejoindre l'équipe",
    },
    testimonials: {
      eyebrow: "Témoignages",
      title: "Ils nous ont fait confiance",
    },
    contact: {
      eyebrow: "Contact",
      title: "Démarrons quelque chose.",
      send: "Envoyer le message",
      sending: "Envoi...",
      sent: "Message envoyé !",
      fullName: "Nom complet",
      email: "Email",
      subject: "Sujet",
      message: "Votre message",
    },
    footer: {
      rights: "Tous droits réservés.",
      tagline: "Là où la créativité rencontre l'intelligence.",
      navigation: "NAVIGATION",
      contact: "CONTACT",
      description:
        "PhiBrain Inc — agence tech qui conçoit des sites web, des applications mobiles et des identités de marque qui mêlent design, IA et performance.",
    },
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      skills: "Skills",
      portfolio: "Portfolio",
      team: "Team",
      contact: "Contact",
      cta: "Start a project",
    },
    hero: {
      eyebrow: "Where creativity meets intelligence.",
      title: "We code, we design, we think PhiBrain.",
      description:
        "A tech agency crafting digital products where design, artificial intelligence and engineering work together — not against each other.",
      cta1: "Start a project",
      cta2: "See our work",
    },
    slider: {
      phrases: [
        "We turn your ideas into code.",
        "From first sketch to deployment.",
        "A brand that stands out everywhere.",
        "Every pixel has a purpose.",
        "The future, we build it now.",
        "Engineering at the service of ambition.",
      ],
    },
    services: {
      eyebrow: "Services",
      title: "What PhiBrain builds",
      description:
        "From the first sketch to production deployment, a multidisciplinary team handling the entire product cycle.",
    },
    skills: {
      eyebrow: "Skills",
      title: "A complete stack.",
      description: "From pixel to server, we master every layer.",
    },
    stats: {
      eyebrow: "Statistics",
      title1: "Every line compiled.",
      title2: "Every pixel justified.",
      description:
        "Four years turning ideas into products that actually exist.",
      items: ["Projects delivered", "Mobile apps", "Websites", "Identities & designs"],
    },
    portfolio: {
      eyebrow: "Portfolio",
      title1: "Some recently",
      title2: "delivered projects",
      filters: ["All", "Apps", "Design", "Sites"],
    },
    team: {
      eyebrow: "Team",
      title1: "The brains behind",
      title2: "PhiBrain",
      expanding: "Team is growing",
      expandingDesc:
        "Our team is expanding — hiring designers, mobile engineers and back-end developers. Want to join us?",
      joinBtn: "Join the team",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "They trusted us",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's build something.",
      send: "Send message",
      sending: "Sending...",
      sent: "Message sent!",
      fullName: "FULL NAME",
      email: "EMAIL",
      subject: "SUBJECT",
      message: "YOUR MESSAGE",
    },
    footer: {
      rights: "All rights reserved.",
      tagline: "Where creativity meets intelligence.",
      navigation: "NAVIGATION",
      contact: "CONTACT",
      description:
        "PhiBrain Inc — a tech agency crafting websites, mobile apps and brand identities that blend design, AI and performance.",
    },
  },
};

export type Lang = "fr" | "en";
export type Translations = (typeof translations)["fr"];
```
