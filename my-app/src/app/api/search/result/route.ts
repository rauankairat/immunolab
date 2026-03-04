import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code || !/^\d{10}$/.test(code)) {
    return NextResponse.json({ error: "Invalid test code" }, { status: 400 });
  }

  const test = await prisma.test.findUnique({
    where: { testCode: code },
    select: { resultUrl: true },
  });

  if (!test) {
    return NextResponse.json({ error: "No test found" }, { status: 404 });
  }

  if (!test.resultUrl) {
    return NextResponse.json({ error: "Result not yet available" }, { status: 404 });
  }

  return NextResponse.redirect(test.resultUrl);
}