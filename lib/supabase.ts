import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { RoastResult, BattleResult, RoastType } from "./utils";

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
  roast_type?: RoastType;
  content_text?: string | null;
  content_file_url?: string | null;
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
      roast_type: data.roast_type || "website",
      content_text: data.content_text || null,
      content_file_url: data.content_file_url || null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id;
}

export async function completeRoast(
  id: string,
  data: {
    screenshot_url: string | null;
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

// ---- Battle functions ----

export async function createBattle(
  roastAId: string,
  roastBId: string
): Promise<string> {
  const { data, error } = await db()
    .from("battles")
    .insert({
      roast_a: roastAId,
      roast_b: roastBId,
      status: "processing",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function completeBattle(
  id: string,
  data: { winner_id: string | null; verdict: string }
): Promise<void> {
  const { error } = await db()
    .from("battles")
    .update({
      ...data,
      status: "completed",
    })
    .eq("id", id);

  if (error) throw error;
}

export async function failBattle(
  id: string,
  errorMessage?: string
): Promise<void> {
  const { error } = await db()
    .from("battles")
    .update({
      status: "failed",
      verdict: errorMessage || "Battle processing failed.",
    })
    .eq("id", id);

  if (error) throw error;
}

export async function getBattle(id: string): Promise<BattleResult | null> {
  const { data, error } = await db()
    .from("battles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as BattleResult;
}

export async function incrementBattleShareCount(id: string): Promise<void> {
  await db().rpc("increment_battle_share_count", { battle_id: id });
}

// ---- Email / History functions ----

export async function upsertEmail(
  email: string
): Promise<{ id: string; token: string }> {
  const token = crypto.randomUUID().replace(/-/g, "").slice(0, 32);

  // Try insert first
  const { data: existing } = await db()
    .from("emails")
    .select("id, token")
    .eq("email", email)
    .single();

  if (existing) {
    return { id: existing.id, token: existing.token };
  }

  const { data, error } = await db()
    .from("emails")
    .insert({ email, token })
    .select("id, token")
    .single();

  if (error) throw error;
  return { id: data.id, token: data.token };
}

export async function verifyEmailToken(
  email: string,
  token: string
): Promise<boolean> {
  const { data } = await db()
    .from("emails")
    .select("id")
    .eq("email", email)
    .eq("token", token)
    .single();

  return !!data;
}

export async function updateRoastEmail(
  roastId: string,
  email: string
): Promise<void> {
  const { error } = await db()
    .from("roasts")
    .update({ email })
    .eq("id", roastId);

  if (error) throw error;
}

export async function getRoastsByEmail(
  email: string,
  limit = 20,
  offset = 0
): Promise<RoastResult[]> {
  const { data } = await db()
    .from("roasts")
    .select("*")
    .eq("email", email)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return (data ?? []) as RoastResult[];
}

// ---- File upload functions ----

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const { error } = await db().storage
    .from("uploads")
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  const { data: urlData } = db().storage
    .from("uploads")
    .getPublicUrl(filename);

  return urlData.publicUrl;
}
