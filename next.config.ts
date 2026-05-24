import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const adminSecurityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; " +
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}; ` +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self';",
  },
];

const baseSecurityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/admin/:path*", headers: adminSecurityHeaders },
      { source: "/api/admin/:path*", headers: adminSecurityHeaders },
      { source: "/(.*)", headers: baseSecurityHeaders },
    ];
  },
};

export default nextConfig;
