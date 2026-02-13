import { NextRequest, NextResponse } from "next/server";
import { getBattle, getRoast } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const battle = await getBattle(id);

  if (!battle) {
    return NextResponse.json({ error: "Battle not found" }, { status: 404 });
  }

  const [roastA, roastB] = await Promise.all([
    getRoast(battle.roast_a),
    getRoast(battle.roast_b),
  ]);

  return NextResponse.json(
    { battle, roast_a: roastA, roast_b: roastB },
    {
      headers: {
        "Cache-Control":
          battle.status === "completed"
            ? "public, s-maxage=3600, stale-while-revalidate=86400"
            : "no-cache",
      },
    }
  );
}
