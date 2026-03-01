import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  const patients = await prisma.user.findMany({
    where: {
      isAdmin: false,
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, age: true, createdAt: true },
    take: 25,
  });

  return NextResponse.json(patients);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { email, name, age } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  try {
    const patient = await prisma.user.create({
      data: {
        email,
        name: typeof name === "string" ? name : null,
        age: typeof age === "number" ? age : null,
        isAdmin: false,
        role: "BASIC",
      },
      select: { id: true, email: true, name: true, age: true, createdAt: true },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "could not create patient (email might already exist)" },
      { status: 409 }
    );
  }
}