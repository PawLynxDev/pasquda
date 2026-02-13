import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getRoast } from "@/lib/supabase";
import { FullReportCard } from "@/lib/generate-image";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const roast = await getRoast(id);
  if (!roast || roast.status !== "completed") {
    return new Response("Not found", { status: 404 });
  }

  const fontsDir = join(process.cwd(), "public", "fonts");
  const interBold = (await readFile(join(fontsDir, "Inter-Bold.ttf"))).buffer;
  const jetbrainsBold = (await readFile(join(fontsDir, "JetBrainsMono-Bold.ttf"))).buffer;

  const typeLabel = roast.roast_type === "linkedin" ? "linkedin" : roast.roast_type === "resume" ? "resume" : roast.domain;

  return new ImageResponse(<FullReportCard roast={roast} />, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: interBold, weight: 700 },
      { name: "JetBrains Mono", data: jetbrainsBold, weight: 700 },
    ],
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Disposition": `inline; filename="pasquda-${typeLabel}-report-card.png"`,
    },
  });
}
