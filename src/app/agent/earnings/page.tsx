"use client"

import { AgentLayout } from '@/components/agent/AgentLayout';
import { EarningsChart } from "@/components/agent/EarningsChart"
import { ProviderChart } from "@/components/agent/ProviderChart"
import { GamificationBadge } from "@/components/agent/GamificationBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const recentCommissions = [
  {
    date: "2024-01-15",
    provider: "Provider A",
    gross: 5200,
    share: 1560,
    status: "Paid",
    notes: "Q4 bonus included",
  },
  {
    date: "2024-01-12",
    provider: "Provider B",
    gross: 4800,
    share: 1440,
    status: "Paid",
    notes: "",
  },
  {
    date: "2024-01-10",
    provider: "Provider C",
    gross: 3200,
    share: 960,
    status: "Pending",
    notes: "Awaiting verification",
  },
  {
    date: "2024-01-08",
    provider: "Provider A",
    gross: 6100,
    share: 1830,
    status: "Paid",
    notes: "",
  },
  {
    date: "2024-01-05",
    provider: "Provider D",
    gross: 2900,
    share: 870,
    status: "Pending",
    notes: "",
  },
]

export default function EarningsPage() { 

  return (
    <AgentLayout>
    <div className="dark min-h-screen bg-background">
        <main className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Earnings</h1>

          <EarningsChart />
          <ProviderChart />

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Provider</TableHead>
                    <TableHead className="text-muted-foreground text-right">Gross</TableHead>
                    <TableHead className="text-muted-foreground text-right">Your Share</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCommissions.map((item, idx) => (
                    <TableRow key={idx} className="border-border">
                      <TableCell className="text-foreground">{item.date}</TableCell>
                      <TableCell className="text-foreground">{item.provider}</TableCell>
                      <TableCell className="text-foreground text-right">${item.gross.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground text-right font-semibold">
                        ${item.share.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === "Paid" ? "default" : "secondary"}
                          className={
                            item.status === "Paid"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      <GamificationBadge rank={12} total={25} tier="Silver" />
    </div>
    </AgentLayout>
  )
}
