import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getBattle, getRoast } from "@/lib/supabase";
import { BattleOGCard } from "@/lib/generate-image";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const battle = await getBattle(id);
  if (!battle || battle.status !== "completed") {
    return new Response("Not found", { status: 404 });
  }

  const [roastA, roastB] = await Promise.all([
    getRoast(battle.roast_a),
    getRoast(battle.roast_b),
  ]);

  if (!roastA || !roastB) {
    return new Response("Not found", { status: 404 });
  }

  const fontsDir = join(process.cwd(), "public", "fonts");
  const interBold = (await readFile(join(fontsDir, "Inter-Bold.ttf"))).buffer;
  const jetbrainsBold = (await readFile(join(fontsDir, "JetBrainsMono-Bold.ttf"))).buffer;

  return new ImageResponse(
    <BattleOGCard roastA={roastA} roastB={roastB} battle={battle} />,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: interBold, weight: 700 },
        { name: "JetBrains Mono", data: jetbrainsBold, weight: 700 },
      ],
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "Content-Disposition": `inline; filename="pasquda-battle-${roastA.domain}-vs-${roastB.domain}.png"`,
      },
    }
  );
}
