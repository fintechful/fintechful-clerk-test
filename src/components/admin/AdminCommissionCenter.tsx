// src/components/admin/AdminCommissionCenter.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, Search, CheckCircle2 } from 'lucide-react';

export function AdminCommissionCenter() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('commissions')
      .select('*, profiles(full_name, subdomain)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setCommissions(data || []));
  }, []);

  const filtered = commissions.filter(c =>
    c.profiles?.subdomain?.toLowerCase().includes(search.toLowerCase()) ||
    c.provider.toLowerCase().includes(search.toLowerCase())
  );

  const markAsPaid = async (id: string) => {
    await supabase.from('commissions').update({ status: 'paid', paid_at: new Date() }).eq('id', id);
    toast.success('Marked as paid');
    setCommissions(prev => prev.map(c => c.id === id ? { ...c, status: 'paid' } : c));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Commission Center (Super Admin)</h1>

      <div className="mb-8 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agent, provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV (tomorrow)
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Gross</TableHead>
              <TableHead>Agent (55%)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  {c.profiles?.full_name} (@{c.profiles?.subdomain})
                </TableCell>
                <TableCell>{c.provider}</TableCell>
                <TableCell>${(c.gross_commission_cents / 100).toFixed(2)}</TableCell>
                <TableCell className="font-semibold text-green-600">
                  ${(c.agent_share_cents / 100).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={c.status === 'paid' ? 'default' : 'secondary'}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {c.status === 'pending' && (
                    <Button size="sm" onClick={() => markAsPaid(c.id)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Mark Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}