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

    // APPLY FILTERS FIRST
    if (search) {
      query = query.or(`provider.ilike.%${search}%,subdomain.ilike.%${search}%`);
    }
    if (dateRange.from) {
      query = query.gte('created_at', dateRange.from.toISOString());
    }
    if (dateRange.to) {
      query = query.lte('created_at', addDays(dateRange.to, 1).toISOString());
    }

    // RANGE LAST
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) {
      toast.error('Failed to load commissions');
      console.error(error);
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
        agent_subdomain: agentMap[c.clerk_user_id]?.subdomain || c.subdomain,
      }));
    }

    if (reset) {
      setCommissions(enriched);
    } else {
      setCommissions(prev => [...prev, ...enriched]);
    }

    setHasMore(data.length === PAGE_SIZE);
    setLoading(false);
  }, [commissions.length, dateRange, hasMore, search, supabase]);

  useEffect(() => {
    setCommissions([]);
    setHasMore(true);
    loadCommissions(true);
  }, [search, dateRange, loadCommissions]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      loadCommissions();
    }
  }, [loading, hasMore, loadCommissions]);

  // Existing functions (unchanged)
  const startEdit = (commission: any) => {
    setEditingId(commission.id);
    setEditValues({
      provider: commission.provider,
      gross_dollars: (commission.gross_commission_cents / 100).toFixed(2),
      status: commission.status,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const original = commissions.find(c => c.id === editingId);
    if (!original) return;

    const grossDollars = Number(editValues.gross_dollars ?? original.gross_commission_cents / 100);
    const grossCents = Math.round(grossDollars * 100);
    const agent_share_cents = Math.round(grossCents * 0.55);

    const updates = {
      provider: editValues.provider ?? original.provider,
      gross_commission_cents: grossCents,
      agent_share_cents,
      status: editValues.status ?? original.status,
    };

    const { error } = await supabase.from('commissions').update(updates).eq('id', editingId);

    if (error) {
      toast.error('Failed to update commission');
    } else {
      toast.success('Commission updated');
      loadCommissions(true); // Refresh from start to keep order
    }

    setEditingId(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === commissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(commissions.map(c => c.id));
    }
  };

  const applyBulkAction = async () => {
    // ... your bulk logic (unchanged)
    // (kept full for completeness)
    if (!bulkAction || selectedIds.length === 0) {
      toast.error('Please select an action and at least one commission');
      return;
    }

    const confirmMsg = bulkAction === 'paid'
      ? `Mark ${selectedIds.length} commission(s) as paid?`
      : `Permanently delete ${selectedIds.length} commission(s)? This cannot be undone.`;

    if (!confirm(confirmMsg)) return;

    if (bulkAction === 'paid') {
      const { error } = await supabase
        .from('commissions')
        .update({ status: 'paid', paid_at: new Date() })
        .in('id', selectedIds);
      if (error) toast.error('Failed to mark as paid');
      else toast.success(`Marked ${selectedIds.length} as paid`);
    } else if (bulkAction === 'delete') {
      const { error } = await supabase.from('commissions').delete().in('id', selectedIds);
      if (error) toast.error('Failed to delete');
      else toast.success(`Deleted ${selectedIds.length} commission(s)`);
    }

    setBulkAction('');
    loadCommissions(true);
  };

  const markAsPaid = async (id: string) => {
    const { error } = await supabase
      .from('commissions')
      .update({ status: 'paid', paid_at: new Date() })
      .eq('id', id);
    if (error) toast.error('Failed to mark as paid');
    else toast.success('Marked as paid');
    loadCommissions(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep your existing upload logic
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Commission Center (Super Admin)</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search agent or provider..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-80" />
        </div>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span>Bulk Actions</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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
            <Button asChild>
              <div><Upload className="mr-2 h-4 w-4" />Upload CSV</div>
            </Button>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="rounded-lg border bg-card">
        <div className="max-h-[75vh] overflow-y-auto" onScroll={handleScroll}>
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10 border-b">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={commissions.length > 0 && selectedIds.length === commissions.length} onCheckedChange={toggleSelectAll} />
                </TableHead>
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
              {commissions.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">No commissions found</TableCell>
                </TableRow>
              )}
              {commissions.map((c) => {
                const isEditing = editingId === c.id;
                const grossDollars = editValues.gross_dollars ?? (c.gross_commission_cents / 100).toFixed(2);
                const displayedAgentShare = isEditing
                  ? (Number(grossDollars) * 0.55).toFixed(2)
                  : (c.agent_share_cents / 100).toFixed(2);

                return (
                  <TableRow key={c.id} className={isEditing ? 'bg-muted/50' : ''}>
                    <TableCell>
                      <Checkbox checked={selectedIds.includes(c.id)} onCheckedChange={() => toggleSelect(c.id)} disabled={isEditing} />
                    </TableCell>
                    <TableCell className="font-medium">{c.agent_name} (@{c.agent_subdomain})</TableCell>
                    <TableCell>{c.provider_record_date ? format(new Date(c.provider_record_date), 'MMM d, yyyy') : '-'}</TableCell>
                    <TableCell>{format(new Date(c.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell onClick={() => !isEditing && startEdit(c)} className="cursor-pointer">
                      {isEditing ? (
                        <Input value={editValues.provider || ''} onChange={(e) => setEditValues({ ...editValues, provider: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} className="h-8" autoFocus />
                      ) : c.provider}
                    </TableCell>
                    <TableCell onClick={() => !isEditing && startEdit(c)} className="cursor-pointer">
                      {isEditing ? (
                        <Input type="number" step="0.01" value={grossDollars} onChange={(e) => setEditValues({ ...editValues, gross_dollars: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} className="h-8 w-32" />
                      ) : `$${(c.gross_commission_cents / 100).toFixed(2)}`}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">${displayedAgentShare}</TableCell>
                    <TableCell onClick={() => !isEditing && startEdit(c)} className="cursor-pointer">
                      {isEditing ? (
                        <Select value={editValues.status || c.status} onValueChange={(v) => setEditValues({ ...editValues, status: v })}>
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
                    <TableCell>{c.paid_at ? format(new Date(c.paid_at), 'MMM d, yyyy') : '-'}</TableCell>
                    <TableCell>
                      {c.status === 'pending' && !isEditing && (
                        <Button size="sm" onClick={() => markAsPaid(c.id)}><CheckCircle2 className="h-4 w-4" /></Button>
                      )}
                      {isEditing && (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={saveEdit}>Save</Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {loading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">Loading more...</TableCell>
                </TableRow>
              )}
              {!hasMore && commissions.length > 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No more commissions</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}