import { EntityTable, type FieldConfig } from "../_components/entity-table";
import { CategoryManager } from "../_components/category-manager";

const DEVICON_OPTIONS = [
  { value: "html5",       label: "HTML5" },
  { value: "css3",        label: "CSS3" },
  { value: "javascript",  label: "JavaScript" },
  { value: "typescript",  label: "TypeScript" },
  { value: "react",       label: "React" },
  { value: "nextjs",      label: "Next.js" },
  { value: "nodejs",      label: "Node.js" },
  { value: "php",         label: "PHP" },
  { value: "laravel",     label: "Laravel" },
  { value: "flutter",     label: "Flutter" },
  { value: "kotlin",      label: "Kotlin" },
  { value: "figma",       label: "Figma" },
  { value: "photoshop",   label: "Photoshop" },
  { value: "mongodb",     label: "MongoDB" },
  { value: "mysql",       label: "MySQL" },
  { value: "git",         label: "Git" },
];

const fields: FieldConfig[] = [
  { name: "name",     label: "Nom",              type: "text",    max: 80,  required: true },
  { name: "category", label: "Catégorie",        type: "text",    max: 60,  required: true },
  { name: "level",    label: "Niveau (0–100)",   type: "number",            required: true },
  { name: "devicon",  label: "Icône Devicon",    type: "devicon", deviconOptions: DEVICON_OPTIONS },
  { name: "order",    label: "Ordre",            type: "number" },
];

export default function SkillsAdminPage() {
  return (
    <div className="space-y-8">
      <EntityTable
        title="Compétences"
        resource="skills"
        fields={fields}
        defaults={{ name: "", category: "Front-end", level: 80, devicon: "", order: 0 }}
      />
      <CategoryManager
        resource="skills"
        endpoint="/api/admin/skills/categories"
      />
    </div>
  );
}
