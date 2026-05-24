import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login page est toujours publique
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  // API auth est toujours publique  
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

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
  matcher: ["/admin/:path*"],
};