import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ verified: false });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  });

  if (!user?.emailVerified) {
    return NextResponse.json({ verified: false });
  }

  // Also check if session exists (auto sign in completed)
  const session = await getServerSession();

  return NextResponse.json({
    verified: true,
    hasSession: !!session?.user,
  });
}