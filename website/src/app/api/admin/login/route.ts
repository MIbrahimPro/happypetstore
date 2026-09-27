import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASS, ADMIN_USER, SESSION_COOKIE, makeToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, makeToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }
  return NextResponse.json({ error: "Wrong username or password" }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
