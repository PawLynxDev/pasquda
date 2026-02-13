-- =============================================
-- PASQUDA — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Create the roasts table
CREATE TABLE roasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  screenshot_url TEXT,
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  grade VARCHAR(2) NOT NULL DEFAULT '-',
  roast_bullets JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT NOT NULL DEFAULT '',
  backhanded_compliment TEXT NOT NULL DEFAULT '',
  report_card_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  share_count INTEGER DEFAULT 0,
  challenge_from UUID REFERENCES roasts(id)
);

-- 2. Create the counters table
CREATE TABLE counters (
  key VARCHAR(50) PRIMARY KEY,
  value INTEGER DEFAULT 0
);
INSERT INTO counters (key, value) VALUES ('total_roasts', 0);

-- 3. RPC function to increment counter
CREATE OR REPLACE FUNCTION increment_counter(counter_key TEXT)
RETURNS void AS $$
BEGIN
  UPDATE counters SET value = value + 1 WHERE key = counter_key;
END;
$$ LANGUAGE plpgsql;

-- 4. RPC function to increment share count
CREATE OR REPLACE FUNCTION increment_share_count(roast_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE roasts SET share_count = share_count + 1 WHERE id = roast_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Enable RLS on roasts (public read, server-only write)
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON roasts FOR SELECT USING (true);

-- 6. Create storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true);

-- 7. Storage policy: public read
CREATE POLICY "Public read screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'screenshots');

-- 8. Storage policy: service role write
CREATE POLICY "Service role upload screenshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'screenshots');

-- 9. Indexes for performance
CREATE INDEX idx_roasts_created_at ON roasts(created_at DESC);
CREATE INDEX idx_roasts_domain ON roasts(domain);
CREATE INDEX idx_roasts_status ON roasts(status);
