'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { AgentLayout } from '@/components/agent/AgentLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from 'date-fns';

export default function AgentReferralsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [referralStats, setReferralStats] = useState<any[]>([]);
  const [overrideHistory, setOverrideHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }

    async function fetchReferralData() {
      const clerk_user_id = user!.id;  // Non-null assertion — safe because we already checked !user

      // Fetch downline agents
      const { data: downlineAgents } = await supabase
        .from('profiles')
        .select('clerk_user_id, full_name, subdomain')
        .eq('referrer_clerk_user_id', clerk_user_id);

      if (!downlineAgents || downlineAgents.length === 0) {
        setLoading(false);
        return;
      }

      const downlineIds = downlineAgents.map(a => a.clerk_user_id);

      // Fetch all commissions for downline agents
      const { data: downlineCommissions } = await supabase
        .from('commissions')
        .select('*')
        .in('clerk_user_id', downlineIds);

      // Calculate stats per agent
      const stats = downlineAgents.map(agent => {
        const agentComms = downlineCommissions?.filter(c => c.clerk_user_id === agent.clerk_user_id) || [];
        const lifetime = agentComms.reduce((sum, c) => sum + c.agent_share_cents, 0) / 100 * 0.05;
        const lastMonth = agentComms
          .filter(c => c.status === 'paid' && new Date(c.paid_at || c.created_at) > new Date(new Date().setMonth(new Date().getMonth() - 1)))
          .reduce((sum, c) => sum + c.agent_share_cents, 0) / 100 * 0.05;
        const pending = agentComms
          .filter(c => c.status !== 'paid')
          .reduce((sum, c) => sum + c.agent_share_cents, 0) / 100 * 0.05;

        return {
          name: agent.full_name,
          username: `@${agent.subdomain || 'unknown'}`,
          lifetimeOverrides: Math.round(lifetime),
          lastMonthPaid: Math.round(lastMonth),
          pending: Math.round(pending),
        };
      });

      setReferralStats(stats);

      // Override Commission History (last 10 overrides)
      const history = (downlineCommissions || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map(c => {
          const agent = downlineAgents.find(a => a.clerk_user_id === c.clerk_user_id);
          return {
            date: format(new Date(c.created_at), 'yyyy-MM-dd'),
            agent: agent?.full_name || 'Unknown',
            type: 'Override',
            amount: Math.round(c.agent_share_cents / 100 * 0.05),
            status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
          };
        });

      setOverrideHistory(history);
      setLoading(false);
    }

    fetchReferralData();
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return (
      <AgentLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-2xl text-muted-foreground">Loading referrals...</p>
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Agent Referrals</h1>

        {/* Downline Agents */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Downline Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                  {referralStats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No referred agents yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    referralStats.map((agent, idx) => (
                      <TableRow key={idx} className="border-border">
                        <TableCell className="text-foreground">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {agent.name.split(" ").map((n: string) => n[0]).join("")}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Override Commission History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Override Commission History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                  {overrideHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No override commissions yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    overrideHistory.map((item, idx) => (
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>        
      </div>
    </AgentLayout>
  );
}