import { NextRequest, NextResponse } from "next/server";

const SUPPORTED = ["en", "ru", "kz"];

export async function POST(req: NextRequest) {
  const { locale } = await req.json();

  if (!SUPPORTED.includes(locale)) {
    return NextResponse.json({ error: "unsupported locale" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
res.cookies.set("NEXT_LOCALE", locale, {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
});

  return res;
}