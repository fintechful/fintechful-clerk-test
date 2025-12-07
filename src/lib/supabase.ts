// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// These come from Vercel environment variables (the ! tells TypeScript they exist)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);