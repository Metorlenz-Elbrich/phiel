"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function onSeed() {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      const entries = Object.entries(body.results ?? {});
      setResult(
        entries.length === 0
          ? "Aucune collection à initialiser (déjà peuplées)."
          : "Importé : " + entries.map(([k, v]) => `${k}=${v}`).join(", ")
      );
      router.refresh();
    } else {
      setResult(body.error ?? "Échec du seed.");
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onSeed}
        disabled={loading}
        className="rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        style={{ background: "linear-gradient(135deg,#0066cc,#00d4ff)" }}
      >
        {loading ? "Initialisation..." : "Initialiser depuis data.ts"}
      </button>
      {result && <p className="text-sm text-white/70">{result}</p>}
    </div>
  );
}
