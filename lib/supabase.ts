import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { RoastResult } from "./utils";

// Lazy-initialized Supabase client (avoids build errors when env vars are not set)
let _supabaseAdmin: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }

  _supabaseAdmin = createClient(url, key);
  return _supabaseAdmin;
}

export async function createPendingRoast(data: {
  url: string;
  domain: string;
  challenge_from?: string | null;
}): Promise<string> {
  const { data: row, error } = await db()
    .from("roasts")
    .insert({
      url: data.url,
      domain: data.domain,
      status: "processing",
      score: 0,
      grade: "-",
      roast_bullets: [],
      summary: "",
      backhanded_compliment: "",
      challenge_from: data.challenge_from || null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id;
}

export async function completeRoast(
  id: string,
  data: {
    screenshot_url: string;
    score: number;
    grade: string;
    roast_bullets: string[];
    summary: string;
    backhanded_compliment: string;
  }
): Promise<void> {
  const { error } = await db()
    .from("roasts")
    .update({
      ...data,
      status: "completed",
    })
    .eq("id", id);

  if (error) throw error;

  // Increment total roasts counter
  await db().rpc("increment_counter", {
    counter_key: "total_roasts",
  });
}

export async function failRoast(
  id: string,
  errorMessage?: string
): Promise<void> {
  const { error } = await db()
    .from("roasts")
    .update({
      status: "failed",
      summary:
        errorMessage || "Something went wrong. Even Pasquda has bad days.",
    })
    .eq("id", id);

  if (error) throw error;
}

export async function getRoast(id: string): Promise<RoastResult | null> {
  const { data, error } = await db()
    .from("roasts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as RoastResult;
}

export async function getTotalRoasts(): Promise<number> {
  const { data } = await db()
    .from("counters")
    .select("value")
    .eq("key", "total_roasts")
    .single();

  return data?.value ?? 0;
}

export async function incrementShareCount(id: string): Promise<void> {
  await db().rpc("increment_share_count", { roast_id: id });
}

export async function uploadScreenshot(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const { error } = await db().storage
    .from("screenshots")
    .upload(filename, buffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) throw error;

  const { data: urlData } = db().storage
    .from("screenshots")
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

export async function getRecentRoasts(
  limit = 10
): Promise<{ domain: string; score: number; grade: string }[]> {
  const { data } = await db()
    .from("roasts")
    .select("domain, score, grade")
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function findRecentScreenshot(
  domain: string
): Promise<string | null> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data } = await db()
    .from("roasts")
    .select("screenshot_url")
    .eq("domain", domain)
    .eq("status", "completed")
    .gte("created_at", oneHourAgo)
    .not("screenshot_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data?.screenshot_url || null;
}
