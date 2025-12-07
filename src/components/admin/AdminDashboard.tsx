'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, DollarSign, Users } from 'lucide-react';
import EditAgentDialog from './EditAgentDialog';

type Agent = {
  clerk_user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  tagline: string | null;
  smb_count: number;
  total_commission: number;
};

export default function AdminDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Agent | null>(null);
  const supabase = createClient();

  const loadAgents = async () => {
    const { data } = await supabase
      .from('profiles')
      .select(`
        clerk_user_id, full_name, email, phone, avatar_url, tagline,
        smbs!owner_id(count),
        smbs!owner_id(commission_cents)
      `)
      .eq('role', 'agent');

    if (data) {
      const formatted = data.map((p: any) => ({
        clerk_user_id: p.clerk_user_id,
        full_name: p.full_name,
        email: p.email,
        phone: p.phone,
        avatar_url: p.avatar_url,
        tagline: p.tagline,
        smb_count: p.smbs[0]?.count || 0,
        total_commission: p.smbs.reduce((sum: number, s: any) => sum + (s.commission_cents || 0), 0) / 100,
      }));
      setAgents(formatted);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const totalEarned = agents.reduce((sum, a) => sum + a.total_commission, 0);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage agents and track commissions</p>
        </div>
        <Button size="lg" onClick={() => { setSelected(null); setOpen(true); }}>
          <Plus className="mr-2 h-5 w-5" /> Add Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.clerk_user_id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={agent.avatar_url || undefined} />
                        <AvatarFallback>{agent.full_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{agent.full_name}</p>
                        <p className="text-sm text-muted-foreground">{agent.tagline || '—'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{agent.smb_count}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    ${agent.total_commission.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setSelected(agent); setOpen(true); }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditAgentDialog
        agent={selected}
        open={open}
        onOpenChange={setOpen}
        onSuccess={loadAgents}
      />
    </div>
  );
}