"use client";

import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  // Champs sans langGroup : toujours visibles
  { name: "linkedin", label: "LinkedIn", type: "url" },
  { name: "order",    label: "Ordre",    type: "number" },
  // Onglet FR
  { name: "name_fr", label: "Nom (FR)",  type: "text",     max: 80,  required: true, langGroup: "fr" },
  { name: "role_fr", label: "Rôle (FR)", type: "text",     max: 120, required: true, langGroup: "fr" },
  { name: "bio_fr",  label: "Bio (FR)",  type: "textarea", max: 600, required: true, langGroup: "fr" },
  // Onglet EN
  { name: "name_en", label: "Name (EN)", type: "text",     max: 80,  langGroup: "en" },
  { name: "role_en", label: "Role (EN)", type: "text",     max: 120, langGroup: "en" },
  { name: "bio_en",  label: "Bio (EN)",  type: "textarea", max: 600, langGroup: "en" },
];

export default function TeamAdminPage() {
  return (
    <EntityTable
      title="Équipe"
      resource="team"
      fields={fields}
      defaults={{
        linkedin: "",
        order:    0,
        name_fr:  "",
        role_fr:  "",
        bio_fr:   "",
        name_en:  "",
        role_en:  "",
        bio_en:   "",
      }}
    />
  );
}
