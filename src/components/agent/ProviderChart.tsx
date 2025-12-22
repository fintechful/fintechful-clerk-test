"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts"

const providerData = [
  { provider: "Provider A", thisMonth: 4200, lastMonth: 3800, ytd: 48500 },
  { provider: "Provider B", thisMonth: 3800, lastMonth: 4100, ytd: 52300 },
  { provider: "Provider C", thisMonth: 2900, lastMonth: 2600, ytd: 38700 },
  { provider: "Provider D", thisMonth: 3200, lastMonth: 3000, ytd: 41200 },
  { provider: "Provider E", thisMonth: 2100, lastMonth: 2400, ytd: 28900 },
]

type PeriodType = "thisMonth" | "lastMonth" | "ytd"

const providerColors = ["#00FFFF", "#FFA500", "#A855F7", "#22C55E", "#EC4899"]

export function ProviderChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("thisMonth")

  const periodLabels = {
    thisMonth: "This Month Pending",
    lastMonth: "Last Month Paid",
    ytd: "YTD Paid",
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Earnings by Provider</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === "thisMonth" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("thisMonth")}
          >
            This Month Pending
          </Button>
          <Button
            variant={selectedPeriod === "lastMonth" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("lastMonth")}
          >
            Last Month Paid
          </Button>
          <Button
            variant={selectedPeriod === "ytd" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("ytd")}
          >
            YTD Paid
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={providerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="provider" stroke="#ffffff" tick={{ fill: "#ffffff" }} />
            <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            />
            <Bar dataKey={selectedPeriod} radius={[4, 4, 0, 0]} name={periodLabels[selectedPeriod]}>
              {providerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={providerColors[index % providerColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
