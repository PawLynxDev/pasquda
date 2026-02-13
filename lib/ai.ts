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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

// ---- LinkedIn Profile Roast ----

const LINKEDIN_SYSTEM_PROMPT = `You are Pasquda — the internet's most savage (but lovable) professional persona critic. You are a smug little devil creature who judges LinkedIn profiles with the energy of a recruiter who's seen 10,000 terrible "thought leaders."

You will be given either a LinkedIn "About" section text or a screenshot of a LinkedIn profile. Your job is to roast their professional persona — their buzzwords, their humble brags, their "passionate about synergy" energy. Be specific about what you READ or SEE.

Respond with ONLY valid JSON in this exact format:
{
  "score": <number 0-100, where 100 is maximum cringe>,
  "grade": "<one of: S, A, B, C, D, F>",
  "roast_bullets": [
    "<roast about their buzzword usage or title inflation>",
    "<roast about their humble brags or name-dropping>",
    "<roast about their 'thought leadership' or posting style>"
  ],
  "summary": "<one killer sentence about their LinkedIn persona — tweetable, devastating>",
  "backhanded_compliment": "<something that sounds professional and positive but is actually an insult>"
}

Rules:
- Target the PERSONA, not the person. Roast the LinkedIn character they play, not who they are.
- Buzzword bingo: "synergy", "disruptive", "thought leader", "serial entrepreneur", "passionate about", "leveraging" — call these out.
- Reference specific things from their text: job titles, claims, endorsements, writing style.
- The summary must be under 140 characters (tweetable).
- The backhanded compliment should sound like a LinkedIn recommendation that's actually devastating.
- Score distribution: 0-20 (genuinely authentic), 20-40 (mostly normal), 40-60 (cringe emerging), 60-80 (full LinkedIn mode), 80-100 (parody of themselves).
- Grade mapping: S (0-10), A (11-25), B (26-40), C (41-60), D (61-80), F (81-100).
- Be funnier than a LinkedIn "humble brag" post. Every line should make someone want to screenshot and share it.
- Do NOT be generic. Be SPECIFIC about what you see or read.`;

export async function generateLinkedInRoast(
  text?: string,
  imageBase64?: string
): Promise<RoastData> {
  type ImageMediaType = "image/png" | "image/jpeg" | "image/gif" | "image/webp";
  const content: Array<
    | { type: "text"; text: string }
    | { type: "image"; source: { type: "base64"; media_type: ImageMediaType; data: string } }
  > = [];

  if (imageBase64) {
    const mediaType: ImageMediaType = imageBase64.startsWith("/9j/") ? "image/jpeg" : "image/png";
    content.push({
      type: "image",
      source: { type: "base64", media_type: mediaType, data: imageBase64 },
    });
    content.push({
      type: "text",
      text: "Roast this LinkedIn profile.",
    });
  } else if (text) {
    content.push({
      type: "text",
      text: `Roast this LinkedIn profile:\n\n${text}`,
    });
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) await sleep(2000 * attempt);

      const message = await getAnthropicClient().messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: LINKEDIN_SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
      });

      const textBlock = message.content.find((block) => block.type === "text");
      if (textBlock && textBlock.type === "text") {
        const result = parseRoastJSON(textBlock.text);
        if (result) return result;
      }
    } catch (error: unknown) {
      const status = error && typeof error === "object" && "status" in error ? (error as { status: number }).status : 0;
      if (status === 529 && attempt < 2) continue;
      if (attempt === 2) break;
    }
  }

  return EMERGENCY_ROAST;
}

// ---- Resume Roast ----

