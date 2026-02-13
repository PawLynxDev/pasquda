import { NextRequest, NextResponse, after } from "next/server";
import { validateUrl, extractDomain } from "@/lib/utils";
import {
  createPendingRoast,
  createBattle,
  completeBattle,
  failBattle,
  getRoast,
} from "@/lib/supabase";
import { processWebsiteRoast } from "@/lib/roast-processor";
import { generateBattleVerdict } from "@/lib/ai";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url_a: rawUrlA, url_b: rawUrlB } = body;

    // Validate both URLs
    const validationA = validateUrl(rawUrlA);
    if (!validationA.valid) {
      return NextResponse.json(
        { error: `Site A: ${validationA.error}` },
        { status: 400 }
      );
    }

    const validationB = validateUrl(rawUrlB);
    if (!validationB.valid) {
      return NextResponse.json(
        { error: `Site B: ${validationB.error}` },
        { status: 400 }
      );
    }

    const urlA = validationA.url;
    const urlB = validationB.url;
    const domainA = extractDomain(urlA);
    const domainB = extractDomain(urlB);

    // Create two pending roasts
    const [roastAId, roastBId] = await Promise.all([
      createPendingRoast({ url: urlA, domain: domainA, roast_type: "website" }),
      createPendingRoast({ url: urlB, domain: domainB, roast_type: "website" }),
    ]);

    // Create pending battle
    const battleId = await createBattle(roastAId, roastBId);

    // Background processing
    after(async () => {
      try {
        // Process both roasts in parallel
        await Promise.all([
          processWebsiteRoast(roastAId, urlA, domainA),
          processWebsiteRoast(roastBId, urlB, domainB),
        ]);

        // Fetch completed roasts
        const [roastA, roastB] = await Promise.all([
          getRoast(roastAId),
          getRoast(roastBId),
        ]);

        if (
          !roastA ||
          !roastB ||
          roastA.status !== "completed" ||
          roastB.status !== "completed"
        ) {
          await failBattle(
            battleId,
            "One or both websites were too broken to roast. That's saying something."
          );
          return;
        }

        // Generate verdict
        const verdict = await generateBattleVerdict(
          {
            domain: domainA,
            score: roastA.score,
            grade: roastA.grade,
            summary: roastA.summary,
          },
          {
            domain: domainB,
            score: roastB.score,
            grade: roastB.grade,
            summary: roastB.summary,
          }
        );

        const winnerId =
          verdict.winner === "a"
            ? roastAId
            : verdict.winner === "b"
              ? roastBId
              : null;

        await completeBattle(battleId, {
          winner_id: winnerId,
          verdict: verdict.verdict,
        });
      } catch (error) {
        console.error("Battle processing error:", error);
        await failBattle(battleId, "The battle imploded. Both websites survive... for now.");
      }
    });

    return NextResponse.json({ id: battleId });
  } catch (error) {
    console.error("Battle API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Even Pasquda has bad days." },
      { status: 500 }
    );
  }
}
