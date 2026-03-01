import { type NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const test = await prisma.test.findUnique({
    where: { id },
    select: { resultUrl: true, resultName: true, patientId: true },
  });

  if (!test) {
    return NextResponse.json({ error: "test not found" }, { status: 404 });
  }

  // Patients can only view their own results
  if (test.patientId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (!test.resultUrl) {
    return NextResponse.json({ error: "no result uploaded yet" }, { status: 404 });
  }

  const url = new URL(test.resultUrl);
  const pathname = url.pathname.slice(1);

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