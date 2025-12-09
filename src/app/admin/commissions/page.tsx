// src/app/admin/commissions/page.tsx
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/utils/supabase/server';
import { AdminCommissionCenter } from '@/components/admin/AdminCommissionCenter';

export const dynamic = 'force-dynamic';

export default async function AdminCommissionsPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('clerk_user_id', user.id)
    .single();

  if (profile?.role !== 'super_admin') {
    redirect('/dashboard');
  }

  return <AdminCommissionCenter />;
}