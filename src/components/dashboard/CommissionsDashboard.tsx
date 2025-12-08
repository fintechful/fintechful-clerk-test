// src/components/dashboard/CommissionsDashboard.tsx
'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

const PROVIDER_NAMES: Record<string, string> = {
  moneylion: 'MoneyLion',
  lendflow: 'Lendflow',
  national_debt_relief: 'National Debt Relief',
  upstart: 'Upstart',
  hy_savings: 'HY Savings',
};

type Commission = {
  id: string;
  created_at: string;
  provider: string;
  product_type: string;
  gross_commission_cents: number;
  agent_share_cents: number;
  status: 'pending' | 'paid';
  agent_total_cents: number; // 55% only
};

type Props = {
  profile: {
    full_name: string;
    subdomain: string;
    avatar_url?: string | null;
  };
  commissions: Commission[];
  totals: {
    pending: number;
    paid: number;
    total: number;
  };
};

export default function CommissionsDashboard({ profile, commissions, totals }: Props) {
  const formatMoney = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  const getProviderName = (provider: string) =>
    PROVIDER_NAMES[provider] || provider.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="text-3xl">
            {profile.full_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold">{profile.full_name}</h1>
          <p className="text-xl text-muted-foreground">@{profile.subdomain}</p>
        </div>
      </div>

      {/* Money Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Pending Earnings</CardTitle>
            <Clock className="h-6 w-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-700">
              {formatMoney(totals.pending)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Paid next cycle</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Paid Out</CardTitle>
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-700">
              {formatMoney(totals.paid)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Lifetime Earnings</CardTitle>
            <TrendingUp className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {formatMoney(totals.total)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Your Earnings (55%)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No commissions yet — keep crushing it!
                  </TableCell>
                </TableRow>
              ) : (
                commissions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{format(new Date(c.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="font-medium">
                      {getProviderName(c.provider)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {c.product_type.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatMoney(c.agent_total_cents)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        c.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {c.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}