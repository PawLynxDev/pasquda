export type RoastResult = {
  id: string;
  url: string;
  domain: string;
  screenshot_url: string | null;
  score: number;
  grade: string;
  roast_bullets: string[];
  summary: string;
  backhanded_compliment: string;
  report_card_url: string | null;
  status: "processing" | "completed" | "failed";
  created_at: string;
  share_count: number;
  challenge_from: string | null;
};

export function validateUrl(input: string): {
  valid: boolean;
  url: string;
  error?: string;
} {
  if (!input || !input.trim()) {
    return {
      valid: false,
      url: "",
      error: "You forgot to paste a URL. We can't roast thin air... yet.",
    };
  }

  let url = input.trim();

  // Prepend https:// if no protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return {
        valid: false,
        url: "",
        error:
          "Even Pasquda can't roast a URL that doesn't exist. Try a real website.",
      };
    }

    // Basic domain validation
    if (!parsed.hostname.includes(".")) {
      return {
        valid: false,
        url: "",
        error: "That doesn't look like a real website. Did you forget the .com?",
      };
    }

    return { valid: true, url: parsed.toString() };
  } catch {
    return {
      valid: false,
      url: "",
      error:
        "Even Pasquda can't roast a URL that doesn't exist. Try again.",
    };
  }
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getGradeFromScore(score: number): string {
  if (score <= 10) return "S";
  if (score <= 25) return "A";
  if (score <= 40) return "B";
  if (score <= 60) return "C";
  if (score <= 80) return "D";
  return "F";
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    S: "#FFD700",
    A: "#00FF88",
    B: "#4ECDC4",
    C: "#FFE66D",
    D: "#FF6B6B",
    F: "#FF1493",
  };
  return colors[grade] || "#FF1493";
}
