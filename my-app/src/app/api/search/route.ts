import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const dob = req.nextUrl.searchParams.get("dob");

  if (!code || !/^\d{8}$/.test(code)) {
    return NextResponse.json({ error: "Invalid test code" }, { status: 400 });
  }

  const test = await prisma.test.findUnique({
    where: { testCode: code },
    select: {
      id: true,
      testCode: true,
      name: true,
      testedDay: true,
      status: true,
      location: true,
      resultUrl: true,
      resultName: true,
      walkinName: true,
      dob: true,
      patient: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!test) {
    return NextResponse.json({ error: "No test found" }, { status: 404 });
  }

  // If DOB is stored, verify it
  if (test.dob) {
    if (!dob) {
      // DOB required but not provided yet — tell client to ask for it
      return NextResponse.json({ requiresDob: true });
    }
    if (dob !== test.dob) {
      return NextResponse.json({ error: "Incorrect date of birth" }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: "Temporarly restricted" }, { status: 404 });
  }

  const patientName = test.patient?.name ?? test.walkinName ?? "Unknown Patient";

  return NextResponse.json({
    test: {
      id: test.id,
      testCode: test.testCode,
      name: test.name,
      testDate: test.testedDay,
      status: test.status,
      location: test.location,
      resultUrl: test.resultUrl,
      resultName: test.resultName,
      patientName,
    },
  });
}