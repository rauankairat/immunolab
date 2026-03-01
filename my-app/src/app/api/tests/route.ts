import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { patientId, name, testedDay, location } = body;

    if (!patientId || typeof patientId !== "string") {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!testedDay || typeof testedDay !== "string") {
      return NextResponse.json({ error: "testedDay is required" }, { status: 400 });
    }

    const d = new Date(testedDay);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "testedDay must be a valid date string" }, { status: 400 });
    }

    const created = await prisma.test.create({
      data: {
        patientId,
        name,
        testedDay: d,
        location: typeof location === "string" ? location : null,
        status: "CURRENT", // or "UPCOMING" depending on your flow
      },
      select: { id: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    // This is what you need to paste back to me if it still fails
    console.error("POST /api/tests failed:", e);

    // Return readable error to the client (helpful during dev)
    return NextResponse.json(
      { error: e?.message || "internal error", code: e?.code || null },
      { status: 500 }
    );
  }
}