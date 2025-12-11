// src/components/admin/AdminCommissionCenter.tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox'; // ← NEW
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // ← NEW
import { toast } from 'sonner';
import { Upload, Search, CheckCircle2, Trash2, ChevronDown } from 'lucide-react'; // ← Added Trash2, ChevronDown
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { addDays } from 'date-fns';

export function AdminCommissionCenter() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // ← NEW: Track selected rows
  const [bulkAction, setBulkAction] = useState<'paid' | 'delete' | ''>(''); // ← NEW
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
    setSelectedIds([]); // Clear selection on reload
  };

  useEffect(() => {
    loadCommissions();
  }, []);

  // Toggle single row
  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Select/deselect all visible (filtered) rows
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  // Bulk apply action
  const applyBulkAction = async () => {
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

      if (error) {
        toast.error('Failed to mark as paid');
      } else {
        toast.success(`Marked ${selectedIds.length} as paid`);
      }
    } else if (bulkAction === 'delete') {
      const { error } = await supabase
        .from('commissions')
        .delete()
        .in('id', selectedIds);

      if (error) {
        toast.error('Failed to delete');
      } else {
        toast.success(`Deleted ${selectedIds.length} commission(s)`);
      }
    }

    setBulkAction('');
    loadCommissions();
  };

  // Existing single mark as paid
  const markAsPaid = async (id: string) => {
    const { error } = await supabase
      .from('commissions')
      .update({ status: 'paid', paid_at: new Date() })
      .eq('id', id);
    if (error) toast.error('Failed to mark as paid');
    else toast.success('Marked as paid');
    loadCommissions();
  };

  // Filtering logic (unchanged)
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

  // Existing CSV upload (unchanged)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... your existing upload logic (unchanged)
    // (I've omitted it here for brevity, but keep it exactly as is)
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Commission Center (Super Admin)</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center">
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

        {/* Bulk Actions */}
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

      {/* Table */}
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
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(c.id)}
                      onCheckedChange={() => toggleSelect(c.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {c.agent_name} (@{c.agent_subdomain})
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