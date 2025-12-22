"use client"

import { AgentLayout } from '@/components/agent/AgentLayout';
import { GamificationBadge } from "@/components/agent/GamificationBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"

const smbReferrals = [
  { business: "Acme Corp", owner: "John Smith", contact: "john@acmecorp.com", type: "Enterprise" },
  { business: "Tech Solutions LLC", owner: "Jane Doe", contact: "jane@techsolutions.com", type: "Professional" },
  { business: "Green Energy Co", owner: "Robert Brown", contact: "robert@greenenergy.com", type: "Enterprise" },
  { business: "Digital Marketing Pro", owner: "Maria Garcia", contact: "maria@digitalmkt.com", type: "Starter" },
  { business: "Consulting Group", owner: "James Wilson", contact: "james@consultgroup.com", type: "Professional" },
]

const smbCommissions = [
  { date: "2024-01-15", smb: "Acme Corp", type: "Monthly Recurring", share: 450, status: "Paid" },
  { date: "2024-01-12", smb: "Tech Solutions LLC", type: "Setup Fee", share: 1200, status: "Paid" },
  { date: "2024-01-10", smb: "Green Energy Co", type: "Monthly Recurring", share: 380, status: "Pending" },
  { date: "2024-01-08", smb: "Digital Marketing Pro", type: "Monthly Recurring", share: 150, status: "Paid" },
  { date: "2024-01-05", smb: "Consulting Group", type: "Upgrade Fee", share: 850, status: "Pending" },
]

export default function SMBClientsPage() {

  return (
    <AgentLayout>
    <div className="dark min-h-screen bg-background">

        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">SMB Clients</h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-foreground font-semibold">{smbReferrals.length} Active Clients</span>
            </div>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Referred SMB Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Business Name</TableHead>
                    <TableHead className="text-muted-foreground">Owner</TableHead>
                    <TableHead className="text-muted-foreground">Contact</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smbReferrals.map((smb, idx) => (
                    <TableRow key={idx} className="border-border">
                      <TableCell className="text-foreground font-medium">{smb.business}</TableCell>
                      <TableCell className="text-foreground">{smb.owner}</TableCell>
                      <TableCell className="text-muted-foreground">{smb.contact}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            smb.type === "Enterprise"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : smb.type === "Professional"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }
                        >
                          {smb.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Ongoing SMB Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">SMB</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground text-right">Your Share</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smbCommissions.map((item, idx) => (
                    <TableRow key={idx} className="border-border">
                      <TableCell className="text-foreground">{item.date}</TableCell>
                      <TableCell className="text-foreground">{item.smb}</TableCell>
                      <TableCell className="text-muted-foreground">{item.type}</TableCell>
                      <TableCell className="text-foreground text-right font-semibold">
                        ${item.share.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === "Paid" ? "default" : "secondary"}
                          className={
                            item.status === "Paid"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>


      <GamificationBadge rank={12} total={25} tier="Silver" />
    </div>
    </AgentLayout>
  )
}
