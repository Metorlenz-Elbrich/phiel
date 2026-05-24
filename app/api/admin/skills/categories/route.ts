/**
 * PATCH /api/admin/skills/categories — renommer une catégorie (batch update)
 * DELETE /api/admin/skills/categories?name=X — supprimer tous les skills d'une catégorie
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Skill } from "@/lib/models/Skill";
import { unauthorized, apiError } from "@/lib/api-error";
import { securityLog } from "@/lib/security-log";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return unauthorized();

    const body = await req.json();
    const from = String(body?.from ?? "").trim();
    const to   = String(body?.to   ?? "").trim();
    if (!from || !to) {
      return NextResponse.json({ error: "Champs 'from' et 'to' requis" }, { status: 400 });
    }

    await connectDB();
    const result = await Skill.updateMany({ category: from }, { $set: { category: to } });

    securityLog.adminAction({
      userId: session.user.email ?? "admin",
      action: "update",
      resource: "skill-categories",
    });
    return NextResponse.json({ ok: true, modified: result.modifiedCount });
  } catch (err) {
    return apiError(err, { context: "PATCH /api/admin/skills/categories" });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return unauthorized();

    const name = req.nextUrl.searchParams.get("name")?.trim();
    if (!name) {
      return NextResponse.json({ error: "Paramètre 'name' requis" }, { status: 400 });
    }

    await connectDB();
    const result = await Skill.deleteMany({ category: name });

    securityLog.adminAction({
      userId: session.user.email ?? "admin",
      action: "delete",
      resource: "skill-categories",
    });
    return NextResponse.json({ ok: true, deleted: result.deletedCount });
  } catch (err) {
    return apiError(err, { context: "DELETE /api/admin/skills/categories" });
  }
}
