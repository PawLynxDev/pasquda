import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getRoast } from "@/lib/supabase";
import { OGReportCard, LinkedInOGCard, ResumeOGCard } from "@/lib/generate-image";

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

  let card;
  switch (roast.roast_type) {
    case "linkedin":
      card = <LinkedInOGCard roast={roast} />;
      break;
    case "resume":
      card = <ResumeOGCard roast={roast} />;
      break;
    default:
      card = <OGReportCard roast={roast} />;
  }

  return new ImageResponse(card, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: interBold, weight: 700 },
      { name: "JetBrains Mono", data: jetbrainsBold, weight: 700 },
    ],
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
