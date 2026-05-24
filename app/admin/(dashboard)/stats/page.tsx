import { EntityTable, type FieldConfig } from "../_components/entity-table";

const fields: FieldConfig[] = [
  { name: "label", label: "Libellé", type: "text", max: 80, required: true },
  { name: "value", label: "Valeur", type: "number", required: true },
  { name: "suffix", label: "Suffixe (ex: +)", type: "text", max: 8 },
  { name: "icon", label: "Icône", type: "text", max: 32 },
  { name: "color", label: "Couleur", type: "color" },
  { name: "order", label: "Ordre", type: "number" },
];

export default function StatsAdminPage() {
  return (
    <EntityTable
      title="Statistiques"
      resource="stats"
      fields={fields}
      defaults={{ label: "", value: 0, suffix: "+", icon: "sparkle", color: "#00d4ff", order: 0 }}
    />
  );
}
