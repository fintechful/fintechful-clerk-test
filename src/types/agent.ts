// src/types/agent.ts
export type Agent = {
  clerk_user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  tagline: string | null;
  bio: string | null;
  smb_count: number;
  total_commission: number;
};