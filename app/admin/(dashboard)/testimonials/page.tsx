"use client";

import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  // Champs sans langGroup : toujours visibles
  { name: "order", label: "Ordre", type: "number" },
  // Onglet FR
  { name: "name_fr",  label: "Nom (FR)",      type: "text",     max: 80,  required: true, langGroup: "fr" },
  { name: "role_fr",  label: "Rôle (FR)",     type: "text",     max: 120, required: true, langGroup: "fr" },
  { name: "quote_fr", label: "Citation (FR)", type: "textarea", max: 800, required: true, langGroup: "fr" },
  // Onglet EN
  { name: "name_en",  label: "Name (EN)",     type: "text",     max: 80,  langGroup: "en" },
  { name: "role_en",  label: "Role (EN)",     type: "text",     max: 120, langGroup: "en" },
  { name: "quote_en", label: "Quote (EN)",    type: "textarea", max: 800, langGroup: "en" },
];

export default function TestimonialsAdminPage() {
  return (
    <EntityTable
      title="Témoignages"
      resource="testimonials"
      fields={fields}
      defaults={{
        order:    0,
        name_fr:  "",
        role_fr:  "",
        quote_fr: "",
        name_en:  "",
        role_en:  "",
        quote_en: "",
      }}
    />
  );
}
