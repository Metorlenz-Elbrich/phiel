"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import type { CmsSkill } from "@/lib/cms";
import type { SkillCategory } from "@/lib/data";
import { useLang } from "@/lib/language-context";

const CATEGORY_ORDER: SkillCategory[] = ["Front-end", "Back-end", "Mobile", "Design"];
const CATEGORY_COLORS: Record<SkillCategory, string> = {
  "Front-end": "#00d4ff",
  "Back-end":  "#5ea8ff",
  Mobile:      "#7ee787",
  Design:      "#ffa657",
};

const SKILL_ICONS: Record<string, string> = {
  HTML5: "🌐", CSS3: "🎨", JavaScript: "⚡", React: "⚛️", TypeScript: "📘",
  Laravel: "🔺", PHP: "🐘", "Node.js": "🟢",
  Flutter: "💙", Kotlin: "🤖",
  "Adobe CC": "🅰️", Figma: "🖼️",
};

type SkillTreeNode = {
  name:     string;
  pct:      number;
  icon:     string;
  devicon?: string;
  tier: "legendary" | "epic" | "rare";
};

function levelToTier(level: number): SkillTreeNode["tier"] {
  if (level >= 90) return "legendary";
  if (level >= 80) return "epic";
  return "rare";
}

const FALLBACK_COLORS = ["#e879f9", "#34d399", "#fb923c", "#a3e635"];

function buildTree(skills: CmsSkill[], lang: "fr" | "en") {
  const byCat = new Map<string, CmsSkill[]>();
  for (const s of skills) {
    if (!byCat.has(s.category)) byCat.set(s.category, []);
    byCat.get(s.category)!.push(s);
  }
  const known   = CATEGORY_ORDER.filter((c) => byCat.has(c));
  const dynamic = Array.from(byCat.keys()).filter((c) => !CATEGORY_ORDER.includes(c as SkillCategory));
  const allCats = [...known, ...dynamic];

  return allCats.map((cat, idx) => ({
    category: cat,
    color: CATEGORY_COLORS[cat as SkillCategory] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
    nodes: byCat.get(cat)!.map((s) => {
      const name = lang === "en" && s.name_en ? s.name_en : s.name_fr;
      return {
        name,
        pct:     s.level,
        icon:    SKILL_ICONS[name] ?? SKILL_ICONS[s.name_fr] ?? "⭐",
        devicon: s.devicon || undefined,
        tier:    levelToTier(s.level),
      };
    }),
  }));
}

const TIER_STYLES: Record<string, {
  border: string; bg: string; glow: string;
  label: string; labelBg: string; labelFg: string;
}> = {
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

function SkillNode({ node, visible, delay }: {
  node:     SkillTreeNode;
  catColor: string;
  visible:  boolean;
  delay:    number;
}) {
  const ts = TIER_STYLES[node.tier];
  return (
    <div
      className="flex flex-col items-center"
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ${delay}ms, transform 0.5s ${delay}ms`,
      }}
    >
      <div
        className="relative flex flex-col items-center justify-center rounded-xl cursor-default"
        style={{
          width:      "80px",
          height:     "80px",
          border:     `1.5px solid ${ts.border}`,
          background: ts.bg,
          boxShadow:  ts.glow,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        }}
      >
        {node.devicon ? (
          <i
            className={`devicon-${node.devicon}-plain colored`}
            style={{ fontSize: "32px", lineHeight: 1 }}
          />
        ) : (
          <span style={{ fontSize: "32px", lineHeight: 1 }}>{node.icon}</span>
        )}

        {/* Coins décoratifs */}
        {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r",
          "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-2 h-2 ${cls}`} style={{ borderColor: ts.border, opacity: 0.7 }} />
        ))}
      </div>

      {/* Nom */}
      <div
        className="mt-2 text-center"
        style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", maxWidth: "80px" }}
      >
        {node.name}
      </div>

      {/* Badge tier */}
      <div
        className="mt-1 px-2 py-0.5 rounded-full"
        style={{
          fontSize:      "8px",
          letterSpacing: "0.08em",
          background:    ts.labelBg,
          color:         ts.labelFg,
          fontFamily:    "monospace",
        }}
      >
        {ts.label}
      </div>
    </div>
  );
}

export default function SkillsSection({ skills }: { skills: CmsSkill[] }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { lang, t } = useLang();
  const TREE = buildTree(skills, lang);

  const titleTrimmed = t.skills.title.trim();
  const lastSpace    = titleTrimmed.lastIndexOf(" ");
  const titlePrefix  = lastSpace > 0 ? titleTrimmed.slice(0, lastSpace + 1) : "";
  const titleAccent  = lastSpace > 0 ? titleTrimmed.slice(lastSpace + 1) : titleTrimmed;

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
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
              WebkitTextFillColor:  "transparent",
              backgroundClip:       "text",
            }}>
              {titleAccent}
            </span>
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: "var(--foreground)", opacity: 0.55 }}>
            {t.skills.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        <div
          ref={ref}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "#07101f",
            border:     "1px solid rgba(0,212,255,0.15)",
            boxShadow:  "0 0 60px rgba(0,102,204,0.15)",
          }}
        >
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

          {/* HUD header */}
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
              ].map((tier) => (
                <div key={tier.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: tier.color }} />
                  <span style={{ fontSize: "9px", fontFamily: "monospace", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
                    {tier.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative p-8">
            <div className="flex gap-6 justify-center flex-wrap lg:flex-nowrap">
              {TREE.map((cat, ci) => (
                <div key={cat.category} className="flex flex-col items-center min-w-[96px]">
                  <div
                    className="mb-6 px-3 py-1 rounded-full text-center"
                    style={{
                      fontSize:      "9px",
                      letterSpacing: "0.12em",
                      fontFamily:    "monospace",
                      color:         cat.color,
                      border:        `1px solid ${cat.color}40`,
                      background:    `${cat.color}12`,
                    }}
                  >
                    {cat.category.toUpperCase()}
                  </div>

                  {cat.nodes.map((node, ni) => (
                    <div key={node.name} className="flex flex-col items-center">
                      <SkillNode
                        node={node}
                        catColor={cat.color}
                        visible={inView}
                        delay={ci * 80 + ni * 100}
                      />
                      {ni < cat.nodes.length - 1 && (
                        <div
                          style={{
                            width:      "2px",
                            height:     "20px",
                            background: `linear-gradient(to bottom, ${cat.color}60, ${cat.color}20)`,
                            margin:     "4px 0",
                            opacity:    inView ? 1 : 0,
                            transition: `opacity 0.5s ${ci * 80 + ni * 100 + 200}ms`,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* XP bar */}
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
                    height:       "100%",
                    width:        inView ? "86%" : "0%",
                    background:   "linear-gradient(90deg,#0066cc,#00d4ff)",
                    borderRadius: "9999px",
                    transition:   "width 1.5s 0.8s cubic-bezier(.4,0,.2,1)",
                    boxShadow:    "0 0 8px rgba(0,212,255,0.5)",
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
