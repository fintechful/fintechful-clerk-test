import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function createAgent(formData: FormData) {
  const supabase = await createClient();

  const full_name = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string | null;
  const tagline = formData.get('tagline') as string | null;
  const bio = formData.get('bio') as string | null;
  const avatar_url = formData.get('avatar_url') as string | null;

  try {
    // 1. Create user in Clerk via Server API
    const clerkResponse = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: [email],
        first_name: full_name.split(' ')[0],
        last_name: full_name.split(' ').slice(1).join(' ') || 'Agent',
        unsafe_metadata: { role: 'agent' },
        // Clerk will send password reset email automatically
      }),
    });

    if (!clerkResponse.ok) {
      const err = await clerkResponse.json();
      throw new Error(err.errors?.[0]?.message || 'Clerk failed');
    }

    const clerkUser = await clerkResponse.json();

    // 2. Insert profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .insert({
        clerk_user_id: clerkUser.id,
        full_name,
        email,
        phone,
        tagline,
        bio,
        avatar_url,
        role: 'agent',
      });

    if (error) throw error;

    revalidatePath('/admin');
    return { success: true, userId: clerkUser.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}