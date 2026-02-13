import Anthropic from "@anthropic-ai/sdk";

let _anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }
  return _anthropic;
}

const SYSTEM_PROMPT = `You are Pasquda — the internet's most savage (but lovable) website critic. You are a smug little devil creature with a magnifying glass who judges websites with the energy of Simon Cowell reviewing a bad audition.

You will be given a screenshot of a website. Your job is to roast it — analyzing the design, layout, typography, color choices, content, UX, and overall vibe. Be specific about what you SEE in the screenshot.

Respond with ONLY valid JSON in this exact format:
{
  "score": <number 0-100, where 100 is maximum cringe/ugliness>,
  "grade": "<one of: S, A, B, C, D, F>",
  "roast_bullets": [
    "<roast observation 1 — specific, visual, funny>",
    "<roast observation 2 — specific, visual, funny>",
    "<roast observation 3 — specific, visual, funny>"
  ],
  "summary": "<one killer sentence that summarizes the roast — this should be quotable, tweetable, devastating>",
  "backhanded_compliment": "<something that sounds like a compliment but is actually an insult>"
}

Rules:
- BE SPECIFIC. Reference actual elements you see: colors, fonts, layout, images, text content, buttons, whitespace, etc.
- Be witty and clever, not just mean. Think observational comedy, not bullying.
- Use pop culture references, analogies, and metaphors.
- The summary must be under 140 characters (tweetable).
- The backhanded compliment must start positive and end painful.
- Score distribution guide: 0-20 (actually good), 20-40 (decent), 40-60 (mediocre), 60-80 (bad), 80-100 (catastrophically ugly).
- Grade mapping: S (0-10), A (11-25), B (26-40), C (41-60), D (61-80), F (81-100).
- Be funnier. Then be even funnier. Every line should make someone want to screenshot and share it.
- Do NOT be generic. Never say things like "this website needs work." Be SPECIFIC about what you see.`;

export type RoastData = {
  score: number;
  grade: string;
  roast_bullets: string[];
  summary: string;
  backhanded_compliment: string;
};

const EMERGENCY_ROAST: RoastData = {
  score: 50,
  grade: "C",
  roast_bullets: [
    "Your website confused our AI so much it needed a moment.",
    "We tried to roast it, but it roasted our servers first.",
    "The design is... certainly a choice. A bold, confusing choice.",
  ],
  summary:
    "Your website broke our AI. That's either impressive or terrifying.",
  backhanded_compliment:
    "At least your website is memorable — for all the wrong reasons.",
};

function parseRoastJSON(text: string): RoastData | null {
  // Try direct parse
  try {
    const result = JSON.parse(text);
    if (isValidRoast(result)) return result;
  } catch {
    // Continue to regex extraction
  }

  // Try extracting JSON from markdown backticks
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    try {
      const result = JSON.parse(match[1].trim());
      if (isValidRoast(result)) return result;
    } catch {
      // Continue
    }
  }

  // Try finding JSON object pattern in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const result = JSON.parse(jsonMatch[0]);
      if (isValidRoast(result)) return result;
    } catch {
      // Give up
    }
  }

  return null;
}

function isValidRoast(result: unknown): result is RoastData {
  if (!result || typeof result !== "object") return false;
  const r = result as Record<string, unknown>;
  return (
    typeof r.score === "number" &&
    typeof r.grade === "string" &&
    Array.isArray(r.roast_bullets) &&
    r.roast_bullets.length >= 3 &&
    typeof r.summary === "string" &&
    typeof r.backhanded_compliment === "string"
  );
}

async function callClaude(
  url: string,
  screenshotBase64: string
): Promise<RoastData | null> {
  const message = await getAnthropicClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: screenshotBase64,
            },
          },
          {
            type: "text",
            text: `Roast this website: ${url}`,
          },
        ],
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  return parseRoastJSON(textBlock.text);
}

export async function generateRoast(
  url: string,
  screenshotBuffer: Buffer
): Promise<RoastData> {
  const base64 = screenshotBuffer.toString("base64");

  // First attempt
  const result = await callClaude(url, base64);
  if (result) return result;

  // Retry once
  const retry = await callClaude(url, base64);
  if (retry) return retry;

  // Emergency fallback
  return EMERGENCY_ROAST;
}
