import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TablesSection() {
  const recentActivity = [
    { date: "2024-01-15", provider: "Provider A", gross: "$5,200", share: "$2,600", status: "Paid", notes: "Q4 2023" },
    {
      date: "2024-01-12",
      provider: "Provider B",
      gross: "$3,800",
      share: "$1,900",
      status: "Pending",
      notes: "Policy #12345",
    },
    { date: "2024-01-08", provider: "Provider C", gross: "$4,100", share: "$2,050", status: "Paid", notes: "Renewal" },
    {
      date: "2024-01-05",
      provider: "Provider D",
      gross: "$2,900",
      share: "$1,450",
      status: "Processing",
      notes: "New client",
    },
  ]

  const payoutHistory = [
    { date: "2024-01-01", amount: "$18,247", method: "Direct Deposit" },
    { date: "2023-12-01", amount: "$16,832", method: "Direct Deposit" },
    { date: "2023-11-01", amount: "$19,421", method: "Direct Deposit" },
    { date: "2023-10-01", amount: "$17,654", method: "Direct Deposit" },
  ]

  const agentReferrals = [
    { name: "Sarah Johnson", username: "@sjohnson", lifetime: "$42,150", lastMonth: "$3,420", pending: "$1,280" },
    { name: "Mike Davis", username: "@mdavis", lifetime: "$38,920", lastMonth: "$2,910", pending: "$980" },
    { name: "Emily Chen", username: "@echen", lifetime: "$31,400", lastMonth: "$2,150", pending: "$750" },
  ]

  const smbReferrals = [
    { business: "Tech Solutions Inc", owner: "John Smith", contact: "john@techsolutions.com", type: "Group Health" },
    { business: "Green Consulting LLC", owner: "Amy Green", contact: "amy@greenconsult.com", type: "Benefits Package" },
    { business: "Metro Services Co", owner: "Robert Lee", contact: "robert@metro.com", type: "Workers Comp" },
  ]

  const ongoingSMB = [
    { date: "2024-01-15", smb: "Tech Solutions Inc", type: "Monthly Premium", share: "$840", status: "Active" },
    { date: "2024-01-15", smb: "Green Consulting LLC", type: "Monthly Premium", share: "$620", status: "Active" },
    { date: "2024-01-15", smb: "Metro Services Co", type: "Monthly Premium", share: "$710", status: "Active" },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
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
              {recentActivity.map((activity, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell className="text-foreground font-mono text-sm">{activity.date}</TableCell>
                  <TableCell className="text-foreground">{activity.provider}</TableCell>
                  <TableCell className="text-foreground font-medium">{activity.gross}</TableCell>
                  <TableCell className="text-primary font-semibold">{activity.share}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        activity.status === "Paid" ? "default" : activity.status === "Pending" ? "secondary" : "outline"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{activity.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutHistory.map((payout, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell className="text-foreground font-mono text-sm">{payout.date}</TableCell>
                    <TableCell className="text-primary font-semibold">{payout.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{payout.method}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Agent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Lifetime</TableHead>
                  <TableHead className="text-muted-foreground">Last Month</TableHead>
                  <TableHead className="text-muted-foreground">Pending</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentReferrals.map((agent, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell>
                      <div>
                        <div className="text-foreground font-medium">{agent.name}</div>
                        <div className="text-muted-foreground text-sm">{agent.username}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground font-medium">{agent.lifetime}</TableCell>
                    <TableCell className="text-primary">{agent.lastMonth}</TableCell>
                    <TableCell className="text-muted-foreground">{agent.pending}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

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
              {smbReferrals.map((smb, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell className="text-foreground font-medium">{smb.business}</TableCell>
                  <TableCell className="text-foreground">{smb.owner}</TableCell>
                  <TableCell className="text-muted-foreground">{smb.contact}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{smb.type}</Badge>
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
                <TableHead className="text-muted-foreground">Your Share</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ongoingSMB.map((commission, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell className="text-foreground font-mono text-sm">{commission.date}</TableCell>
                  <TableCell className="text-foreground">{commission.smb}</TableCell>
                  <TableCell className="text-muted-foreground">{commission.type}</TableCell>
                  <TableCell className="text-primary font-semibold">{commission.share}</TableCell>
                  <TableCell>
                    <Badge variant="default">{commission.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
