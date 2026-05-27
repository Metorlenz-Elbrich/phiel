/**
 * GET /api/slides — route publique (sans auth).
 * Renvoie les slides triés par order pour le hero-slider.
 */

import { NextResponse } from "next/server";
import { tryConnectDB } from "@/lib/mongodb";
import { Slide } from "@/lib/models/Slide";

export async function GET() {
  try {
    const db = await tryConnectDB();
    if (!db) return NextResponse.json({ slides: [] });
    const slides = await Slide.find({}).sort({ order: 1 }).lean();
    return NextResponse.json({ slides });
  } catch {
    return NextResponse.json({ slides: [] });
  }
}
