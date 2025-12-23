'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { AgentLayout } from '@/components/agent/AgentLayout';
import { MetricsHero } from '@/components/agent/MetricsHero';
import { EarningsChart } from '@/components/agent/EarningsChart';
import { ProviderChart } from '@/components/agent/ProviderChart';
import { TablesSection } from '@/components/agent/TablesSection';
import { GamificationBadge } from '@/components/agent/GamificationBadge';

export default function AgentDashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [smbReferrals, setSmbReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }

    async function fetchAgentData() {
      const clerk_user_id = user!.id; // ← ! tells TypeScript user is defined

      // Commissions
      const { data: commissionData } = await supabase
        .from('commissions')
        .select('*')
        .eq('clerk_user_id', clerk_user_id)
        .order('created_at', { ascending: false });
      setCommissions(commissionData || []);

      // Payouts
      const { data: payoutData } = await supabase
        .from('payouts')
        .select('*')
        .eq('clerk_user_id', clerk_user_id)
        .order('payout_date', { ascending: false });
      setPayouts(payoutData || []);

      // Agent Referrals
      const { data: downlineAgents } = await supabase
        .from('profiles')
        .select('clerk_user_id, full_name, subdomain')
        .eq('referrer_clerk_user_id', clerk_user_id);

      if (downlineAgents && downlineAgents.length > 0) {
        const downlineIds = downlineAgents.map(a => a.clerk_user_id);
        const { data: downlineCommissions } = await supabase
          .from('commissions')
          .select('*')
          .in('clerk_user_id', downlineIds);

        const referralStats = downlineAgents.map(agent => {
          const agentComms = downlineCommissions?.filter(c => c.clerk_user_id === agent.clerk_user_id) || [];
          const lifetimeOverrides = agentComms.reduce((sum, c) => sum + c.agent_share_cents, 0) / 100 * 0.05;
          const lastMonthOverrides = agentComms
            .filter(c => c.status === 'paid' && new Date(c.paid_at || c.created_at) > new Date(new Date().setMonth(new Date().getMonth() - 1)))
            .reduce((sum, c) => sum + c.agent_share_cents, 0) / 100 * 0.05;
          const pendingOverrides = agentComms
            .filter(c => c.status !== 'paid')
            .reduce((sum, c) => sum + c.agent_share_cents, 0) / 100 * 0.05;

          return {
            name: agent.full_name,
            username: `@${agent.subdomain || 'unknown'}`,
            lifetime: lifetimeOverrides.toFixed(0),
            lastMonth: lastMonthOverrides.toFixed(0),
            pending: pendingOverrides.toFixed(0),
          };
        });

        setReferrals(referralStats);
      }

      // SMB Referrals
      const { data: smbData } = await supabase
        .from('smb_referrals')
        .select('id, business_name, owner_name, contact_email, contact_phone, business_type, referred_at')
        .eq('agent_clerk_user_id', clerk_user_id)
        .order('referred_at', { ascending: false });
      setSmbReferrals(smbData || []);

      setLoading(false);
    }

    fetchAgentData();
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return (
      <AgentLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-2xl text-muted-foreground">Loading your dashboard...</p>
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <MetricsHero commissions={commissions} />
        <EarningsChart commissions={commissions} />
        <ProviderChart commissions={commissions} />
        <TablesSection
          commissions={commissions}
          payouts={payouts}
          referrals={referrals}
          smbReferrals={smbReferrals}          
        />        
      </div>
    </AgentLayout>
  );
}