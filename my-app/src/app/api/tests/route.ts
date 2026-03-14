import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { patientId, walkinName, name, testedDay, location, testCode } = body;

    // Must have either a registered patient or a walk-in name
    if (!patientId && !walkinName) {
      return NextResponse.json(
        { error: "either patientId or walkinName is required" },
        { status: 400 }
      );
    }

    if (!testedDay || typeof testedDay !== "string") {
      return NextResponse.json({ error: "testedDay is required" }, { status: 400 });
    }

    const d = new Date(testedDay);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "testedDay must be a valid date string" }, { status: 400 });
    }

    if (!testCode || typeof testCode !== "string" || testCode.length !== 8 || !/^\d{8}$/.test(testCode)) {
      return NextResponse.json({ error: "testCode must be exactly 8 digits" }, { status: 400 });
    }

    // Check testCode not already taken
    const existing = await prisma.test.findUnique({ where: { testCode } });
    if (existing) {
      return NextResponse.json({ error: "testCode already in use" }, { status: 409 });
    }

    const created = await prisma.test.create({
      data: {
        name: typeof name === "string" && name ? name : "Анализ",
        testCode,
        testedDay: d,
        location: typeof location === "string" ? location : null,
        status: "CURRENT",
        ...(patientId ? { patientId } : {}),
        ...(walkinName ? { walkinName } : {}),
      },
      select: { id: true, testCode: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/tests failed:", e);
    return NextResponse.json(
      { error: e?.message || "internal error", code: e?.code || null },
      { status: 500 }
    );
  }
}