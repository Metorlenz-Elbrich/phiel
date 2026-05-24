import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", max: 80, required: true },
  { name: "role", label: "Rôle", type: "text", max: 120, required: true },
  { name: "bio", label: "Bio", type: "textarea", max: 600, required: true },
  { name: "linkedin", label: "LinkedIn", type: "url" },
  { name: "order", label: "Ordre", type: "number" },
];

export default function TeamAdminPage() {
  return (
    <EntityTable
      title="Équipe"
      resource="team"
      fields={fields}
      defaults={{ name: "", role: "", bio: "", linkedin: "", order: 0 }}
    />
  );
}
