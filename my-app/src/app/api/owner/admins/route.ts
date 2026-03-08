import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

async function requireOwner() {
  const session = await getServerSession();
  if (!session?.user) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  return user?.role === "OWNER" ? session : null;
}

export async function POST(req: Request) {
  if (!await requireOwner()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { email, role } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found. They must register first." }, { status: 404 });

  const updated = await prisma.user.update({
    where: { email },
    data: { role: role === "OWNER" ? "OWNER" : "ADMIN", isAdmin: true },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user: { ...updated, role: updated.role as string, createdAt: updated.createdAt.toISOString() } });
}