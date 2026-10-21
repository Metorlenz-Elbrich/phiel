"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
import { type ReactNode } from "react";

export function ThemeProvider({
  children,
  ...props
}: { children: ReactNode } & ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="phibrain-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
