import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

async function requireOwner() {
  const session = await getServerSession();
  if (!session?.user) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  return user?.role === "OWNER" ? session : null;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireOwner()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const { role } = await req.json();
  const updated = await prisma.user.update({
    where: { id },
    data: { role: role === "OWNER" ? "OWNER" : "ADMIN", isAdmin: true },
    select: { role: true },
  });
  return NextResponse.json({ role: updated.role as string });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireOwner()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await prisma.user.update({
    where: { id },
    data: { role: "BASIC", isAdmin: false },
  });
  return NextResponse.json({ success: true });
}