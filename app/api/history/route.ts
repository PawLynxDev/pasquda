import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken, getRoastsByEmail } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const token = request.nextUrl.searchParams.get("token");
  const limitParam = request.nextUrl.searchParams.get("limit");
  const offsetParam = request.nextUrl.searchParams.get("offset");

  if (!email || !token) {
    return NextResponse.json(
      { error: "Email and token are required." },
      { status: 400 }
    );
  }

  const valid = await verifyEmailToken(email, token);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }

  const limit = Math.min(parseInt(limitParam || "20", 10), 50);
  const offset = parseInt(offsetParam || "0", 10);

  const roasts = await getRoastsByEmail(email, limit, offset);

  return NextResponse.json({ roasts });
}
