'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // ← NEW
import { toast } from 'sonner';
import { Upload, Search, CheckCircle2, Trash2, ChevronDown } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { addDays } from 'date-fns';

export function AdminCommissionCenter() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'paid' | 'delete' | ''>('');
  const [editingId, setEditingId] = useState<string | null>(null); // ← NEW: Track row being edited
  const [editValues, setEditValues] = useState<Partial<any>>({}); // ← NEW: Temporary edit values

  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const supabase = createClient();

  const loadCommissions = async () => {
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
        clerk_user_id
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load commissions');
      console.error('Supabase error:', error);
      setCommissions([]);
      return;
    }

    const clerkIds = data.map(c => c.clerk_user_id).filter(Boolean);
    const { data: agents } = await supabase
      .from('profiles')
      .select('clerk_user_id, full_name, subdomain')
      .in('clerk_user_id', clerkIds);

    const agentMap = Object.fromEntries(
      (agents || []).map(a => [a.clerk_user_id, { full_name: a.full_name, subdomain: a.subdomain }])
    );

    const enriched = data.map(c => ({
      ...c,
      agent_name: agentMap[c.clerk_user_id]?.full_name || 'Unknown',
      agent_subdomain: agentMap[c.clerk_user_id]?.subdomain || c.subdomain,
    }));

    setCommissions(enriched);
    setSelectedIds([]);
    setEditingId(null);
    setEditValues({});
  };

  useEffect(() => {
    loadCommissions();
  }, []);

  // Start editing a row
  const startEdit = (commission: any) => {
    setEditingId(commission.id);
    setEditValues({
      provider: commission.provider,
      gross_commission_cents: commission.gross_commission_cents,
      status: commission.status,
    });
  };

  // Save edits
  const saveEdit = async () => {
    if (!editingId) return;

    const original = commissions.find(c => c.id === editingId);
    if (!original) return;

    // Recalculate agent share
    const gross = Number(editValues.gross_commission_cents) || 0;
    const agent_share_cents = Math.round(gross * 0.55);

    const updates = {
      provider: editValues.provider,
      gross_commission_cents: gross,
      agent_share_cents,
      status: editValues.status,
    };

    const { error } = await supabase
      .from('commissions')
      .update(updates)
      .eq('id', editingId);

    if (error) {
      toast.error('Failed to update commission');
    } else {
      toast.success('Commission updated');
      loadCommissions();
    }

    setEditingId(null);
    setEditValues({});
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  // Bulk & single actions (unchanged)
  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  const applyBulkAction = async () => {
    // ... your existing bulk logic (unchanged)
    if (!bulkAction || selectedIds.length === 0) {
      toast.error('Please select an action and at least one commission');
      return;
    }

    const confirmMsg =
      bulkAction === 'paid'
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
      const { error } = await supabase
        .from('commissions')
        .delete()
        .in('id', selectedIds);

      if (error) toast.error('Failed to delete');
      else toast.success(`Deleted ${selectedIds.length} commission(s)`);
    }

    setBulkAction('');
    loadCommissions();
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

  const filtered = commissions.filter(c => {
    const matchesSearch =
      c.agent_subdomain?.toLowerCase().includes(search.toLowerCase()) ||
      c.agent_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase());
    const createdAt = new Date(c.created_at);
    const matchesDate =
      (!dateRange.from || createdAt >= dateRange.from) &&
      (!dateRange.to || createdAt <= addDays(dateRange.to, 1));
    return matchesSearch && matchesDate;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... keep your existing upload logic unchanged
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Commission Center (Super Admin)</h1>

      {/* Toolbar - unchanged except layout */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* ... search, date picker, bulk actions, upload - unchanged ... */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agent or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-80"
          />
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
              <DropdownMenuItem onClick={() => setBulkAction('paid')}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark as Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBulkAction('delete')} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={applyBulkAction}
            disabled={!bulkAction || selectedIds.length === 0}
            variant={bulkAction === 'delete' ? 'destructive' : 'default'}
          >
            Apply ({selectedIds.length})
          </Button>

          {selectedIds.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        <div className="ml-auto">
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
      </div>

      {/* Table with Inline Editing */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={filtered.length > 0 && selectedIds.length === filtered.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
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
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No commissions found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => {
                const isEditing = editingId === c.id;
                const editedGross = editValues.gross_commission_cents ?? c.gross_commission_cents;
                const displayedAgentShare = isEditing
                  ? Math.round(Number(editedGross) * 0.55)
                  : c.agent_share_cents;

                return (
                  <TableRow key={c.id} className={isEditing ? 'bg-muted/50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(c.id)}
                        onCheckedChange={() => toggleSelect(c.id)}
                        disabled={isEditing}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {c.agent_name} (@{c.agent_subdomain})
                    </TableCell>

                    {/* Provider - Editable */}
                    <TableCell onClick={() => !isEditing && startEdit(c)} className="cursor-pointer">
                      {isEditing ? (
                        <Input
                          value={editValues.provider || ''}
                          onChange={(e) => setEditValues({ ...editValues, provider: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          autoFocus
                          className="h-8"
                        />
                      ) : (
                        c.provider
                      )}
                    </TableCell>

                    {/* Gross - Editable */}
                    <TableCell onClick={() => !isEditing && startEdit(c)} className="cursor-pointer">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editValues.gross_commission_cents || ''}
                          onChange={(e) => setEditValues({ ...editValues, gross_commission_cents: Number(e.target.value) })}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="h-8 w-24"
                        />
                      ) : (
                        `$${(c.gross_commission_cents / 100).toFixed(2)}`
                      )}
                    </TableCell>

                    {/* Agent Share - Auto-calculated */}
                    <TableCell className="font-semibold text-green-600">
                      ${ (displayedAgentShare / 100).toFixed(2) }
                    </TableCell>

                    {/* Status - Editable Select */}
                    <TableCell onClick={() => !isEditing && startEdit(c)} className="cursor-pointer">
                      {isEditing ? (
                        <Select
                          value={editValues.status || c.status}
                          onValueChange={(value) => setEditValues({ ...editValues, status: value })}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={c.status === 'paid' ? 'default' : c.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {c.status}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      {c.status === 'pending' && !isEditing && (
                        <Button size="sm" onClick={() => markAsPaid(c.id)}>
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
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
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}