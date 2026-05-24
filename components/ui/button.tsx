"use client";

import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-phi-gradient text-white shadow-[0_8px_30px_-12px_rgba(0,212,255,0.55)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-[color:var(--surface)] text-foreground border border-[color:var(--border)] hover:border-phi-cyan/60 hover:text-phi-cyan",
  ghost:
    "bg-transparent text-foreground hover:bg-[color:var(--surface-muted)]",
  outline:
    "bg-transparent text-foreground border border-[color:var(--border-strong)] hover:border-phi-cyan hover:text-phi-cyan",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight " +
  "focus-visible:outline-2 focus-visible:outline-phi-cyan focus-visible:outline-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

type CommonProps = { variant?: Variant; size?: Size; children: ReactNode; className?: string };

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | AnchorProps>(
  function Button({ variant = "primary", size = "md", className, children, ...props }, ref) {
    const cls = cn(base, variants[variant], sizes[size], className);
    if ((props as AnchorProps).as === "a") {
      const { as: _as, ...rest } = props as AnchorProps;
      void _as;
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...rest}>
          {children}
        </a>
      );
    }
    const { as: _as, ...rest } = props as ButtonProps;
    void _as;
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...rest}>
        {children}
      </button>
    );
  }
);
