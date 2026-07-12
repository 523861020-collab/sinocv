import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseKey) : null;

// Helper to safely get supabase or throw
export function getSupabase() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}
