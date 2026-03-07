import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const { name, location, status } = body;

  try {
    const updated = await prisma.test.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(status ? { status } : {}),
      },
      select: { id: true, name: true, location: true, status: true },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "test not found" }, { status: 404 });
    }
    return NextResponse.json({ error: e?.message || "internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  try {
    await prisma.test.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "test not found" }, { status: 404 });
    }
    return NextResponse.json({ error: e?.message || "internal error" }, { status: 500 });
  }
}