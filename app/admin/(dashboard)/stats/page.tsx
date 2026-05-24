"use client";

import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  // Champs sans langGroup : toujours visibles
  { name: "value",  label: "Valeur",          type: "number", required: true },
  { name: "suffix", label: "Suffixe (ex: +)", type: "text",   max: 8 },
  { name: "icon",   label: "Icône",           type: "text",   max: 32 },
  { name: "color",  label: "Couleur",         type: "color" },
  { name: "order",  label: "Ordre",           type: "number" },
  // Onglet FR
  { name: "label_fr", label: "Libellé (FR)", type: "text", max: 80, required: true, langGroup: "fr" },
  // Onglet EN
  { name: "label_en", label: "Label (EN)",   type: "text", max: 80,               langGroup: "en" },
];

export default function StatsAdminPage() {
  return (
    <EntityTable
      title="Statistiques"
      resource="stats"
      fields={fields}
      defaults={{
        value:    0,
        suffix:   "+",
        icon:     "sparkle",
        color:    "#00d4ff",
        order:    0,
        label_fr: "",
        label_en: "",
      }}
    />
  );
}
