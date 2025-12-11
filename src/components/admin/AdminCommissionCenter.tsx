'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, Search, CheckCircle2, Trash2, ChevronDown } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { addDays, format } from 'date-fns';

const PAGE_SIZE = 50;

export function AdminCommissionCenter() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'paid' | 'delete' | ''>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<any>>({});

  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const supabase = createClient();

  const loadCommissions = useCallback(async (reset = false) => {
    if (!hasMore && !reset) return;
    setLoading(true);

    const from = reset ? 0 : commissions.length;
    const to = from + PAGE_SIZE - 1;

    try {
      let query = supabase
        .from('commissions')
        .select(`
    id,
    created_at,
    provider_record_date,
    paid_at,
    subdomain,
    provider,
    gross_commission_cents,
    agent_share_cents,
    status,
    clerk_user_id
  `)
        .order('created_at', { ascending: false });

      // Filters FIRST - only server-side columns
      if (search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`provider.ilike.${term},subdomain.ilike.${term}`);
      }

      if (dateRange.from) query = query.gte('created_at', dateRange.from.toISOString());
      if (dateRange.to) query = query.lte('created_at', addDays(dateRange.to, 1).toISOString());

      // Range LAST
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        toast.error('Failed to load commissions: ' + error.message);
        console.error('Supabase error:', error);
        setLoading(false);
        return;
      }

      // Enrich agent names
      const clerkIds = data.map((c: any) => c.clerk_user_id).filter(Boolean);
      let enriched = data;

      if (clerkIds.length > 0) {
        const { data: agents } = await supabase
          .from('profiles')
          .select('clerk_user_id, full_name, subdomain')
          .in('clerk_user_id', clerkIds);

        const agentMap = Object.fromEntries(
          (agents || []).map((a: any) => [a.clerk_user_id, { full_name: a.full_name, subdomain: a.subdomain }])
        );

        enriched = data.map((c: any) => ({
          ...c,
          agent_name: agentMap[c.clerk_user_id]?.full_name || 'Unknown',
          agent_subdomain: agentMap[c.clerk_user_id]?.subdomain || c.subdomain || '—',
        }));
      }
      let filtered = enriched;

      // Client-side filter for agent name and subdomain (with or without @)
      if (search.trim()) {
        const term = search.trim().toLowerCase();
        const termNoAt = term.startsWith('@') ? term.slice(1) : term;
        filtered = enriched.filter((c: any) =>
          c.agent_name?.toLowerCase().includes(term) ||
          c.agent_name?.toLowerCase().includes(termNoAt) ||
          c.agent_subdomain?.toLowerCase().includes(term) ||
          c.agent_subdomain?.toLowerCase().includes(termNoAt)
        );
      }

      if (reset) {
        setCommissions(filtered);
      } else {
        // Apply same filter to new batch when appending
        let newFiltered = enriched;
        if (search.trim()) {
          const term = search.trim().toLowerCase();
          const termNoAt = term.startsWith('@') ? term.slice(1) : term;
          newFiltered = enriched.filter((c: any) =>
            c.agent_name?.toLowerCase().includes(term) ||
            c.agent_name?.toLowerCase().includes(termNoAt) ||
            c.agent_subdomain?.toLowerCase().includes(term) ||
            c.agent_subdomain?.toLowerCase().includes(termNoAt)
          );
        }
        setCommissions(prev => [...prev, ...newFiltered]);
      }

      setHasMore(data.length === PAGE_SIZE);
      setLoading(false);
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
      console.error(err);
      setLoading(false);
    }
  }, [commissions.length, dateRange, hasMore, search, supabase]);

  useEffect(() => {
    setCommissions([]);
    setHasMore(true);
    setSelectedIds([]);
    loadCommissions(true);
  }, [search, dateRange]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      loadCommissions();
    }
  }, [loading, hasMore, loadCommissions]);

  const saveEdit = async () => {
    if (!editingId) return;

    const grossDollars = Number(editValues.gross_dollars || 0);
    const grossCents = Math.round(grossDollars * 100);
    const agent_share_cents = Math.round(grossCents * 0.55);

    const updates: any = {
      gross_commission_cents: grossCents,
      agent_share_cents,
    };
    if (editValues.provider !== undefined) updates.provider = editValues.provider;
    if (editValues.status !== undefined) updates.status = editValues.status;

    const { error } = await supabase.from('commissions').update(updates).eq('id', editingId);

    if (error) {
      toast.error('Update failed: ' + error.message);
    } else {
      toast.success('Updated');
      loadCommissions(true);
    }
    setEditingId(null);
    setEditValues({});
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setEditValues({
      provider: c.provider,
      gross_dollars: (c.gross_commission_cents / 100).toFixed(2),
      status: c.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === commissions.length ? [] : commissions.map(c => c.id));

  const applyBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return toast.error('Select action and rows');
    if (!confirm(bulkAction === 'paid' ? `Mark ${selectedIds.length} as paid?` : `Delete ${selectedIds.length} rows?`)) return;

    const { error } = bulkAction === 'paid'
      ? await supabase.from('commissions').update({ status: 'paid', paid_at: new Date() }).in('id', selectedIds)
      : await supabase.from('commissions').delete().in('id', selectedIds);

    if (error) toast.error('Failed: ' + error.message);
    else toast.success(bulkAction === 'paid' ? 'Marked as paid' : 'Deleted');
    setBulkAction('');
    setSelectedIds([]);
    loadCommissions(true);
  };

  const markAsPaid = async (id: string) => {
    const { error } = await supabase.from('commissions').update({ status: 'paid', paid_at: new Date() }).eq('id', id);
    if (error) toast.error('Failed');
    else toast.success('Marked as paid');
    loadCommissions(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Commission Center (Super Admin)</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by provider, agent name, or @subdomain..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-80" />
        </div>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" className="gap-2"><span>Bulk Actions</span><ChevronDown className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setBulkAction('paid')}><CheckCircle2 className="mr-2 h-4 w-4" />Mark as Paid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBulkAction('delete')} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={applyBulkAction} disabled={!bulkAction || selectedIds.length === 0} variant={bulkAction === 'delete' ? 'destructive' : 'default'}>
            Apply ({selectedIds.length})
          </Button>
          {selectedIds.length > 0 && <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>}
        </div>

        <div className="ml-auto">
          <label className="cursor-pointer">
            <Button asChild><div><Upload className="mr-2 h-4 w-4" />Upload CSV</div></Button>
            <input type="file" accept=".csv" onChange={e => {/* your CSV logic */ }} className="hidden" />
          </label>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="table-horizontal-scroll">
          <div className="max-h-[75vh] overflow-y-auto" onScroll={handleScroll}>
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10 border-b">
                <TableRow>
                  <TableHead className="w-12"><Checkbox checked={commissions.length > 0 && selectedIds.length === commissions.length} onCheckedChange={toggleSelectAll} /></TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Provider Date</TableHead>
                  <TableHead>Imported</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Agent (55%)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.length === 0 && !loading && <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground">No commissions found</TableCell></TableRow>}

                {commissions.map(c => {
                  const isEditing = editingId === c.id;
                  const grossDollars = editValues.gross_dollars ?? (c.gross_commission_cents / 100).toFixed(2);
                  const displayedAgentShare = isEditing ? (Number(grossDollars) * 0.55).toFixed(2) : (c.agent_share_cents / 100).toFixed(2);

                  return (
                    <TableRow key={c.id} className={isEditing ? 'bg-muted/50' : ''}>
                      <TableCell><Checkbox checked={selectedIds.includes(c.id)} onCheckedChange={() => toggleSelect(c.id)} disabled={isEditing} /></TableCell>
                      <TableCell className="font-medium">{c.agent_name} (@{c.agent_subdomain})</TableCell>
                      <TableCell>{c.provider_record_date ? format(new Date(c.provider_record_date), 'MMM d, yyyy') : '—'}</TableCell>
                      <TableCell>{format(new Date(c.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell onClick={() => !isEditing && startEdit(c)} className="cursor-pointer">
                        {isEditing ? <Input value={editValues.provider || ''} onChange={e => setEditValues({ ...editValues, provider: e.target.value })} onKeyDown={e => e.key === 'Enter' && saveEdit()} className="h-8" autoFocus /> : c.provider}
                      </TableCell>
                      <TableCell onClick={() => !isEditing && startEdit(c)} className="cursor-pointer">
                        {isEditing ? <Input type="number" step="0.01" value={grossDollars} onChange={e => setEditValues({ ...editValues, gross_dollars: e.target.value })} onKeyDown={e => e.key === 'Enter' && saveEdit()} className="h-8 w-32" /> : `$${(c.gross_commission_cents / 100).toFixed(2)}`}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">${displayedAgentShare}</TableCell>
                      <TableCell onClick={() => !isEditing && startEdit(c)} className="cursor-pointer">
                        {isEditing ? (
                          <Select value={editValues.status || c.status} onValueChange={v => setEditValues({ ...editValues, status: v })}>
                            <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant={c.status === 'paid' ? 'default' : c.status === 'rejected' ? 'destructive' : 'secondary'}>{c.status}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{c.paid_at ? format(new Date(c.paid_at), 'MMM d, yyyy') : '—'}</TableCell>
                      <TableCell>
                        {c.status === 'pending' && !isEditing && <Button size="sm" onClick={() => markAsPaid(c.id)}><CheckCircle2 className="h-4 w-4" /></Button>}
                        {isEditing && <div className="flex gap-1"><Button size="sm" onClick={saveEdit}>Save</Button><Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button></div>}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {loading && <TableRow><TableCell colSpan={10} className="text-center py-8">Loading more...</TableCell></TableRow>}
                {!hasMore && commissions.length > 0 && <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No more commissions</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
