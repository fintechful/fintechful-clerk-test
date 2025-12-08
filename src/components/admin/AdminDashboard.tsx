// src/components/admin/AdminDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Edit } from 'lucide-react';
import EditAgentDialog from './EditAgentDialog';

import type { Agent } from '@/types/agent';

export default function AdminDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Agent | null>(null);
  const supabase = createClient();

  const loadAgents = async () => {
    // First get all agents
    const { data: profiles } = await supabase
      .from('profiles')
      .select('clerk_user_id, full_name, email, phone, avatar_url, tagline, bio')
      .eq('role', 'agent');

    if (!profiles) {
      setAgents([]);
      return;
    }

    // Then get SMB counts + commission per agent
    const { data: smbs } = await supabase
      .from('smbs')
      .select('owner_id, commission_cents');

    const agentStats = profiles.map(profile => {
      const ownedSmbs = smbs?.filter(s => s.owner_id === profile.clerk_user_id) || [];
      const smb_count = ownedSmbs.length;
      const total_commission = ownedSmbs.reduce((sum, s) => sum + (s.commission_cents || 0), 0) / 100;

      return {
        ...profile,
        smb_count,
        total_commission,
      };
    });

    setAgents(agentStats);
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Managing {agents.length} agents</p>
        </div>
        <Button size="lg" onClick={() => { setSelected(null); setOpen(true); }}>
          <Plus className="mr-2 h-5 w-5" /> Add Agent
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Clients</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead></TableHead>
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
                  <Button variant="ghost" size="icon" onClick={() => { setSelected(agent); setOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditAgentDialog agent={selected} open={open} onOpenChange={setOpen} onSuccess={loadAgents} />
    </div>
  );
}