import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json({ error: "only pdf allowed" }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "pdf too large (max 10MB)" },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `tests/${id}/${Date.now()}_${safeName}`;

    const blob = await put(key, file, {
      access: "private", // change later if you want private downloads
      addRandomSuffix: false,
    });

    const updated = await prisma.test.update({
      where: { id },
      data: {
        resultUrl: blob.url,
        resultName: file.name,
        uploadedAt: new Date(),
      },
      select: {
        id: true,
        resultUrl: true,
        resultName: true,
        uploadedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("UPLOAD RESULT FAILED:", e);

    // Prisma "record not found"
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "test not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: "internal server error",
        message: e?.message ?? null,
        code: e?.code ?? null,
      },
      { status: 500 }
    );
  }
}