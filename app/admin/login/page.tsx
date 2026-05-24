"use client";

import { Suspense, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (!res?.ok) {
      setError("Email ou mot de passe incorrect");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
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
              className="w-full rounded-xl border bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#00d4ff]"
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
              className="w-full rounded-xl border bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#00d4ff]"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            />
          </label>

          {error && (
            <p className="text-xs text-red-400" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg,#0066cc,#00d4ff)",
              boxShadow: "0 8px 30px -12px rgba(0,212,255,0.55)",
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
