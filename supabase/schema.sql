-- ── AI Models Tracker — Supabase Schema ──────────────────────────────────────
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS models (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company     text        NOT NULL,
  country     text        NOT NULL DEFAULT 'Unknown',
  model       text        NOT NULL,
  category    text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  year        text        NOT NULL DEFAULT '',
  open_source text        NOT NULL DEFAULT 'Unknown',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  -- Prevent duplicate (company, model) pairs
  UNIQUE (company, model)
);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON models;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for common filters
CREATE INDEX IF NOT EXISTS idx_models_category ON models (category);
CREATE INDEX IF NOT EXISTS idx_models_country  ON models (country);
CREATE INDEX IF NOT EXISTS idx_models_company  ON models (company);
CREATE INDEX IF NOT EXISTS idx_models_year     ON models (year DESC);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public read-only app)
CREATE POLICY "Public read access"
  ON models FOR SELECT
  USING (true);

-- Only the service role (server-side API routes) can write
CREATE POLICY "Service role write access"
  ON models FOR ALL
  USING (auth.role() = 'service_role');
