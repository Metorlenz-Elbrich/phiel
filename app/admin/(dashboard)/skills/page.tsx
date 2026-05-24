import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", max: 80, required: true },
  { name: "category", label: "Catégorie", type: "select", options: ["Front-end", "Back-end", "Mobile", "Design"], required: true },
  { name: "level", label: "Niveau (0–100)", type: "number", required: true },
  { name: "order", label: "Ordre", type: "number" },
];

export default function SkillsAdminPage() {
  return (
    <EntityTable
      title="Compétences"
      resource="skills"
      fields={fields}
      defaults={{ name: "", category: "Front-end", level: 80, order: 0 }}
    />
  );
}
