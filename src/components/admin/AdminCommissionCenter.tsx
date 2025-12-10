// src/components/admin/AdminCommissionCenter.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Search, CheckCircle2, Edit2, Save, X } from 'lucide-react';

export function AdminCommissionCenter() {
  const supabase = createClient();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    const { data } = await supabase
      .from('commissions')
      .select('*, profiles(full_name, subdomain)')
      .order('created_at', { ascending: false });
    setCommissions(data || []);
  };

  const filtered = commissions.filter(c =>
    c.profiles?.subdomain?.toLowerCase().includes(search.toLowerCase()) ||
    c.provider.toLowerCase().includes(search.toLowerCase()) ||
    c.provider_record_id.includes(search)
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').slice(1); // skip header
    let added = 0;
    let skipped = 0;

    for (const line of lines) {
      const cols = line.split(',');
      if (cols.length < 3) continue;

      const subdomain = cols[0].trim().toLowerCase();
      const provider = cols[1].trim();
      const grossStr = cols[2].trim().replace(/[^0-9.-]/g, '');
      const grossCents = Math.round(parseFloat(grossStr) * 100);

      if (!subdomain || !provider || isNaN(grossCents)) continue;

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
    loadCommissions();
  };

  const markAsPaid = async (ids: string[]) => {
    await supabase.from('commissions').update({ status: 'paid', paid_at: new Date() }).in('id', ids);
    toast.success(`${ids.length} commission(s) marked as paid`);
    loadCommissions();
  };

  const saveEdit = async () => {
    const { error } = await supabase.from('commissions').update(editForm).eq('id', editingId);
    if (error) toast.error('Save failed');
    else toast.success('Saved');
    setEditingId(null);
    loadCommissions();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Commission Center</h1>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search agent, provider, record ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
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

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Gross</TableHead>
              <TableHead>Agent (55%)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.profiles?.full_name || 'Unknown'} (@{c.subdomain})</TableCell>
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
                <TableCell className="flex gap-2">
                  {c.status === 'pending' && (
                    <Button size="sm" onClick={() => markAsPaid([c.id])}>
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => {
                    setEditingId(c.id);
                    setEditForm(c);
                  }}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    {editingId && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg space-y-4 max-w-md w-full">
      <h3 className="text-xl font-bold">Edit Commission</h3>

      <div>
        <Label>Gross Commission ($)</Label>
        <Input
          type="number"
          step="0.01"
          value={(editForm.gross_commission_cents / 100).toFixed(2)}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            setEditForm({
              ...editForm,
              gross_commission_cents: Math.round(value * 100),
              agent_share_cents: Math.round(value * 100 * 0.55), // auto 55%
            });
          }}
        />
      </div>

      <div>
        <Label>Agent Share (55% auto)</Label>
        <Input
          type="number"
          step="0.01"
          value={(editForm.agent_share_cents / 100).toFixed(2)}
          disabled
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setEditingId(null)}>
          Cancel
        </Button>
        <Button onClick={saveEdit}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  </div>
    )}
    </div>
  );
}