"use client"

import { AgentLayout } from '@/components/agent/AgentLayout';
import { GamificationBadge } from "@/components/agent/GamificationBadge"

export default function SettingsPage() {
  
  return (
    <AgentLayout>
    <div className="dark min-h-screen bg-background">
        <main className="p-6">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
        </main>


      <GamificationBadge rank={12} total={25} tier="Silver" />
    </div>
    </AgentLayout>
  )
}
