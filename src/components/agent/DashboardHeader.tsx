'use client';

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GamificationBadge } from "@/components/agent/GamificationBadge"

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, agents, SMBs..."
            className="pl-9 bg-background border-border"
            disabled // optional: makes it clear it's placeholder
          />
        </div>
      </div>

      {/* Gamification Badge — Top Right */}
      <div className="flex items-center">
        <GamificationBadge rank={12} total={100} tier="Pro" />
      </div>
    </header>
  );
}