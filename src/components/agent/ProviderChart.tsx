'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts"

type ProviderChartProps = {
  commissions: any[];
};

type PeriodType = "thisMonth" | "lastMonth" | "ytd";

const providerColors = ["#00FFFF", "#FFA500", "#A855F7", "#22C55E", "#EC4899"];

export function ProviderChart({ commissions }: ProviderChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("thisMonth");

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Helper to check if a commission falls in a given period
  const getPeriodValue = (c: any): number => {
    const date = new Date(c.paid_at || c.created_at);
    const month = date.getMonth();
    const year = date.getFullYear();

    if (selectedPeriod === "thisMonth") {
      return month === currentMonth && year === currentYear && c.status !== 'paid' 
        ? c.agent_share_cents / 100 
        : 0;
    }
    if (selectedPeriod === "lastMonth") {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return month === lastMonth && year === lastMonthYear && c.status === 'paid' 
        ? c.agent_share_cents / 100 
        : 0;
    }
    if (selectedPeriod === "ytd") {
      return year === currentYear && c.status === 'paid' 
        ? c.agent_share_cents / 100 
        : 0;
    }
    return 0;
  };

  // Group by provider and sum for selected period
  const providerData = commissions.reduce((acc: { provider: string; total: number }[], c: any) => {
    const existing = acc.find(item => item.provider === c.provider);
    const value = getPeriodValue(c);

    if (existing) {
      existing.total += value;
    } else if (value > 0) {
      acc.push({ provider: c.provider, total: value });
    }
    return acc;
  }, []);

  // Sort by total descending
  providerData.sort((a, b) => b.total - a.total);

  const periodLabels = {
    thisMonth: "This Month Pending",
    lastMonth: "Last Month Paid",
    ytd: "YTD Paid",
  };

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
              formatter={(value: number | undefined) => {
                if (value === undefined) return '$0';
                return `$${value.toFixed(0)}`;
              }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} name={periodLabels[selectedPeriod]}>
              {providerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={providerColors[index % providerColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}