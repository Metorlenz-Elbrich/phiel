import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", max: 80, required: true },
  { name: "role", label: "Rôle", type: "text", max: 120, required: true },
  { name: "quote", label: "Citation", type: "textarea", max: 800, required: true },
  { name: "order", label: "Ordre", type: "number" },
];

export default function TestimonialsAdminPage() {
  return (
    <EntityTable
      title="Témoignages"
      resource="testimonials"
      fields={fields}
      defaults={{ name: "", role: "", quote: "", order: 0 }}
    />
  );
}
