import { type NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
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

  // Extract the pathname from the full blob URL
  const url = new URL(test.resultUrl);
  const pathname = url.pathname.slice(1); // remove leading slash

  const result = await get(pathname, { access: "private" });

  if (result?.statusCode !== 200) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType ?? "application/pdf",
      "Content-Disposition": `inline; filename="${test.resultName ?? "result.pdf"}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}