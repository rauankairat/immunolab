import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  const patient = await prisma.user.findFirst({
    where: { id, isAdmin: false },
    select: { id: true, email: true, name: true, age: true, createdAt: true },
  });

  if (!patient) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json(patient);
}