"use client"

import { AgentLayout } from '@/components/agent/AgentLayout';
import { GamificationBadge } from "@/components/agent/GamificationBadge"

export default function ReportsPage() {
 
  return (
    <AgentLayout>
    <div className="dark min-h-screen bg-background">
        <main className="p-6">
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-2">Generate and download financial reports</p>
        </main> 
    </div>
    </AgentLayout>
  )
}
