-- Groundwork: The Sunday Table Database Schema
-- Compatible with PostgreSQL / Neon (Vercel Postgres)
-- Matches Section 12 ("Architecture and backend") of the build specification.

CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  family_name TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  rent NUMERIC(10, 4) DEFAULT 0,
  basis_pct NUMERIC(5, 4) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Keep',
  tag TEXT NOT NULL DEFAULT 'Assumed',
  source_url TEXT,
  note TEXT
);

CREATE TABLE IF NOT EXISTS people (
  id SERIAL PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  priority TEXT NOT NULL,
  wish_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  moves JSONB NOT NULL DEFAULT '[]'::jsonb,
  outputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  label TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'Anika',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS decisions (
  id SERIAL PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  chosen BOOLEAN NOT NULL DEFAULT TRUE,
  rationale TEXT,
  next_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sources (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT,
  tag TEXT NOT NULL,
  limitation TEXT
);

-- Seed initial Mehta Family case
INSERT INTO cases (id, family_name, inputs)
VALUES (
  'mehta',
  'Mehta Family',
  '{
    "meetingDate": "2026-11-01",
    "plantNeed": 40.0,
    "liquid": 80.0,
    "reserve": 30.0,
    "offerPrice": 15.0,
    "negotiationPct": 0.0
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seed assets for Mehta case
INSERT INTO assets (case_id, key, name, value, rent, basis_pct, status, tag, note)
VALUES
  ('mehta', 'malabar', 'Malabar Hill 5BHK', 47.0, 0, 0, 'Keep', 'Assumed', 'Self-occupied family home'),
  ('mehta', 'worli', 'Worli 3BHK', 15.0, 0.375, 0, 'Keep', 'Assumed', 'Rented out 1985 building'),
  ('mehta', 'bkc', 'BKC office floor', 47.0, 4.02, 0.25, 'Keep', 'Assumed', 'Leased to bank until May 2028'),
  ('mehta', 'alibaug', 'Alibaug bungalow', 8.0, 0, 0.40, 'Keep', 'Assumed', 'Kihim villa, 4 weekends/year'),
  ('mehta', 'thane', 'Thane 2BHK × 2', 3.0, 0, 0, 'Keep', 'Assumed', 'Delayed possession')
ON CONFLICT DO NOTHING;

-- Seed people
INSERT INTO people (case_id, key, name, priority, wish_text)
VALUES
  ('mehta', 'mr', 'Mr. Mehta', 'Legacy', 'Keep the family''s addresses in the family name.'),
  ('mehta', 'mrs', 'Mrs. Mehta', 'Closeness', 'Keep the children within a short drive in Mumbai.'),
  ('mehta', 'riya', 'Riya', 'Liquidity', 'Fair value now, in cash, not bricks.'),
  ('mehta', 'arjun', 'Arjun', 'Independence', 'A home of his own, close but separate.')
ON CONFLICT DO NOTHING;
