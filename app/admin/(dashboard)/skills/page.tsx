"use client";

import { useState } from "react";
import { EntityTable, type FieldConfig } from "../_components/entity-table";
import { CategoryManager } from "../_components/category-manager";

const DEVICON_OPTIONS = [
  { value: "html5",      label: "HTML5" },
  { value: "css3",       label: "CSS3" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react",      label: "React" },
  { value: "nextjs",     label: "Next.js" },
  { value: "nodejs",     label: "Node.js" },
  { value: "php",        label: "PHP" },
  { value: "laravel",    label: "Laravel" },
  { value: "flutter",    label: "Flutter" },
  { value: "kotlin",     label: "Kotlin" },
  { value: "figma",      label: "Figma" },
  { value: "photoshop",  label: "Photoshop" },
  { value: "mongodb",    label: "MongoDB" },
  { value: "mysql",      label: "MySQL" },
  { value: "git",        label: "Git" },
];

const DEFAULT_CATEGORIES = ["Front-end", "Back-end", "Mobile", "Design"];

export default function SkillsAdminPage() {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCat, setNewCat]         = useState("");

  const fields: FieldConfig[] = [
    { name: "name",     label: "Nom",            type: "text",    max: 80,  required: true },
    { name: "category", label: "Catégorie",      type: "select",  options: categories, required: true },
    { name: "level",    label: "Niveau (0–100)", type: "number",            required: true },
    { name: "devicon",  label: "Icône Devicon",  type: "devicon", deviconOptions: DEVICON_OPTIONS },
    { name: "order",    label: "Ordre",          type: "number" },
  ];

  function addCategory() {
    const trimmed = newCat.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories((prev) => [...prev, trimmed]);
    setNewCat("");
  }

  return (
    <div className="space-y-8">
      <EntityTable
        title="Compétences"
        resource="skills"
        fields={fields}
        defaults={{ name: "", category: categories[0] ?? "Front-end", level: 80, devicon: "", order: 0 }}
      />

      {/* ── Gestion des catégories ── */}
      <div className="space-y-3">
        {/* Ajouter une catégorie */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "rgba(0,212,255,0.12)", background: "rgba(255,255,255,0.02)" }}
        >
          <h2 className="text-base font-semibold mb-3">Ajouter une catégorie</h2>
          <div className="flex gap-2">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="Nom de la nouvelle catégorie"
              className="flex-1 rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            />
            <button
              type="button"
              onClick={addCategory}
              className="rounded-full px-5 py-2 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}
            >
              + Ajouter
            </button>
          </div>
        </div>

        {/* Renommer / Supprimer (CategoryManager) */}
        <CategoryManager resource="skills" endpoint="/api/admin/skills/categories" />
      </div>
    </div>
  );
}
