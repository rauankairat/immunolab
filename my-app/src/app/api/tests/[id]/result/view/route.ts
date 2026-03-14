import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const test = await prisma.test.findUnique({
    where: { id },
    select: { resultUrl: true, resultName: true },
  });

  if (!test?.resultUrl) {
    return NextResponse.json({ error: "no result found" }, { status: 404 });
  }

  const response = await fetch(test.resultUrl, {
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
    },
  });

  if (!response.ok) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = await response.arrayBuffer();
  const rawName = test.resultName ?? "result.pdf";
const fileName = rawName.replace(/^\d+_/, "");
const safeFileName = encodeURIComponent(fileName);

return new NextResponse(buffer, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename*=UTF-8''${safeFileName}`,
    "Cache-Control": "private, no-cache",
    "Content-Length": buffer.byteLength.toString(),
  },
});
}