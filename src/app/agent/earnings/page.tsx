'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { AgentLayout } from '@/components/agent/AgentLayout';
import { EarningsChart } from '@/components/agent/EarningsChart';
import { ProviderChart } from '@/components/agent/ProviderChart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns';

export default function EarningsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }

    async function fetchAgentCommissions() {
      const clerk_user_id = user!.id;  // Non-null assertion — safe because we already checked !user

      const { data, error } = await supabase
        .from('commissions')
        .select('*')
        .eq('clerk_user_id', clerk_user_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching commissions:', error);
      } else {
        setCommissions(data || []);
      }
      setLoading(false);
    }

    fetchAgentCommissions();
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return (
      <AgentLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-2xl text-muted-foreground">Loading earnings...</p>
        </div>
      </AgentLayout>
    );
  }

  if (commissions.length === 0) {
    return (
      <AgentLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-2xl text-muted-foreground">
            No commissions yet — keep crushing it!
          </p>
        </div>
      </AgentLayout>
    );
  }

  // Recent commissions for the table (top 10)
  const recentCommissions = commissions.slice(0, 10).map((c) => ({
    date: format(new Date(c.created_at), 'yyyy-MM-dd'),
    provider: c.provider,
    gross: (c.gross_commission_cents / 100),
    share: (c.agent_share_cents / 100),
    status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
    notes: c.notes || '',
  }));

  return (
    <AgentLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Earnings</h1>

        <EarningsChart commissions={commissions} />
        <ProviderChart commissions={commissions} />

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                      <TableCell className="text-foreground text-right">
                        ${item.gross.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-foreground text-right font-semibold">
                        ${item.share.toFixed(2)}
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
            </div>
          </CardContent>
        </Card>       
      </div>
    </AgentLayout>
  );
}
