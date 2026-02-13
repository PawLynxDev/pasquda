import { NextRequest, NextResponse } from "next/server";
import { getRoast } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const roast = await getRoast(id);

  if (!roast) {
    return NextResponse.json(
      {
        error:
          "This roast doesn't exist. Maybe the website was so bad we deleted the evidence.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(roast, {
    headers: {
      "Cache-Control":
        roast.status === "completed"
          ? "public, s-maxage=3600, stale-while-revalidate=86400"
          : "no-cache",
    },
  });
}
