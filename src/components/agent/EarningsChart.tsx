"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

const earningsData = [
  { month: "Jan", direct: 12400, overrides: 3200 },
  { month: "Feb", direct: 13800, overrides: 3800 },
  { month: "Mar", direct: 15200, overrides: 4100 },
  { month: "Apr", direct: 14100, overrides: 3900 },
  { month: "May", direct: 16800, overrides: 4500 },
  { month: "Jun", direct: 18200, overrides: 4900 },
  { month: "Jul", direct: 17500, overrides: 4700 },
  { month: "Aug", direct: 19200, overrides: 5200 },
  { month: "Sep", direct: 20100, overrides: 5600 },
  { month: "Oct", direct: 21800, overrides: 6100 },
  { month: "Nov", direct: 23400, overrides: 6500 },
  { month: "Dec", direct: 18200, overrides: 4900 },
]

export function EarningsChart() {
  const [selectedType, setSelectedType] = useState<"direct" | "overrides" | "both">("both")

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
          <LineChart data={earningsData}>
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
            />
            <Legend wrapperStyle={{ color: "#ffffff" }} />
            {(selectedType === "direct" || selectedType === "both") && (
              <Line
                type="monotone"
                dataKey="direct"
                stroke="#00FFFF"
                strokeWidth={2}
                name="Direct Commissions"
                dot={{ fill: "#00FFFF", r: 4 }}
              />
            )}
            {(selectedType === "overrides" || selectedType === "both") && (
              <Line
                type="monotone"
                dataKey="overrides"
                stroke="#FFA500"
                strokeWidth={2}
                name="Overrides"
                dot={{ fill: "#FFA500", r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
