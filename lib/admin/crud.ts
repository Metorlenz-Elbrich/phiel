/**
 * Factory CRUD pour les API routes admin.
 * - auth() vérifié dans chaque handler (OWASP A01 — défense en profondeur).
 * - Zod sur les payloads (OWASP A03).
 * - Erreurs génériques (OWASP A05).
 * - Audit log (OWASP A09).
 */

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import type { Model } from "mongoose";
import type { ZodTypeAny, z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { apiError, unauthorized } from "@/lib/api-error";
import { securityLog, getClientIp } from "@/lib/security-log";
import { ObjectIdSchema } from "@/lib/validation";

type AnyModel = Model<unknown>;

export function createCollectionHandlers<S extends ZodTypeAny>(
  resource: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ModelRef: AnyModel | any,
  schema: S
) {
  type Input = z.infer<S>;

  async function GET() {
    try {
      const session = await auth();
      if (!session?.user) return unauthorized();
      await connectDB();
      const docs = await ModelRef.find({}).sort({ order: 1, createdAt: 1 }).lean();
      return NextResponse.json(docs);
    } catch (err) {
      return apiError(err, { context: `GET /api/admin/${resource}` });
    }
  }

  async function POST(req: Request) {
    try {
      const session = await auth();
      if (!session?.user) return unauthorized();

      const parsed = schema.safeParse(await req.json());
      if (!parsed.success) {
        return NextResponse.json({ error: "Données invalides" }, { status: 400 });
      }

      await connectDB();
      const created = await ModelRef.create(parsed.data as Input);
      securityLog.adminAction({
        userId: session.user.email ?? "admin",
        action: "create",
        resource,
        resourceId: String(created._id),
      });
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      return apiError(err, { context: `POST /api/admin/${resource}` });
    }
  }

  return { GET, POST };
}

export function createItemHandlers<S extends ZodTypeAny>(
  resource: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ModelRef: AnyModel | any,
  schema: S
) {
  async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
      const session = await auth();
      if (!session?.user) return unauthorized();

      const { id } = await ctx.params;
      const idCheck = ObjectIdSchema.safeParse(id);
      if (!idCheck.success) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 });
      }

      const parsed = schema.safeParse(await req.json());
      if (!parsed.success) {
        return NextResponse.json({ error: "Données invalides" }, { status: 400 });
      }

      await connectDB();
      const updated = await ModelRef.findByIdAndUpdate(id, parsed.data, {
        new: true,
        runValidators: true,
      }).lean();
      if (!updated) {
        return NextResponse.json({ error: "Introuvable" }, { status: 404 });
      }
      securityLog.adminAction({
        userId: session.user.email ?? "admin",
        action: "update",
        resource,
        resourceId: id,
      });
      return NextResponse.json(updated);
    } catch (err) {
      return apiError(err, { context: `PUT /api/admin/${resource}/[id]` });
    }
  }

  async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
      const session = await auth();
      if (!session?.user) {
        securityLog.accessDenied({
          ip: getClientIp(req),
          path: `/api/admin/${resource}`,
        });
        return unauthorized();
      }

      const { id } = await ctx.params;
      const idCheck = ObjectIdSchema.safeParse(id);
      if (!idCheck.success) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 });
      }

      await connectDB();
      const deleted = await ModelRef.findByIdAndDelete(id).lean();
      if (!deleted) {
        return NextResponse.json({ error: "Introuvable" }, { status: 404 });
      }
      securityLog.adminAction({
        userId: session.user.email ?? "admin",
        action: "delete",
        resource,
        resourceId: id,
      });
      revalidateTag(`cms:${resource}`, "max");
      return NextResponse.json({ ok: true });
    } catch (err) {
      return apiError(err, { context: `DELETE /api/admin/${resource}/[id]` });
    }
  }

  return { PUT, DELETE };
}
