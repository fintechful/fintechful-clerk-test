// src/app/dashboard/commissions/page.tsx
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import CommissionsDashboard from '@/components/dashboard/CommissionsDashboard';

export const dynamic = 'force-dynamic';

export default async function CommissionsPage() {
  // Use Clerk directly — never trust Supabase auth for Clerk users
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const supabase = await createClient();

  // Get profile using Clerk ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('clerk_user_id, full_name, username, avatar_url')
    .eq('clerk_user_id', user.id)
    .single();

  if (!profile) redirect('/dashboard');

  // Get commissions
  const { data: commissions } = await supabase
    .from('commissions')
    .select('*')
    .eq('agent_clerk_id', profile.clerk_user_id)
    .order('created_at', { ascending: false });

  const pending =
    commissions
      ?.filter((c) => c.status === 'pending')
      .reduce((sum, c) => sum + c.agent_share_cents + c.override_share_cents, 0) || 0;

  const paid =
    commissions
      ?.filter((c) => c.status === 'paid')
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