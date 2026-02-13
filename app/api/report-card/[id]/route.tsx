import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getRoast } from "@/lib/supabase";
import { FullReportCard } from "@/lib/generate-image";

export const runtime = "edge";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const roast = await getRoast(id);
  if (!roast || roast.status !== "completed") {
    return new Response("Not found", { status: 404 });
  }

  const interBold = await fetch(
    new URL("../../../../public/fonts/Inter-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const jetbrainsBold = await fetch(
    new URL(
      "../../../../public/fonts/JetBrainsMono-Bold.ttf",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(<FullReportCard roast={roast} />, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: interBold, weight: 700 },
      { name: "JetBrains Mono", data: jetbrainsBold, weight: 700 },
    ],
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Disposition": `inline; filename="pasquda-report-card.png"`,
    },
  });
}
