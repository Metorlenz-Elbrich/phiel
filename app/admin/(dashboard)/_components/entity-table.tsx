"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LangTabs } from "./lang-tabs";

export type IconOption    = { value: string; label: string; emoji: string };
export type DeviconOption = { value: string; label: string };

export type FieldConfig = {
  name:    string;
  label:   string;
  type:    "text" | "textarea" | "number" | "select" | "tags" | "url" | "color" | "icon-picker" | "devicon" | "image-url";
  options?:        string[];
  iconOptions?:    IconOption[];
  deviconOptions?: DeviconOption[];
  max?:      number;
  required?: boolean;
  /** Restreint ce champ à l'onglet FR ou EN dans le formulaire bilingue. */
  langGroup?: "fr" | "en";
};

type Doc = Record<string, unknown> & { _id: string };

export function EntityTable({
  title,
  resource,
  fields,
  defaults,
}: {
  title:    string;
  resource: string;
  fields:   FieldConfig[];
  defaults: Record<string, unknown>;
}) {
  const [items,   setItems]   = useState<Doc[]>([]);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${resource}`);
      if (!res.ok) throw new Error("load failed");
      setItems(await res.json());
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  async function onDelete(id: string) {
    if (!confirm("Supprimer cet élément ?")) return;
    const res = await fetch(`/api/admin/${resource}/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else alert("Suppression refusée.");
  }

  // Pour les colonnes du tableau, on n'affiche que les champs FR (ou sans groupe).
  const previewFields = fields.filter((f) => f.langGroup !== "en").slice(0, 3);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <button
          type="button"
          onClick={() => { setEditing(null); setCreating(true); }}
          className="rounded-full px-4 py-2 text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}
        >
          + Ajouter
        </button>
      </header>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {(creating || editing) && (
        <EntityForm
          fields={fields}
          initial={editing ?? defaults}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onSubmit={async (data) => {
            const url    = editing ? `/api/admin/${resource}/${editing._id}` : `/api/admin/${resource}`;
            const method = editing ? "PUT" : "POST";
            const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              alert(body.error ?? "Échec de l'enregistrement.");
              return;
            }
            setCreating(false);
            setEditing(null);
            load();
          }}
        />
      )}

      {loading ? (
        <p className="text-sm text-white/50">Chargement...</p>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(0,212,255,0.12)" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "rgba(0,212,255,0.08)" }}>
              <tr>
                {previewFields.map((f) => (
                  <th key={f.name} className="px-4 py-3 text-left font-medium">{f.label}</th>
                ))}
                <th className="px-4 py-3 text-right" />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={previewFields.length + 1} className="px-4 py-6 text-center text-white/50">
                    Aucun élément.
                  </td>
                </tr>
              )}
              {items.map((it) => (
                <tr key={it._id} className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {previewFields.map((f) => (
                    <td key={f.name} className="px-4 py-3 align-top">
                      <Cell value={it[f.name]} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => { setCreating(false); setEditing(it); }}
                      className="mr-2 rounded-full border px-3 py-1 text-xs text-white/80 hover:text-[#00d4ff] hover:border-[#00d4ff]"
                      style={{ borderColor: "rgba(255,255,255,0.18)" }}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(it._id)}
                      className="rounded-full border px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                      style={{ borderColor: "rgba(248,113,113,0.4)" }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Cell({ value }: { value: unknown }): ReactNode {
  if (value == null) return <span className="text-white/30">—</span>;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string" && value.length > 80) return value.slice(0, 80) + "…";
  return String(value);
}

function EntityForm({
  fields,
  initial,
  onSubmit,
  onCancel,
}: {
  fields:   FieldConfig[];
  initial:  Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [data,       setData]       = useState<Record<string, unknown>>(() => ({ ...initial }));
  const [submitting, setSubmitting] = useState(false);
  const [activeLang, setActiveLang] = useState<"fr" | "en">("fr");

  const hasBilingual = fields.some((f) => f.langGroup != null);

  function setField(name: string, value: unknown) {
    setData((d) => ({ ...d, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {};
      // Toujours inclure TOUS les champs dans le payload (même ceux de l'onglet non actif)
      for (const f of fields) {
        const raw = data[f.name];
        if (f.type === "tags") {
          payload[f.name] = typeof raw === "string"
            ? raw.split(",").map((s) => s.trim()).filter(Boolean)
            : (raw ?? []);
        } else if (f.type === "number") {
          payload[f.name] = raw === "" || raw == null ? 0 : Number(raw);
        } else {
          payload[f.name] = raw ?? "";
        }
      }
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  // Champs visibles selon l'onglet actif
  const visibleFields = hasBilingual
    ? fields.filter((f) => !f.langGroup || f.langGroup === activeLang)
    : fields;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border p-6 space-y-4"
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(0,212,255,0.18)" }}
    >
      {hasBilingual && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50 uppercase tracking-wider">Contenu</span>
          <LangTabs active={activeLang} onChange={setActiveLang} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {visibleFields.map((f) => (
          <label
            key={f.name}
            className={
              f.type === "textarea" || f.type === "icon-picker" || f.type === "image-url"
                ? "md:col-span-2 block"
                : "block"
            }
          >
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/70">
              {f.label}
            </span>

            {f.type === "textarea" ? (
              <textarea
                value={String(data[f.name] ?? "")}
                onChange={(e) => setField(f.name, e.target.value)}
                maxLength={f.max}
                rows={3}
                required={f.required}
                className="w-full rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              />
            ) : f.type === "select" ? (
              <select
                value={String(data[f.name] ?? "")}
                onChange={(e) => setField(f.name, e.target.value)}
                required={f.required}
                className="w-full rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              >
                <option value="">—</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : f.type === "tags" ? (
              <input
                type="text"
                value={
                  Array.isArray(data[f.name])
                    ? (data[f.name] as string[]).join(", ")
                    : String(data[f.name] ?? "")
                }
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder="ex: Next.js, React, Tailwind"
                className="w-full rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              />
            ) : f.type === "icon-picker" ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {(f.iconOptions ?? []).map((opt) => {
                  const selected = data[f.name] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setField(f.name, opt.value)}
                      className="flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-xs transition-all"
                      style={{
                        borderColor: selected ? "#00d4ff" : "rgba(255,255,255,0.12)",
                        background:  selected ? "rgba(0,212,255,0.12)" : "rgba(0,0,0,0.2)",
                        boxShadow:   selected ? "0 0 8px rgba(0,212,255,0.3)" : "none",
                        color:       selected ? "#00d4ff" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>{opt.emoji}</span>
                      <span style={{ fontSize: "10px", textAlign: "center", maxWidth: "64px" }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : f.type === "devicon" ? (
              <div className="flex items-center gap-3">
                <select
                  value={String(data[f.name] ?? "")}
                  onChange={(e) => setField(f.name, e.target.value)}
                  className="flex-1 rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
                  style={{ borderColor: "rgba(255,255,255,0.12)" }}
                >
                  <option value="">— aucune —</option>
                  {(f.deviconOptions ?? []).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {!!data[f.name] && (
                  <i
                    className={`devicon-${String(data[f.name])}-plain colored`}
                    style={{ fontSize: "28px", flexShrink: 0 }}
                  />
                )}
              </div>
            ) : f.type === "image-url" ? (
              <div className="space-y-2">
                <input
                  type="url"
                  value={String(data[f.name] ?? "")}
                  onChange={(e) => setField(f.name, e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
                  style={{ borderColor: "rgba(255,255,255,0.12)" }}
                />
                {!!(data[f.name] && String(data[f.name]).startsWith("http")) && (
                  <img
                    src={String(data[f.name])}
                    alt="preview"
                    style={{ height: "60px", borderRadius: "8px", objectFit: "cover" }}
                  />
                )}
              </div>
            ) : (
              <input
                type={
                  f.type === "number" ? "number"
                  : f.type === "url"   ? "url"
                  : f.type === "color" ? "color"
                  : "text"
                }
                value={String(data[f.name] ?? "")}
                onChange={(e) => setField(f.name, e.target.value)}
                maxLength={f.max}
                required={f.required}
                className="w-full rounded-lg border bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#00d4ff]"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              />
            )}
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border px-4 py-2 text-sm text-white/80"
          style={{ borderColor: "rgba(255,255,255,0.18)" }}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}
        >
          {submitting ? "..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
