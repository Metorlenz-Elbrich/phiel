import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdmin = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api");

  // ── Mode maintenance : MAINTENANCE_MODE=true dans les variables d'environnement ──
  // Le site public affiche /maintenance (HTTP 503). L'admin et l'API restent accessibles.
  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !isAdmin &&
    !isApi &&
    !pathname.startsWith("/maintenance")
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    url.search = "";
    const res = NextResponse.rewrite(url, { status: 503 });
    res.headers.set("Retry-After", "3600");
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Tout ce qui n'est pas /admin passe tel quel
  if (!isAdmin) return NextResponse.next();

  // Login page est toujours publique
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const isProd = process.env.NODE_ENV === "production";
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: isProd
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Tout sauf les fichiers statiques de Next et les assets de /public
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|txt|xml)$).*)",
  ],
};
