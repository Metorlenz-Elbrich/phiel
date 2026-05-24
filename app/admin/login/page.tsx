"use client";

import { useState, type FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lire l'erreur depuis l'URL (NextAuth redirige avec ?error=...)
  const urlError = searchParams.get("error");

  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(
    urlError ? "Identifiants incorrects." : null
  );
  const [loading, setLoading]   = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      setLoading(false);

      // Cas d'erreur — res peut être undefined en cas d'exception réseau
      if (!res || !res.ok) {
        const code = res?.error ?? "unknown";

        if (code.toLowerCase().includes("rate")) {
          setError("Trop de tentatives. Réessayez dans 1 minute.");
        } else if (code.toLowerCase().includes("attempts")) {
          setError("Identifiants incorrects — encore 2 tentatives avant blocage.");
        } else {
          setError("Identifiants incorrects.");
        }
        return;
      }

      // Succès
      router.push(callbackUrl);
      router.refresh();

    } catch {
      setLoading(false);
      setError("Une erreur est survenue. Réessayez.");
    }
  }

  return (
    <div
      className="min-h-screen grid place-items-center px-4"
      style={{ background: "#050810", color: "#fff" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-8"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(0,212,255,0.18)",
          boxShadow: "0 24px 60px -24px rgba(0,102,204,0.45)",
        }}
      >
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 h-2 w-12 rounded-full"
            style={{ background: "linear-gradient(90deg,#0066cc,#00d4ff)" }}
          />
          <h1 className="text-2xl font-semibold">PhiBrain Admin</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">
            Connexion sécurisée
          </p>
        </div>

        {/* Message d'erreur — toujours visible si présent */}
        {error && (
          <div
            className="mb-4 rounded-xl px-4 py-3 text-sm"
            role="alert"
            aria-live="assertive"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.35)",
              color: "#fca5a5",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#00d4ff]"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70">
              Mot de passe
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#00d4ff]"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg,#0066cc,#00d4ff)",
              boxShadow: "0 8px 30px -12px rgba(0,212,255,0.55)",
            }}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Suspense boundary requis par Next.js pour useSearchParams
export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen grid place-items-center"
        style={{ background: "#050810" }}>
        <div style={{ color: "rgba(0,212,255,0.5)", fontSize: "14px" }}>
          Chargement...
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
