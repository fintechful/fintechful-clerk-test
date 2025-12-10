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

  const loadCommissions = async () => {
    console.log('Loading commissions...'); // ← debug
    const { data, error } = await supabase
      .from('commissions')
      .select(`
        id,
        created_at,
        subdomain,
        provider,
        gross_commission_cents,
        agent_share_cents,
        status,
        profiles ( full_name, subdomain )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      toast.error('Failed to load commissions');
      setCommissions([]);
    } else {
      console.log('Loaded commissions:', data);
      setCommissions(data || []);
    }
  };

  useEffect(() => {
    loadCommissions();
  }, []);

  const filtered = commissions.filter(c =>
    c.subdomain?.toLowerCase().includes(search.toLowerCase()) ||
    c.provider.toLowerCase().includes(search.toLowerCase()) ||
    c.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').slice(1);
    let added = 0;
    let skipped = 0;

    for (const line of lines) {
      const cols = line.split(',');
      if (cols.length < 3) continue;

      const subdomain = cols[0].trim().toLowerCase();
      const provider = cols[1].trim();
      const grossStr = cols[2].trim().replace(/[^0-9.-]/g, '');
      const grossCents = Math.round(parseFloat(grossStr) * 100);

      if (!subdomain || !provider || isNaN(grossCents)) {
        skipped++;
        continue;
      }

      const agentShare = Math.round(grossCents * 0.55);

      const { data: agent } = await supabase
        .from('profiles')
        .select('clerk_user_id')
        .eq('subdomain', subdomain)
        .single();

      if (!agent) {
        skipped++;
        continue;
      }

      const { error } = await supabase.from('commissions').insert({
        clerk_user_id: agent.clerk_user_id,
        subdomain,
        provider,
        product_type: 'unknown',
        gross_commission_cents: grossCents,
        agent_share_cents: agentShare,
        provider_record_id: `${provider}-${Date.now()}-${added}`,
        status: 'pending',
      });

      if (!error) added++;
    }

    toast.success(`Processed: ${added} added, ${skipped} skipped`);
    loadCommissions(); // ← refresh after upload
  };

  const markAsPaid = async (id: string) => {
    const { error } = await supabase
      .from('commissions')
      .update({ status: 'paid', paid_at: new Date() })
      .eq('id', id);

    if (error) toast.error('Failed to mark as paid');
    else toast.success('Marked as paid');
    loadCommissions();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Commission Center (Super Admin)</h1>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agent, provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <label className="cursor-pointer">
          <Button asChild>
            <div>
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </div>
          </Button>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </label>
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No commissions found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.profiles?.full_name || 'Unknown'} (@{c.subdomain})
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
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}