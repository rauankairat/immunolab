import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const patients = await prisma.user.findMany({
    where: { isAdmin: false },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, age: true, createdAt: true },
  });

  return NextResponse.json(patients);
}

export async function POST(req: Request) {
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
  } catch (e: any) {
    // common: unique email violation
    return NextResponse.json(
      { error: "could not create patient (email might already exist)" },
      { status: 409 }
    );
  }
}
