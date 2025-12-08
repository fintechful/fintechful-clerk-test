// src/app/dashboard/profile/page.tsx
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/dashboard/ProfileForm';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const supabase = await createClient();   // ← THIS LINE WAS MISSING AWAIT

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error loading profile:', error);
  }

  return <ProfileForm initialProfile={profile || { clerk_user_id: user.id }} />;
}