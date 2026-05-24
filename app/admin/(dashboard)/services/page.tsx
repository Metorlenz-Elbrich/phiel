import { EntityTable, type FieldConfig } from "../_components/entity-table";

const ICON_OPTIONS = [
  { value: "palette",    label: "Design / Branding", emoji: "🎨" },
  { value: "code",       label: "Développement Web",  emoji: "💻" },
  { value: "smartphone", label: "Mobile",             emoji: "📱" },
  { value: "sparkle",    label: "IA / Innovation",    emoji: "✨" },
  { value: "server",     label: "Back-end / Serveur", emoji: "🖥️" },
  { value: "mail",       label: "Communication",      emoji: "📧" },
];

const fields: FieldConfig[] = [
  { name: "title",    label: "Titre",                                    type: "text",        max: 100, required: true },
  { name: "icon",     label: "Icône",                                    type: "icon-picker", iconOptions: ICON_OPTIONS, required: true },
  { name: "description", label: "Description",                           type: "textarea",    max: 500, required: true },
  { name: "features", label: "Caractéristiques (séparées par virgules)", type: "tags" },
  { name: "order",    label: "Ordre",                                    type: "number" },
];

export default function ServicesAdminPage() {
  return (
    <EntityTable
      title="Services"
      resource="services"
      fields={fields}
      defaults={{ icon: "palette", title: "", description: "", features: [], order: 0 }}
    />
  );
}
