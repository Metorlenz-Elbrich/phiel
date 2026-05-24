"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border border-[color:var(--border)] bg-[color:var(--surface)]",
        "hover:border-phi-cyan/60 hover:text-phi-cyan",
        "focus-visible:outline-2 focus-visible:outline-phi-cyan focus-visible:outline-offset-2",
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-0 grid place-items-center transition-all duration-500",
          isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        )}
      >
        <Icon name="sun" size={18} />
      </span>
      <span
        className={cn(
          "absolute inset-0 grid place-items-center transition-all duration-500",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        )}
      >
        <Icon name="moon" size={18} />
      </span>
      <span className="sr-only">Basculer le thème</span>
    </button>
  );
}
