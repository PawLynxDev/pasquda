-- =============================================
-- PASQUDA — Phase 2 Migration
-- Run this in your Supabase SQL Editor
-- (For existing Phase 1 databases)
-- =============================================

-- 1. Add new columns to roasts table
ALTER TABLE roasts ADD COLUMN roast_type VARCHAR(20) NOT NULL DEFAULT 'website';
ALTER TABLE roasts ADD COLUMN content_text TEXT;
ALTER TABLE roasts ADD COLUMN content_file_url TEXT;
ALTER TABLE roasts ADD COLUMN email VARCHAR(255);

-- 2. Add indexes for new columns
CREATE INDEX idx_roasts_email ON roasts(email) WHERE email IS NOT NULL;
CREATE INDEX idx_roasts_type ON roasts(roast_type);

-- 3. Create battles table
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

CREATE INDEX idx_battles_created_at ON battles(created_at DESC);
CREATE INDEX idx_battles_status ON battles(status);

-- 4. Create emails table
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  token VARCHAR(64) UNIQUE
);

CREATE INDEX idx_emails_email ON emails(email);
CREATE INDEX idx_emails_token ON emails(token);

-- 5. RLS for battles (public read)
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read battles" ON battles FOR SELECT USING (true);

-- 6. RLS for emails (service role only)
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manage emails" ON emails USING (true);

-- 7. RPC function to increment battle share count
CREATE OR REPLACE FUNCTION increment_battle_share_count(battle_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE battles SET share_count = share_count + 1 WHERE id = battle_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Create uploads storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- 9. Storage policies for uploads bucket
CREATE POLICY "Public read uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Service role upload to uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads');
