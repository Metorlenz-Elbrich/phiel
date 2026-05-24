import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { LoginSchema } from "@/lib/validation";
import { securityLog, getClientIp } from "@/lib/security-log";

/**
 * NextAuth v5 (Auth.js) — OWASP A07 hardening.
 * - bcrypt salt rounds = 12 (hash en mémoire au boot).
 * - JWT session 8 h.
 * - Cookies httpOnly + secure + sameSite=strict.
 * - Erreurs typées via CredentialsSignin — codes exploitables côté client.
 * - Rate limit 5/IP/15min — OWASP A04.
 */

declare module "next-auth" {
  interface Session {
    user: { id: string; email: string } & DefaultSession["user"];
  }
}

const loginLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
  blockDuration: 60,
});

class InvalidCredentials extends CredentialsSignin {
  code = "invalid_credentials";
}
class RateLimited extends CredentialsSignin {
  code = "rate_limited";
}
class AttemptsWarning extends CredentialsSignin {
  code = "attempts_warning";
}

const isProd = process.env.NODE_ENV === "production";

let cachedAdminHash: string | null = null;
async function getAdminPasswordHash(): Promise<string | null> {
  if (cachedAdminHash) return cachedAdminHash;
  const plain = process.env.ADMIN_PASSWORD;
  if (!plain || plain.length < 8) return null;
  cachedAdminHash = await bcrypt.hash(plain, 12);
  return cachedAdminHash;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  jwt: { maxAge: 8 * 60 * 60 },
  cookies: {
    sessionToken: {
      name: isProd ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
      },
    },
  },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(creds, req) {
        const ip = getClientIp(req as unknown as Request);

        try {
          const rateLimitResult = await loginLimiter.consume(ip);
          const remaining = rateLimitResult.remainingPoints;

          // Valider les credentials.
          const parsed = LoginSchema.safeParse(creds);
          if (!parsed.success) {
            securityLog.loginFailed({ ip });
            if (remaining <= 2) throw new AttemptsWarning();
            throw new InvalidCredentials();
          }

          const { email, password } = parsed.data;
          const expectedEmail = process.env.ADMIN_EMAIL;
          const expectedHash = await getAdminPasswordHash();

          if (!expectedEmail || !expectedHash) {
            throw new InvalidCredentials();
          }

          // bcrypt.compare exécuté quel que soit l'email — protection timing.
          const validHash = await bcrypt.compare(password, expectedHash);
          const emailMatch = email.toLowerCase() === expectedEmail.toLowerCase();

          if (!emailMatch || !validHash) {
            securityLog.loginFailed({ ip, email });
            if (remaining <= 2) throw new AttemptsWarning();
            throw new InvalidCredentials();
          }

          return { id: "admin", email };
        } catch (e) {
          // Erreurs custom : on les propage telles quelles.
          if (e instanceof CredentialsSignin) throw e;
          // Sinon c'est le rate limiter (consume rejette) — blocage IP.
          securityLog.loginBlocked({ ip, reason: "rate_limit" });
          throw new RateLimited();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
