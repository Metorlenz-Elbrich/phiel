import { EntityTable, type FieldConfig } from "../_components/entity-table";
import { CategoryManager } from "../_components/category-manager";

const fields: FieldConfig[] = [
  { name: "title",       label: "Titre",                        type: "text",      max: 100, required: true },
  { name: "category",    label: "Catégorie",                    type: "text",      max: 60,  required: true },
  { name: "description", label: "Description",                  type: "textarea",  max: 500, required: true },
  { name: "imageUrl",    label: "URL de l'image",               type: "image-url" },
  { name: "tags",        label: "Tags (séparés par virgules)",  type: "tags" },
  { name: "link",        label: "Lien externe",                 type: "url" },
  { name: "repo",        label: "Repo Git",                     type: "url" },
  { name: "order",       label: "Ordre",                        type: "number" },
];

export default function ProjectsAdminPage() {
  return (
    <div className="space-y-8">
      <EntityTable
        title="Projets"
        resource="projects"
        fields={fields}
        defaults={{
          title: "",
          category: "Apps",
          description: "",
          imageUrl: "",
          tags: [],
          link: "",
          repo: "",
          gradient: ["#0066cc", "#00d4ff"],
          order: 0,
        }}
      />
      <CategoryManager
        resource="projects"
        endpoint="/api/admin/projects/categories"
      />
    </div>
  );
}
