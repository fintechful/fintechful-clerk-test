"use client"

import { AgentLayout } from '@/components/agent/AgentLayout';
import { GamificationBadge } from "@/components/agent/GamificationBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const agentReferrals = [
  { name: "Sarah Johnson", username: "@sjohnson", lifetimeOverrides: 8420, lastMonthPaid: 720, pending: 340 },
  { name: "Mike Chen", username: "@mchen", lifetimeOverrides: 6890, lastMonthPaid: 580, pending: 290 },
  { name: "Emily Rodriguez", username: "@erodriguez", lifetimeOverrides: 5230, lastMonthPaid: 450, pending: 210 },
  { name: "David Kim", username: "@dkim", lifetimeOverrides: 3940, lastMonthPaid: 380, pending: 180 },
  { name: "Lisa Wang", username: "@lwang", lifetimeOverrides: 2850, lastMonthPaid: 240, pending: 120 },
]

const overrideCommissions = [
  { date: "2024-01-15", agent: "Sarah Johnson", type: "Override", amount: 240, status: "Paid" },
  { date: "2024-01-12", agent: "Mike Chen", type: "Override", amount: 195, status: "Paid" },
  { date: "2024-01-10", agent: "Emily Rodriguez", type: "Override", amount: 150, status: "Pending" },
  { date: "2024-01-08", agent: "David Kim", type: "Override", amount: 128, status: "Paid" },
  { date: "2024-01-05", agent: "Lisa Wang", type: "Override", amount: 80, status: "Pending" },
]

export default function AgentReferralsPage() { 

  return (
    <AgentLayout>
    <div className="dark min-h-screen bg-background">
        <main className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Agent Referrals</h1>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Downline Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Username</TableHead>
                    <TableHead className="text-muted-foreground text-right">Lifetime Overrides</TableHead>
                    <TableHead className="text-muted-foreground text-right">Last Month Paid</TableHead>
                    <TableHead className="text-muted-foreground text-right">Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentReferrals.map((agent, idx) => (
                    <TableRow key={idx} className="border-border">
                      <TableCell className="text-foreground">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {agent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {agent.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{agent.username}</TableCell>
                      <TableCell className="text-foreground text-right font-semibold">
                        ${agent.lifetimeOverrides.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-foreground text-right">
                        ${agent.lastMonthPaid.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-foreground text-right">${agent.pending.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Override Commission History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Agent</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overrideCommissions.map((item, idx) => (
                    <TableRow key={idx} className="border-border">
                      <TableCell className="text-foreground">{item.date}</TableCell>
                      <TableCell className="text-foreground">{item.agent}</TableCell>
                      <TableCell className="text-muted-foreground">{item.type}</TableCell>
                      <TableCell className="text-foreground text-right font-semibold">
                        ${item.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={item.status === "Paid" ? "text-green-400 text-sm" : "text-yellow-400 text-sm"}>
                          {item.status}
                        </span>
                      </TableCell>
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
