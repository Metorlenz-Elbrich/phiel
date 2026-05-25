"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MigrateButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function onMigrate() {
    if (
      !confirm(
        "Migrer les données ?\n\n" +
        "Cette opération copie les anciens champs (title, name, label…) " +
        "vers les nouveaux champs bilingues (_fr / _en).\n\n" +
        "Seuls les documents sans champs _fr sont touchés — opération idempotente."
      )
    ) return;

    setLoading(true);
    setResult(null);
    setIsError(false);

    const res  = await fetch("/api/admin/migrate", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setLoading(false);

    if (res.ok) {
      const entries = Object.entries(body.migrated ?? {});
      setResult(
        entries.length === 0 || entries.every(([, v]) => v === 0)
          ? "Aucun document à migrer (déjà migrés ou collections vides)."
          : "Migré : " + entries.map(([k, v]) => `${k}=${v}`).join(", ")
      );
      router.refresh();
    } else {
      setIsError(true);
      setResult(body.error ?? "Échec de la migration.");
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onMigrate}
        disabled={loading}
        className="rounded-full border px-5 py-2 text-sm font-semibold text-white/80 disabled:opacity-50 hover:text-[#00d4ff] hover:border-[#00d4ff] transition-colors"
        style={{ borderColor: "rgba(0,212,255,0.35)" }}
      >
        {loading ? "Migration en cours…" : "Migrer les données (anciens → FR/EN)"}
      </button>
      {result && (
        <p className={`text-sm ${isError ? "text-red-400" : "text-white/70"}`}>
          {result}
        </p>
      )}
    </div>
  );
}
