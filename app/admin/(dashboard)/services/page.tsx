"use client";

import { useState, useEffect } from "react";
import { EntityTable, type FieldConfig, type IconOption } from "../_components/entity-table";

const VALID_ICON_VALUES = [
  "palette", "code", "smartphone", "sparkle", "mail",
  "phone", "mapPin", "arrowRight", "external", "check",
] as const;

const DEFAULT_ICONS: IconOption[] = [
  { value: "palette",    label: "Design / Branding", emoji: "🎨" },
  { value: "code",       label: "Développement Web",  emoji: "💻" },
  { value: "smartphone", label: "Mobile",             emoji: "📱" },
  { value: "sparkle",    label: "IA / Innovation",    emoji: "✨" },
  { value: "mail",       label: "Communication",      emoji: "📧" },
];

const STORAGE_KEY = "phibrain-admin-service-icons";

function loadIcons(): IconOption[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_ICONS;
}

function saveIcons(icons: IconOption[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(icons));
  } catch { /* ignore */ }
}

export default function ServicesAdminPage() {
  const [icons, setIcons]       = useState<IconOption[]>(DEFAULT_ICONS);
  const [mounted, setMounted]   = useState(false);
  const [newVal, setNewVal]     = useState("");
  const [newLbl, setNewLbl]     = useState("");
  const [newEmj, setNewEmj]     = useState("");
  const [editIdx, setEditIdx]   = useState<number | null>(null);
  const [editIcon, setEditIcon] = useState<IconOption>({ value: "", label: "", emoji: "" });

  // Charger depuis localStorage au montage
  useEffect(() => {
    setIcons(loadIcons());
    setMounted(true);
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (mounted) saveIcons(icons);
  }, [icons, mounted]);

  const fields: FieldConfig[] = [
    { name: "icon",         label: "Icône",                                          type: "icon-picker", iconOptions: icons, required: true },
    { name: "order",        label: "Ordre",                                          type: "number" },
    { name: "title_fr",       label: "Titre (FR)",                                  type: "text",     max: 100, required: true,  langGroup: "fr" },
    { name: "description_fr", label: "Description (FR)",                            type: "textarea", max: 500, required: true,  langGroup: "fr" },
    { name: "features_fr",    label: "Caractéristiques FR (séparées par virgules)", type: "tags",                               langGroup: "fr" },
    { name: "title_en",       label: "Title (EN)",                                  type: "text",     max: 100,                langGroup: "en" },
    { name: "description_en", label: "Description (EN)",                            type: "textarea", max: 500,                langGroup: "en" },
    { name: "features_en",    label: "Features EN (comma-separated)",               type: "tags",                              langGroup: "en" },
  ];

  function addIcon() {
    if (!newVal || !newLbl || !newEmj) return;
    if (icons.some((i) => i.value === newVal)) return;
    setIcons((prev) => [...prev, { value: newVal, label: newLbl, emoji: newEmj }]);
    setNewVal(""); setNewLbl(""); setNewEmj("");
  }

  function startEdit(idx: number) {
    setEditIdx(idx);
    setEditIcon({ ...icons[idx] });
  }

  function saveEdit() {
    if (editIdx === null) return;
    setIcons((prev) => prev.map((ic, i) => (i === editIdx ? { ...editIcon } : ic)));
    setEditIdx(null);
  }

  return (
    <div className="space-y-8">
      <EntityTable
        title="Services"
        resource="services"
        fields={fields}
        defaults={{
          icon:           icons[0]?.value ?? "palette",
          order:          0,
          title_fr:       "",
          description_fr: "",
          features_fr:    [],
          title_en:       "",
          description_en: "",
          features_en:    [],
        }}
      />

      {/* ── Gestion des icônes ── */}
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: "rgba(0,212,255,0.12)", background: "rgba(255,255,255,0.02)" }}
      >
        <h2 className="text-lg font-semibold mb-4">Gestion des icônes</h2>

        <div className="rounded-xl border overflow-hidden mb-6" style={{ borderColor: "rgba(0,212,255,0.12)" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "rgba(0,212,255,0.08)" }}>
              <tr>
                <th className="px-4 py-3 text-left font-medium w-16">Emoji</th>
                <th className="px-4 py-3 text-left font-medium">Valeur</th>
                <th className="px-4 py-3 text-left font-medium">Label</th>
                <th className="px-4 py-3 text-right font-medium" />
              </tr>
            </thead>
            <tbody>
              {icons.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-white/40">
                    Aucune icône configurée.
                  </td>
                </tr>
              )}
              {icons.map((icon, idx) => (
                <tr key={idx} className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {editIdx === idx ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          value={editIcon.emoji}
                          onChange={(e) => setEditIcon((p) => ({ ...p, emoji: e.target.value }))}
                          className="w-12 rounded border bg-black/20 px-2 py-1 text-sm outline-none focus:border-[#00d4ff]"
                          style={{ borderColor: "rgba(255,255,255,0.12)" }}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editIcon.value}
                          onChange={(e) => setEditIcon((p) => ({ ...p, value: e.target.value }))}
                          className="w-full rounded border bg-black/20 px-2 py-1 text-sm outline-none focus:border-[#00d4ff]"
                          style={{ borderColor: "rgba(255,255,255,0.12)" }}
                        >
                          {VALID_ICON_VALUES.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={editIcon.label}
                          onChange={(e) => setEditIcon((p) => ({ ...p, label: e.target.value }))}
                          className="w-full rounded border bg-black/20 px-2 py-1 text-sm outline-none focus:border-[#00d4ff]"
                          style={{ borderColor: "rgba(255,255,255,0.12)" }}
                        />
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        <button type="button" onClick={saveEdit}
                          className="mr-2 rounded-full px-3 py-1 text-xs font-medium text-white"
                          style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}>
                          Enregistrer
                        </button>
                        <button type="button" onClick={() => setEditIdx(null)}
                          className="rounded-full border px-3 py-1 text-xs text-white/60"
                          style={{ borderColor: "rgba(255,255,255,0.18)" }}>
                          Annuler
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 text-xl">{icon.emoji}</td>
                      <td className="px-4 py-2 font-mono text-xs text-white/70">{icon.value}</td>
                      <td className="px-4 py-2">{icon.label}</td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        <button type="button" onClick={() => startEdit(idx)}
                          className="mr-2 rounded-full border px-3 py-1 text-xs text-white/70 hover:text-[#00d4ff] hover:border-[#00d4ff] transition-colors"
                          style={{ borderColor: "rgba(255,255,255,0.18)" }}>
                          Modifier
                        </button>
                        <button type="button"
                          onClick={() => setIcons((prev) => prev.filter((_, i) => i !== idx))}
                          className="rounded-full border px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                          style={{ borderColor: "rgba(248,113,113,0.4)" }}>
                          Supprimer
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/70">Emoji</span>
            <input value={newEmj} onChange={(e) => setNewEmj(e.target.value)}
              placeholder="🎨"
              className="w-16 rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
              style={{ borderColor: "rgba(255,255,255,0.12)" }} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/70">Valeur (IconName)</span>
            <select value={newVal} onChange={(e) => setNewVal(e.target.value)}
              className="rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}>
              <option value="">— choisir —</option>
              {VALID_ICON_VALUES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="block flex-1 min-w-[160px]">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/70">Label</span>
            <input value={newLbl} onChange={(e) => setNewLbl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIcon()}
              placeholder="ex: Design / Branding"
              className="w-full rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
              style={{ borderColor: "rgba(255,255,255,0.12)" }} />
          </label>
          <button type="button" onClick={addIcon}
            className="rounded-full px-5 py-2 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
