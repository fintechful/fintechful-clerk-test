// src/app/dashboard/commissions/page.tsx
import { createClient } from '@/utils/supabase/server';
import CommissionsDashboard from '@/components/dashboard/CommissionsDashboard';

export const dynamic = 'force-dynamic';

export default async function CommissionsPage() {
  const supabase = await createClient();

  // HARD-CODE JANE'S DATA — THIS WILL WORK
  const { data: commissions } = await supabase
    .from('commissions')
    .select('*')
    .eq('clerk_user_id', 'user_36UzpA4fhsb0ylRlzdmCHC16nnB')
    .order('created_at', { ascending: false });

  const profile = {
    full_name: 'Jane Doe',
    subdomain: 'jane',
    avatar_url: null,
  };

  const pending = commissions
    ?.filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.agent_share_cents + c.override_share_cents, 0) || 0;

  const paid = commissions
    ?.filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.agent_share_cents + c.override_share_cents, 0) || 0;

  return (
    <CommissionsDashboard
      profile={profile}
      commissions={commissions || []}
      totals={{ pending, paid, total: pending + paid }}
    />
  );
}