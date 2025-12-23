'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { AgentLayout } from '@/components/agent/AgentLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function SMBClientsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [smbReferrals, setSmbReferrals] = useState<any[]>([]);
  const [ongoingCommissions, setOngoingCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      setLoading(false);
      return;
    }

    async function fetchSMBData() {
      const clerk_user_id = user!.id;  // Non-null assertion — safe because we already checked !user

      const { data: smbData } = await supabase
        .from('smb_referrals')
        .select('id, business_name, owner_name, contact_email, contact_phone, business_type, groweasy_tier, city, state')
        .eq('agent_clerk_user_id', clerk_user_id)
        .order('referred_at', { ascending: false });
      setSmbReferrals(smbData || []);

      const { data: ongoingData } = await supabase
        .from('commissions')
        .select('*')
        .eq('clerk_user_id', clerk_user_id)
        .eq('is_recurring', true)
        .order('created_at', { ascending: false });
      setOngoingCommissions(ongoingData || []);

      setLoading(false);
    }

    fetchSMBData();
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return (
      <AgentLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-2xl text-muted-foreground">Loading SMB clients...</p>
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">SMB Clients</h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="text-foreground font-semibold">{smbReferrals.length} Active Clients</span>
          </div>
        </div>

        {/* Referred SMB Businesses Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Referred SMB Businesses</CardTitle>
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
                    <TableHead>GrowEasy Tier</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">Your Share</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ongoingCommissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No ongoing commissions
                      </TableCell>
                    </TableRow>
                  ) : (
                    ongoingCommissions.map((c) => {
                      // Match SMB to get tier
                      const matchedSMB = smbReferrals.find(s =>
                        c.notes?.includes(s.business_name)
                      );

                      return (
                        <TableRow key={c.id}>
                          <TableCell>{format(new Date(c.created_at), 'MM/dd/yy')}</TableCell>
                          <TableCell>{c.notes?.split(' - ')[0] || 'Unknown SMB'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {matchedSMB?.groweasy_tier || 'Basic'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            ${(c.gross_commission_cents / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-primary">
                            ${(c.agent_share_cents / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={c.status === 'paid' ? 'default' : 'secondary'}>
                              {c.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Individual SMB Cards — Subtle Hover Border Highlight */}
        {smbReferrals.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Client Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {smbReferrals.map((smb) => {
                const smbCommissions = ongoingCommissions.filter(c =>
                  c.notes?.includes(smb.business_name)
                );
                const lifetimeEarnings = smbCommissions.reduce((sum, c) => sum + c.agent_share_cents, 0) / 100;

                const isPro = smb.groweasy_tier === 'Pro';

                return (
                  <div
                    key={smb.id}
                    className="group"  // For hover trigger
                  >
                    <Card className={cn(
                      "bg-card border-border transition-all duration-300",
                      "hover:border-primary/70 hover:shadow-lg hover:shadow-primary/10",
                      isPro && "ring-2 ring-yellow-500/30"
                    )}>
                      <CardHeader className={cn(
                        "py-6",
                        isPro ? "bg-gradient-to-r from-yellow-500/10 to-amber-500/10" : "bg-gradient-to-r from-primary/10 to-primary/5"
                      )}>
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                          <CardTitle className="text-foreground text-lg leading-tight">
                            {smb.business_name}
                          </CardTitle>
                          <Badge variant={isPro ? "default" : "secondary"} className={isPro ? "bg-yellow-500 text-yellow-900" : ""}>
                            {smb.groweasy_tier || 'Basic'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Owner</p>
                          <p className="font-medium">{smb.owner_name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <p>{smb.city || '—'}, {smb.state || '—'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
                          {smb.contact_email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <p className="text-sm">{smb.contact_email}</p>
                            </div>
                          )}
                          {smb.contact_phone && (
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <p className="text-sm">{smb.contact_phone}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lifetime Earnings</p>
                          <p className="text-2xl font-bold text-primary">
                            ${lifetimeEarnings.toFixed(0)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AgentLayout>
  );
}