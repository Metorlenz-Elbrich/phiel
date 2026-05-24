/**
 * Generic API error handling — OWASP A05 (Misconfiguration).
 * En prod : jamais de stack au client, toujours `{ error: "Une erreur..." }`.
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

const GENERIC_MESSAGE = "Une erreur est survenue";

export function apiError(
  err: unknown,
  opts: { status?: number; context?: string } = {}
): NextResponse {
  const { status = 500, context } = opts;
  console.error(`[api-error]${context ? ` ${context}` : ""}`, err);
  if (err instanceof ZodError) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  return NextResponse.json({ error: GENERIC_MESSAGE }, { status });
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
}
