'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/agent/Sidebar';
import { DashboardHeader } from '@/components/agent/DashboardHeader';
import { cn } from '@/lib/utils';

type AgentLayoutProps = {
  children: React.ReactNode;
};

export function AgentLayout({ children }: AgentLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />

      {/* Main content area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300"
        )}
      >
        <DashboardHeader/>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}