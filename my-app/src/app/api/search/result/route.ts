import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code || !/^\d{8}$/.test(code)) {
    return NextResponse.json({ error: "Invalid test code" }, { status: 400 });
  }

  const test = await prisma.test.findUnique({
    where: { testCode: code },
    select: { resultUrl: true, resultName: true },
  });

  if (!test) {
    return NextResponse.json({ error: "No test found" }, { status: 404 });
  }

  if (!test.resultUrl) {
    return NextResponse.json({ error: "Result not yet available" }, { status: 404 });
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