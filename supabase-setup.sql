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
  challenge_from UUID REFERENCES roasts(id),
  -- Phase 2 columns
  roast_type VARCHAR(20) NOT NULL DEFAULT 'website',
  content_text TEXT,
  content_file_url TEXT,
  email VARCHAR(255)
);

-- 2. Create the counters table
CREATE TABLE counters (
  key VARCHAR(50) PRIMARY KEY,
  value INTEGER DEFAULT 0
);
INSERT INTO counters (key, value) VALUES ('total_roasts', 0);

-- 3. Create the battles table
CREATE TABLE battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roast_a UUID NOT NULL REFERENCES roasts(id),
  roast_b UUID NOT NULL REFERENCES roasts(id),
  winner_id UUID REFERENCES roasts(id),
  verdict TEXT NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  share_count INTEGER DEFAULT 0
);

-- 4. Create the emails table (lightweight identity for roast history)
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  token VARCHAR(64) UNIQUE
);

-- 5. RPC function to increment counter
CREATE OR REPLACE FUNCTION increment_counter(counter_key TEXT)
RETURNS void AS $$
BEGIN
  UPDATE counters SET value = value + 1 WHERE key = counter_key;
END;
$$ LANGUAGE plpgsql;

-- 6. RPC function to increment share count (roasts)
CREATE OR REPLACE FUNCTION increment_share_count(roast_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE roasts SET share_count = share_count + 1 WHERE id = roast_id;
END;
$$ LANGUAGE plpgsql;

-- 7. RPC function to increment share count (battles)
CREATE OR REPLACE FUNCTION increment_battle_share_count(battle_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE battles SET share_count = share_count + 1 WHERE id = battle_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Enable RLS on roasts (public read, server-only write)
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON roasts FOR SELECT USING (true);

-- 9. Enable RLS on battles (public read, server-only write)
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read battles" ON battles FOR SELECT USING (true);

-- 10. Enable RLS on emails
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manage emails" ON emails USING (true);

-- 11. Create storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true);

-- 12. Create storage bucket for uploads (resumes, LinkedIn screenshots)
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- 13. Storage policies: screenshots
CREATE POLICY "Public read screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'screenshots');
CREATE POLICY "Service role upload screenshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'screenshots');

-- 14. Storage policies: uploads
CREATE POLICY "Public read uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Service role upload to uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads');

-- 15. Indexes for performance
CREATE INDEX idx_roasts_created_at ON roasts(created_at DESC);
CREATE INDEX idx_roasts_domain ON roasts(domain);
CREATE INDEX idx_roasts_status ON roasts(status);
CREATE INDEX idx_roasts_email ON roasts(email) WHERE email IS NOT NULL;
CREATE INDEX idx_roasts_type ON roasts(roast_type);
CREATE INDEX idx_battles_created_at ON battles(created_at DESC);
CREATE INDEX idx_battles_status ON battles(status);
CREATE INDEX idx_emails_email ON emails(email);
CREATE INDEX idx_emails_token ON emails(token);

-- =============================================
-- MIGRATION: Run this if you already have the Phase 1 schema
-- =============================================
-- ALTER TABLE roasts ADD COLUMN roast_type VARCHAR(20) NOT NULL DEFAULT 'website';
-- ALTER TABLE roasts ADD COLUMN content_text TEXT;
-- ALTER TABLE roasts ADD COLUMN content_file_url TEXT;
-- ALTER TABLE roasts ADD COLUMN email VARCHAR(255);
-- CREATE INDEX idx_roasts_email ON roasts(email) WHERE email IS NOT NULL;
-- CREATE INDEX idx_roasts_type ON roasts(roast_type);
-- Then run the battles table, emails table, uploads bucket, and their RLS/indexes from above.
-- Or use the dedicated migration file: supabase-migration-phase2.sql
