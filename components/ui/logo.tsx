"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  height?: number;
  priority?: boolean;
  forceDark?: boolean;
  className?: string;
}

export function Logo({ height = 40, forceDark = false, className }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ height, width: height * 3.5 }} />;

  // forceDark = true quand on est sur le slider (fond toujours sombre)
  const isDark = forceDark || resolvedTheme === "dark";

  const src = isDark
    ? "/phibrain-logo.png"
    : "/phibrain-logo-light-transparent.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="PhiBrain"
      className={className}
      style={{
        height: `${height}px`,
        width: "auto",
        objectFit: "contain",
        flexShrink: 0,
        display: "block",
      }}
    />
  );
}

export default Logo;
