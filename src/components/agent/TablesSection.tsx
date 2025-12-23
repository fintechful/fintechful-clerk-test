'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type TablesSectionProps = {
  commissions: any[];
  payouts: any[];
  referrals: any[];
  smbReferrals: any[];
};

export function TablesSection({
  commissions,
  payouts,
  referrals,
  smbReferrals
}: TablesSectionProps) {
  // Recent Activity — top 10 most recent
  const recentActivity = commissions
    .slice(0, 10)
    .map((c) => ({
      date: format(new Date(c.created_at), 'MM/dd/yy'),
      provider: c.provider,
      gross: `$${(c.gross_commission_cents / 100).toFixed(2)}`,
      share: `$${(c.agent_share_cents / 100).toFixed(2)}`,
      status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
      notes: c.notes || '—',
    }));

  // Ongoing SMB Commissions
  const ongoingSMB = commissions
    .filter(c => c.is_recurring)
    .map((c) => ({
      date: format(new Date(c.created_at), 'MM/dd/yy'),
      smb: c.notes || 'Unknown SMB',
      type: c.recurring_source || 'Subscription',
      share: `$${(c.agent_share_cents / 100).toFixed(2)}`,
      status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
    }));

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Provider</TableHead>
                  <TableHead className="text-muted-foreground">Gross</TableHead>
                  <TableHead className="text-muted-foreground">Your Share</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No recent activity
                    </TableCell>
                  </TableRow>
                ) : (
                  recentActivity.map((activity, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell className="text-foreground font-mono text-sm">{activity.date}</TableCell>
                      <TableCell className="text-foreground">{activity.provider}</TableCell>
                      <TableCell className="text-foreground font-medium">{activity.gross}</TableCell>
                      <TableCell className="text-primary font-semibold">{activity.share}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            activity.status === "Paid" ? "default" : activity.status === "Rejected" ? "destructive" : "secondary"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{activity.notes}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payout History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No payouts yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    payouts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{format(new Date(p.payout_date), 'MM/dd/yy')}</TableCell>
                        <TableCell className="font-semibold text-primary">
                          ${(p.amount_cents / 100).toFixed(2)}
                        </TableCell>
                        <TableCell className="capitalize">
                          {p.method.replace('_', ' ')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Agent Referrals */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Agent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Lifetime Overrides</TableHead>
                    <TableHead>Last Month</TableHead>
                    <TableHead>Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No referred agents yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    referrals.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{r.name}</div>
                            <div className="text-sm text-muted-foreground">{r.username}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${r.lifetime}</TableCell>
                        <TableCell className="text-primary">${r.lastMonth}</TableCell>
                        <TableCell className="text-muted-foreground">${r.pending}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SMB Referrals */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">SMB Referrals</CardTitle>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {smbReferrals.length} Active Clients
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>GrowEasy Tier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {smbReferrals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No SMB referrals yet
                    </TableCell>
                  </TableRow>
                ) : (
                  smbReferrals.map((smb) => (
                    <TableRow key={smb.id}>
                      <TableCell className="font-medium">{smb.business_name}</TableCell>
                      <TableCell>{smb.owner_name || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {smb.contact_email || '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {smb.contact_phone || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{smb.business_type || '—'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {smb.groweasy_tier || 'Basic'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ongoing SMB Commissions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Ongoing SMB Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>SMB</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Your Share</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ongoingSMB.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No ongoing commissions
                    </TableCell>
                  </TableRow>
                ) : (
                  ongoingSMB.map((commission, i) => (
                    <TableRow key={i}>
                      <TableCell>{commission.date}</TableCell>
                      <TableCell>{commission.smb}</TableCell>
                      <TableCell className="text-muted-foreground">{commission.type}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {commission.share}
                      </TableCell>
                      <TableCell>
                        <Badge variant={commission.status === 'Paid' ? 'default' : 'secondary'}>
                          {commission.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}