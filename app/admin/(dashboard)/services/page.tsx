import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  { name: "title", label: "Titre", type: "text", max: 100, required: true },
  { name: "icon", label: "Icône", type: "select", options: ["branding", "web", "mobile"], required: true },
  { name: "description", label: "Description", type: "textarea", max: 500, required: true },
  { name: "features", label: "Caractéristiques (séparées par virgules)", type: "tags" },
  { name: "order", label: "Ordre", type: "number" },
];

export default function ServicesAdminPage() {
  return (
    <EntityTable
      title="Services"
      resource="services"
      fields={fields}
      defaults={{ icon: "web", title: "", description: "", features: [], order: 0 }}
    />
  );
}
