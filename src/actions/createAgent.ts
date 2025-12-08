// src/actions/createAgent.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function createAgent(formData: FormData) {
  const supabase = await createClient();   // ← same thing, just cleaner

  const full_name = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string | null;
  const tagline = formData.get('tagline') as string | null;
  const bio = formData.get('bio') as string | null;
  const avatar_url = formData.get('avatar_url') as string | null;

  try {
    // Create Clerk user
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
      }),
    });

    if (!clerkRes.ok) {
      const err = await clerkRes.json();
      throw new Error(err.errors?.[0]?.message || 'Clerk error');
    }

    const clerkUser = await clerkRes.json();

    // Insert profile
    const { error } = await supabase
      .from('profiles')
      .insert({
        clerk_user_id: clerkUser.id,
        full_name,
        email,
        phone: phone || null,
        tagline: tagline || null,
        bio: bio || null,
        avatar_url: avatar_url || null,
        role: 'agent',
      });

    if (error) throw error;

    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}