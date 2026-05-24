"use client";

import { useState } from "react";
import { EntityTable, type FieldConfig } from "../_components/entity-table";
import { CategoryManager } from "../_components/category-manager";

const DEFAULT_CATEGORIES = ["Apps", "Design", "Sites"];

export default function ProjectsAdminPage() {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCat, setNewCat]         = useState("");

  const fields: FieldConfig[] = [
    // Champs sans langGroup : toujours visibles
    { name: "category", label: "Catégorie",                   type: "select",    options: categories, required: true },
    { name: "imageUrl", label: "URL de l'image",              type: "image-url" },
    { name: "tags",     label: "Tags (séparés par virgules)", type: "tags" },
    { name: "link",     label: "Lien externe",                type: "url" },
    { name: "repo",     label: "Repo Git",                    type: "url" },
    { name: "order",    label: "Ordre",                       type: "number" },
    // Onglet FR
    { name: "title_fr",       label: "Titre (FR)",        type: "text",     max: 100, required: true, langGroup: "fr" },
    { name: "description_fr", label: "Description (FR)",  type: "textarea", max: 500, required: true, langGroup: "fr" },
    // Onglet EN
    { name: "title_en",       label: "Title (EN)",        type: "text",     max: 100, langGroup: "en" },
    { name: "description_en", label: "Description (EN)",  type: "textarea", max: 500, langGroup: "en" },
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
        title="Projets"
        resource="projects"
        fields={fields}
        defaults={{
          category:       categories[0] ?? "Apps",
          imageUrl:       "",
          tags:           [],
          link:           "",
          repo:           "",
          gradient:       ["#0066cc", "#00d4ff"],
          order:          0,
          title_fr:       "",
          description_fr: "",
          title_en:       "",
          description_en: "",
        }}
      />

      {/* ── Gestion des catégories ── */}
      <div className="space-y-3">
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

        <CategoryManager resource="projects" endpoint="/api/admin/projects/categories" />
      </div>
    </div>
  );
}
