import { cn } from "@/lib/utils"

interface GamificationBadgeProps {
  rank: number
  total: number
  tier: "Bronze" | "Silver" | "Gold"
}

export function GamificationBadge({ rank, total, tier }: GamificationBadgeProps) {
  const tierColors = {
    Bronze: "from-amber-700 to-amber-500",
    Silver: "from-slate-400 to-slate-200",
    Gold: "from-yellow-500 to-yellow-300",
  }

  const tierIcons = {
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇",
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl",
              tierColors[tier],
            )}
          >
            {tierIcons[tier]}
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Your Rank</div>
            <div className="text-2xl font-bold text-foreground">
              #{rank}
              <span className="text-sm text-muted-foreground">/{total}</span>
            </div>
            <div className="text-xs font-medium text-primary">{tier} Tier</div>
          </div>
        </div>
      </div>
    </div>
  )
}
