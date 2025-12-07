import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const supabase = createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('clerk_user_id', user.id)
    .single();

  if (profile?.role !== 'super_admin') {
    redirect('/dashboard');
  }

  return <AdminDashboard />;
}