import { NextRequest, NextResponse } from "next/server";
import { upsertEmail, updateRoastEmail } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, roast_id } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const { token } = await upsertEmail(email.trim().toLowerCase());

    // Associate email with roast if provided
    if (roast_id && typeof roast_id === "string") {
      await updateRoastEmail(roast_id, email.trim().toLowerCase());
    }

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Email capture error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
