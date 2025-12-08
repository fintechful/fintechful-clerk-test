// src/actions/createAgent.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function createAgent(formData: FormData) {
  const full_name = formData.get('full_name')?.toString().trim();
  const email = formData.get('email')?.toString().trim()?.toLowerCase();

  if (!full_name || !email) {
    return { success: false, error: 'Full name and email are required' };
  }

  const supabase = await createClient();

  try {
    // Create user in Clerk
    const clerkResponse = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: [email],
        first_name: full_name.split(' ')[0],
        last_name: full_name.split(' ').slice(1).join(' ') || 'Agent',
      }),
    });

    if (!clerkResponse.ok) {
      const error = await clerkResponse.json();
      return { success: false, error: error.errors?.[0]?.message || 'Clerk error' };
    }

    const clerkUser = await clerkResponse.json();

    // Insert into Supabase profiles
    const { error: dbError } = await supabase
      .from('profiles')
      .insert({
        clerk_user_id: clerkUser.id,
        full_name,
        email,
        role: 'agent',
      });

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    revalidatePath('/admin');
    return { success: true };

  } catch (err: any) {
    return { success: false, error: err.message || 'Unexpected error' };
  }
}