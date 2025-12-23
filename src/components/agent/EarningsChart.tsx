'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

type EarningsChartProps = {
  commissions: any[];
};

export function EarningsChart({ commissions }: EarningsChartProps) {
  const [selectedType, setSelectedType] = useState<"direct" | "overrides" | "both">("both");

  // Calculate monthly totals for last 12 months
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short' });

    const monthCommissions = commissions.filter((c) => {
      const cDate = new Date(c.created_at);
      return cDate.getMonth() === date.getMonth() && cDate.getFullYear() === date.getFullYear();
    });

    const direct = monthCommissions
      .filter(c => !c.referrer_clerk_user_id) // Direct (no referrer)
      .reduce((sum, c) => sum + c.agent_share_cents, 0) / 100;

    const overrides = monthCommissions
      .filter(c => c.referrer_clerk_user_id) // Overrides (has referrer)
      .reduce((sum, c) => sum + c.agent_share_cents * 0.05, 0) / 100; // 5% override

    return { month, direct, overrides };
  }).reverse();

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Earnings Over Time</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={selectedType === "direct" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("direct")}
          >
            Direct Commissions
          </Button>
          <Button
            variant={selectedType === "overrides" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("overrides")}
          >
            Overrides
          </Button>
          <Button
            variant={selectedType === "both" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("both")}
          >
            Both
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="month" stroke="#ffffff" tick={{ fill: "#ffffff" }} />
            <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
              formatter={(value: number | undefined) => {
                if (value === undefined) return '$0';
                return `$${value.toFixed(0)}`;
              }}
            />
            <Legend wrapperStyle={{ color: "#ffffff" }} />
            {(selectedType === "direct" || selectedType === "both") && (
              <Line
                type="monotone"
                dataKey="direct"
                stroke="#00FFFF"
                strokeWidth={3}
                name="Direct Commissions"
                dot={{ fill: "#00FFFF", r: 4 }}
              />
            )}
            {(selectedType === "overrides" || selectedType === "both") && (
              <Line
                type="monotone"
                dataKey="overrides"
                stroke="#FFA500"
                strokeWidth={3}
                name="Overrides"
                dot={{ fill: "#FFA500", r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}