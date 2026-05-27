"use client";

import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  // Champ sans langGroup : toujours visible
  { name: "order",    label: "Ordre",           type: "number" },
  { name: "imageUrl", label: "URL de l'image",  type: "image-url" },
  // Onglet FR
  { name: "phrase_fr", label: "Phrase (FR)", type: "text", max: 300, required: true, langGroup: "fr" },
  // Onglet EN
  { name: "phrase_en", label: "Phrase (EN)", type: "text", max: 300, required: true, langGroup: "en" },
];

export default function SliderAdminPage() {
  return (
    <EntityTable
      title="Slider — Phrases & Images"
      resource="slides"
      fields={fields}
      defaults={{
        order:     0,
        imageUrl:  "",
        phrase_fr: "",
        phrase_en: "",
      }}
    />
  );
}
