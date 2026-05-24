import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  { name: "title", label: "Titre", type: "text", max: 100, required: true },
  { name: "category", label: "Catégorie", type: "select", options: ["Apps", "Design", "Sites"], required: true },
  { name: "description", label: "Description", type: "textarea", max: 500, required: true },
  { name: "tags", label: "Tags (séparés par virgules)", type: "tags" },
  { name: "link", label: "Lien externe", type: "url" },
  { name: "repo", label: "Repo Git", type: "url" },
  { name: "order", label: "Ordre", type: "number" },
];

export default function ProjectsAdminPage() {
  return (
    <EntityTable
      title="Projets"
      resource="projects"
      fields={fields}
      defaults={{
        title: "",
        category: "Apps",
        description: "",
        tags: [],
        link: "",
        repo: "",
        gradient: ["#0066cc", "#00d4ff"],
        order: 0,
      }}
    />
  );
}
