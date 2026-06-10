import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const oldTests = await prisma.test.findMany({
    where: {
      uploadedAt: { lt: thirtyDaysAgo },
      resultUrl: { not: null },
    },
    select: { id: true, resultUrl: true },
  });

  let deleted = 0;
  let failed = 0;

  for (const test of oldTests) {
    try {
      await del(test.resultUrl!);
      await prisma.test.update({
        where: { id: test.id },
        data: {
          resultUrl: null,
          resultName: null,
          uploadedAt: null,
        },
      });
      deleted++;
    } catch (e) {
      console.error(`Failed to clean up test ${test.id}:`, e);
      failed++;
    }
  }

  return NextResponse.json({ deleted, failed, checkedAt: new Date().toISOString() });
}
