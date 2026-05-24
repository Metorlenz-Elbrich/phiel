"use client";

import { useEffect, useState } from "react";

type CategoryEntry = { name: string; count: number };

export function CategoryManager({
  resource,
  endpoint,
}: {
  resource: string;
  endpoint: string;
}) {
  const [categories, setCategories] = useState<CategoryEntry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [renaming, setRenaming]     = useState<string | null>(null);
  const [renameVal, setRenameVal]   = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${resource}`);
      if (!res.ok) throw new Error();
      const docs = (await res.json()) as Record<string, unknown>[];
      const counts = new Map<string, number>();
      for (const doc of docs) {
        const cat = String(doc.category ?? "").trim();
        if (cat) counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
      setCategories(
        Array.from(counts.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([name, count]) => ({ name, count }))
      );
    } catch {
      setError("Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [resource]);

  async function handleRename(from: string) {
    const to = renameVal.trim();
    if (!to || to === from) { setRenaming(null); return; }
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to }),
    });
    if (res.ok) { setRenaming(null); load(); }
    else alert("Renommage échoué.");
  }

  async function handleDelete(name: string, count: number) {
    if (!confirm(`Supprimer la catégorie "${name}" ?\n${count} élément(s) seront supprimés définitivement.`)) return;
    const res = await fetch(`${endpoint}?name=${encodeURIComponent(name)}`, { method: "DELETE" });
    if (res.ok) load();
    else alert("Suppression échouée.");
  }

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ borderColor: "rgba(0,212,255,0.12)", background: "rgba(255,255,255,0.02)" }}
    >
      <h2 className="text-lg font-semibold mb-4">Gestion des catégories</h2>

      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

      {loading ? (
        <p className="text-sm text-white/50">Chargement…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-white/50">Aucune catégorie trouvée.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.name}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {renaming === cat.name ? (
                <>
                  <input
                    value={renameVal}
                    autoFocus
                    onChange={(e) => setRenameVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(cat.name);
                      if (e.key === "Escape") setRenaming(null);
                    }}
                    className="flex-1 rounded border bg-black/30 px-2 py-1 text-sm outline-none focus:border-[#00d4ff]"
                    style={{ borderColor: "rgba(255,255,255,0.12)" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRename(cat.name)}
                    className="rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRenaming(null)}
                    className="rounded-full border px-3 py-1 text-xs text-white/60"
                    style={{ borderColor: "rgba(255,255,255,0.18)" }}
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium">{cat.name}</span>
                  <span className="text-xs text-white/40">
                    {cat.count} élément{cat.count > 1 ? "s" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setRenaming(cat.name); setRenameVal(cat.name); }}
                    className="rounded-full border px-3 py-1 text-xs text-white/70 hover:text-[#00d4ff] hover:border-[#00d4ff] transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.18)" }}
                  >
                    Renommer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.name, cat.count)}
                    className="rounded-full border px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    style={{ borderColor: "rgba(248,113,113,0.4)" }}
                  >
                    Supprimer
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
