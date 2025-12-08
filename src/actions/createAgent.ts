// src/actions/createAgent.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function createAgent(formData: FormData) {
  const full_name = (formData.get('full_name') as string | null)?.trim();
  const email = (formData.get('email') as string | null)?.trim()?.toLowerCase();

  // Basic required field check
  if (!full_name || !email) {
    return { success: false, error: 'Full name and email are required' };
  }

  // Optional fields
  const phone = (formData.get('phone') as string | null)?.trim() || null;
  const tagline = (formData.get('tagline') as string | null)?.trim() || null;
  const bio = (formData.get('bio') as string | null)?.trim() || null;
  const avatar_url = (formData.get('avatar_url') as string | null)?.trim() || null;

  const supabase = await createClient();

  try {
    // 1. Create user in Clerk
    const clerkRes = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: [email],
        first_name: full_name.split(' ')[0],
        last_name: full_name.split(' ').slice(1).join(' ') || 'Agent',
        // Clerk will auto-send password reset email
      }),
    });

    if (!clerkRes.ok) {
      const err = await clerkRes.json();
      const message = err.errors?.[0]?.message || 'Failed to create user in Clerk';
      return { success: false, error: message };
    }

    const clerkUser = await clerkRes.json();

    // 2. Insert profile into Supabase
    const { error: dbError } = await supabase.from('profiles').insert({
      clerk_user_id: clerkUser.id,
      full_name,
      email,
      phone,
      tagline,
      bio,
      avatar_url,
      role: 'agent',
    });

    if (dbError) {
      // If profile insert fails, you might want to delete the Clerk user, but for now just report
      return { success: false, error: dbError.message };
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unexpected error' };
  }
}