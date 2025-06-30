import { NextResponse } from "next/server";
import { serialize } from "cookie";

const PASSWORD = process.env.MOMATH_CHECKIN_PASSWORD;
const COOKIE_NAME = "momath_checkin_auth";

// API route to handle login
export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookie = serialize(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 6, // 6 hours
    sameSite: "lax",
  });

  const res = NextResponse.json({ success: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
