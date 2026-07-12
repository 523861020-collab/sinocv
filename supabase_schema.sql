-- Run this in Supabase SQL Editor to create the contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  country TEXT DEFAULT '',
  company TEXT DEFAULT '',
  product TEXT DEFAULT '',
  category TEXT DEFAULT '',
  owner TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  orders JSONB DEFAULT '[]'::jsonb,
  pis JSONB DEFAULT '[]'::jsonb,
  next_follow_up TEXT DEFAULT NULL,
  first_seen TEXT DEFAULT '',
  updated_at TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_owner ON contacts(owner);
