import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  interactive = false,
  ...rest
}: { children: ReactNode; interactive?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "surface-card relative overflow-hidden p-6 transition",
        interactive &&
          "hover:-translate-y-1 hover:border-phi-cyan/60 hover:shadow-[0_24px_60px_-24px_rgba(0,212,255,0.45)] group",
        className
      )}
    >
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-phi-gradient-soft"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
