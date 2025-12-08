// src/utils/supabase/client-only.ts
import { createBrowserClient } from '@supabase/ssr';

export const createClientOnly = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );