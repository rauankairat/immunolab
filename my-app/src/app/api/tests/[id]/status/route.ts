import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { TestStatus } from "@/app/generated/prisma";

const ALLOWED = ["UPCOMING", "CURRENT", "PAST"] as const;
type Allowed = (typeof ALLOWED)[number];

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const status = body?.status as Allowed;

  if (!status || !ALLOWED.includes(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const updated = await prisma.test.update({
    where: { id },
    data: { status: status as TestStatus },
    select: { id: true, status: true },
  });

  return NextResponse.json(updated);
}