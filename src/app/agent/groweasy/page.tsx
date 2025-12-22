"use client"

import { AgentLayout } from '@/components/agent/AgentLayout';
import { GamificationBadge } from "@/components/agent/GamificationBadge"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Sparkles } from "lucide-react"

export default function GrowEasyPage() {

  return (
    <AgentLayout>
    <div className="dark min-h-screen bg-background">
        <main className="p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="bg-card border-border max-w-2xl w-full">
            <CardContent className="p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-4xl font-bold text-foreground">GrowEasy</h1>
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xl text-muted-foreground">Coming Soon</p>
              </div>
              <p className="text-foreground text-lg max-w-md mx-auto leading-relaxed">
                An exciting new feature to help you grow your business effortlessly. Stay tuned for powerful tools
                designed to accelerate your success.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <span className="text-sm text-primary font-medium">Launch: Q2 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      <GamificationBadge rank={12} total={25} tier="Silver" />
    </div>
    </AgentLayout>
  )
}
