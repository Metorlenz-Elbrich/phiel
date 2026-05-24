/**
 * Security logging — OWASP A09 (Logging & Monitoring Failures).
 *
 * Règles :
 * - Jamais logger mots de passe, tokens, sessions, données perso.
 * - En dev : console.warn. En prod : remplacer par un service externe
 *   (Sentry, Datadog, Logtail, etc.) en éditant `emit()` ci-dessous.
 */

type LogLevel = "warn" | "info" | "error";

type SecurityEvent =
  | { type: "login_failed"; ip: string; email?: string }
  | { type: "login_blocked"; ip: string; reason: string }
  | { type: "access_denied"; ip: string; path: string; userId?: string }
  | {
      type: "admin_action";
      userId: string;
      action: "create" | "update" | "delete";
      resource: string;
      resourceId?: string;
    }
  | { type: "rate_limit_hit"; ip: string; path: string };

function emit(level: LogLevel, event: SecurityEvent) {
  const payload = { ts: new Date().toISOString(), level, ...event };
  if (level === "error") console.error("[security]", payload);
  else if (level === "warn") console.warn("[security]", payload);
  else console.log("[security]", payload);
}

export const securityLog = {
  loginFailed(params: { ip: string; email?: string }) {
    emit("warn", { type: "login_failed", ...params });
  },
  loginBlocked(params: { ip: string; reason: string }) {
    emit("warn", { type: "login_blocked", ...params });
  },
  accessDenied(params: { ip: string; path: string; userId?: string }) {
    emit("warn", { type: "access_denied", ...params });
  },
  adminAction(params: {
    userId: string;
    action: "create" | "update" | "delete";
    resource: string;
    resourceId?: string;
  }) {
    emit("info", { type: "admin_action", ...params });
  },
  rateLimitHit(params: { ip: string; path: string }) {
    emit("warn", { type: "rate_limit_hit", ...params });
  },
};

/**
 * Helper : extraire l'IP cliente d'une Request Next.js.
 */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
