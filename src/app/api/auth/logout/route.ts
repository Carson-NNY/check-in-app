import { NextResponse } from "next/server";
import { serialize } from "cookie";

// API route to handle logout
export async function GET() {
  const res = NextResponse.json({ success: true });

  res.headers.set(
    "Set-Cookie",
    serialize("momath_checkin_auth", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0), // Expire the cookie immediately
    })
  );

  return res;
}
