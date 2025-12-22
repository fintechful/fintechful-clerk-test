'use client';

import { AgentLayout } from '@/components/agent/AgentLayout';
import { MetricsHero } from '@/components/agent/MetricsHero';
import { EarningsChart } from '@/components/agent/EarningsChart';
import { ProviderChart } from '@/components/agent/ProviderChart';
import { TablesSection } from '@/components/agent/TablesSection';
import { GamificationBadge } from '@/components/agent/GamificationBadge';

export default function AgentDashboardPage() {
  return (
   <AgentLayout>
    <div className="space-y-6">
      <MetricsHero />
      <EarningsChart />
      <ProviderChart />
      <TablesSection />
      <GamificationBadge rank={12} total={25} tier="Silver" />
    </div>
    </AgentLayout>
  );
}