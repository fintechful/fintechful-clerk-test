// src/app/dashboard/commissions/page.tsx — FINAL v1 (55/45 split)
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CommissionsDashboard from '@/components/dashboard/CommissionsDashboard';

export const dynamic = 'force-dynamic';

export default async function CommissionsPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('clerk_user_id, full_name, subdomain, avatar_url')
    .eq('clerk_user_id', user.id)
    .single();

  if (!profile) redirect('/dashboard');

  const { data: commissions } = await supabase
    .from('commissions')
    .select('*')
    .eq('clerk_user_id', profile.clerk_user_id)
    .order('created_at', { ascending: false });

  // Agent only sees their 55%
  const agentEarnings = commissions?.map(c => ({
    ...c,
    agent_total_cents: c.agent_share_cents,  // ← just the 55%
  })) || [];

  const pending = agentEarnings
    .filter(c => c.status !== 'paid')
    .reduce((sum, c) => sum + c.agent_total_cents, 0);

  const paid = agentEarnings
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.agent_total_cents, 0);

  return (
    <CommissionsDashboard
      profile={profile}
      commissions={agentEarnings}
      totals={{ pending, paid, total: pending + paid }}
    />
  );
}