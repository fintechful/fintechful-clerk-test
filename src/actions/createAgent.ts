// src/actions/createAgent.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function createAgent(formData: FormData) {
  const supabase = await createClient();

  const testName = formData.get('full_name')?.toString() || 'Test User';
  const testEmail = formData.get('email')?.toString() || 'test@example.com';

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      clerk_user_id: 'test-' + Date.now(),
      full_name: testName,
      email: testEmail,
      role: 'agent',
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert failed:', error);
    return { success: false, error: error.message };
  }

  console.log('Supabase insert succeeded:', data);
  revalidatePath('/admin');
  return { success: true, insertedId: data.clerk_user_id };
}