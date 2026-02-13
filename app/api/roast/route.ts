import { NextRequest, NextResponse, after } from "next/server";
import { validateUrl, extractDomain } from "@/lib/utils";
import { createPendingRoast } from "@/lib/supabase";
import { processWebsiteRoast } from "@/lib/roast-processor";

// Allow up to 60s for background processing (screenshot + AI)
export const maxDuration = 60;

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "Slow down! Even Pasquda needs a break between roasts. Try again in a bit.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { url: rawUrl, challenge_from } = body;

    // Validate URL
    const validation = validateUrl(rawUrl);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const url = validation.url;
    const domain = extractDomain(url);

    // Create pending roast row and return ID immediately
    const id = await createPendingRoast({
      url,
      domain,
      challenge_from: challenge_from || null,
      roast_type: "website",
    });

    // Run background processing after response is sent (works on Vercel)
    after(async () => {
      await processWebsiteRoast(id, url, domain);
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Roast API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Even Pasquda has bad days." },
      { status: 500 }
    );
  }
}