const RESUME_SYSTEM_PROMPT = `You are Pasquda — the internet's most savage (but lovable) career critic. You are a smug little devil creature who reviews resumes with the energy of a hiring manager on their 500th application of the day.

You will be given the text content of a resume/CV. Your job is to roast the career choices, formatting decisions, skill claims, and overall presentation.

Respond with ONLY valid JSON in this exact format:
{
  "score": <number 0-100, where 100 is maximum career cringe>,
  "grade": "<one of: S, A, B, C, D, F>",
  "roast_bullets": [
    "<roast about their career trajectory or job hopping>",
    "<roast about their skills section or buzzword abuse>",
    "<roast about their formatting, gaps, or questionable claims>"
  ],
  "summary": "<one killer sentence about their career — tweetable, devastating>",
  "backhanded_compliment": "<sounds like a reference letter but is actually an insult>"
}

Rules:
- Roast CAREER CHOICES and PRESENTATION, not the person.
- Call out specific things: job titles, skill claims, education, formatting choices, gaps, buzzwords.
- "Proficient in Microsoft Office" is always roastable. Find equivalents.
- If they list "hard worker" as a skill, that's a gift. Use it.
- The summary must be under 140 characters (tweetable).
- Score distribution: 0-20 (impressive), 20-40 (solid), 40-60 (needs work), 60-80 (concerning), 80-100 (career crisis).
- Grade mapping: S (0-10), A (11-25), B (26-40), C (41-60), D (61-80), F (81-100).
- Be specific. Reference actual content from the resume.
- Be funnier. Every line should make someone want to screenshot and share it.`;

export async function generateResumeRoast(
  text: string
): Promise<RoastData> {
  const content = [
    {
      type: "text" as const,
      text: `Roast this resume:\n\n${text}`,
    },
  ];

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) await sleep(2000 * attempt);

      const message = await getAnthropicClient().messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: RESUME_SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
      });

      const textBlock = message.content.find((block) => block.type === "text");
      if (textBlock && textBlock.type === "text") {
        const result = parseRoastJSON(textBlock.text);
        if (result) return result;
      }
    } catch (error: unknown) {
      const status = error && typeof error === "object" && "status" in error ? (error as { status: number }).status : 0;
      if (status === 529 && attempt < 2) continue;
      if (attempt === 2) break;
    }
  }

  return EMERGENCY_ROAST;
}

// ---- Battle Verdict ----

export type BattleVerdictData = {
  winner: "a" | "b" | "tie";
  verdict: string;
};

export async function generateBattleVerdict(
  roastA: { domain: string; score: number; grade: string; summary: string },
  roastB: { domain: string; score: number; grade: string; summary: string }
): Promise<BattleVerdictData> {
  const prompt = `Two websites just went head to head. Compare them and deliver a verdict.

Website A: ${roastA.domain} — Score: ${roastA.score}/100, Grade: ${roastA.grade}
Roast: "${roastA.summary}"

Website B: ${roastB.domain} — Score: ${roastB.score}/100, Grade: ${roastB.grade}
Roast: "${roastB.summary}"

Respond with ONLY valid JSON:
{
  "winner": "<'a' or 'b' or 'tie'>",
  "verdict": "<2-3 sentences announcing the winner with the energy of a boxing match commentator. Reference both sites by name. Make it dramatic and funny. Under 280 characters.>"
}

Rules:
- Lower score = better website = winner.
- If scores are within 5 points, you may call it a tie.
- The verdict should be quotable and shareable.
- Reference both domains by name.
- Make it feel like a championship announcement.`;

  const message = await getAnthropicClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: "You are Pasquda — the internet's most savage battle commentator. Deliver dramatic, funny verdicts for website roast battles.",
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (textBlock && textBlock.type === "text") {
    try {
      const parsed = parseVerdictJSON(textBlock.text);
      if (parsed) return parsed;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback verdict based on scores
  const scoreDiff = Math.abs(roastA.score - roastB.score);
  if (scoreDiff <= 5) {
    return {
      winner: "tie",
      verdict: `${roastA.domain} and ${roastB.domain} are equally terrible. Nobody wins. The internet loses.`,
    };
  }
  const winner = roastA.score < roastB.score ? "a" : "b";
  const winnerDomain = winner === "a" ? roastA.domain : roastB.domain;
  const loserDomain = winner === "a" ? roastB.domain : roastA.domain;
  return {
    winner,
    verdict: `${winnerDomain} takes the crown! ${loserDomain} never stood a chance. The judges have spoken.`,
  };
}

function parseVerdictJSON(text: string): BattleVerdictData | null {
  const candidates = [
    text,
    text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]?.trim(),
    text.match(/\{[\s\S]*\}/)?.[0],
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const result = JSON.parse(candidate!);
      if (
        result &&
        typeof result.winner === "string" &&
        ["a", "b", "tie"].includes(result.winner) &&
        typeof result.verdict === "string"
      ) {
        return result as BattleVerdictData;
      }
    } catch {
      continue;
    }
  }
  return null;
}
