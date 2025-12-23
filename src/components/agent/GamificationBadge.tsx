import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type GamificationBadgeProps = {
  rank: number;
  total: number;
  tier: "Bronze" | "Silver" | "Pro" | "Elite";
};

const tierConfig = {
  Bronze: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", iconColor: "text-orange-400" },
  Silver: { color: "bg-gray-400/20 text-gray-300 border-gray-400/30", iconColor: "text-gray-300" },
  Pro: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", iconColor: "text-yellow-400" },
  Elite: { color: "bg-purple-500/20 text-purple-300 border-purple-500/30", iconColor: "text-purple-300" },
};

export function GamificationBadge({ rank, total, tier }: GamificationBadgeProps) {
  const config = tierConfig[tier];

  return (
   <Badge 
  variant="outline" 
  className={`px-5 py-1 text-sm font-medium ${config.color} border flex items-center gap-1`}
>
  <Trophy className={`w-6 h-6 !w-6 !h-6 mr-2 ${config.iconColor}`} />  {/* Bigger trophy */}
  <div className="flex flex-col leading-tight">
    <span className="text-xs text-muted-foreground">Your Rank: #{rank} of {total}</span>
    <span className="font-bold">{tier}</span>
  </div>
</Badge>
  );
}