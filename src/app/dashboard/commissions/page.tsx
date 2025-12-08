// src/app/dashboard/commissions/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CommissionsDashboard from '@/components/dashboard/CommissionsDashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CommissionsPage() {
  const supabase = await createClient();

  // This is the key — use getSession, not getUser
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('clerk_user_id, full_name, username, avatar_url')
    .eq('clerk_user_id', session.user.id)
    .single();

  if (!profile) {
    redirect('/dashboard');
  }

  const { data: commissions } = await supabase
    .from('commissions')
    .select('*')
    .eq('agent_clerk_id', profile.clerk_user_id)
    .order('created_at', { ascending: false });

  const pending = commissions
    ?.filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.agent_share_cents + c.override_share_cents, 0) || 0;

  const paid = commissions
    ?.filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.agent_share_cents + c.override_share_cents, 0) || 0;

  const total = pending + paid;

  return (
    <CommissionsDashboard
      profile={profile}
      commissions={commissions || []}
      totals={{ pending, paid, total }}
    />
  );
}