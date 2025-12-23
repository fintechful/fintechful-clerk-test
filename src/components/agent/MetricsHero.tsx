import { Card } from "@/components/ui/card"
import { DollarSign, TrendingUp, Clock } from "lucide-react"

type MetricsHeroProps = {
  commissions: any[];
};

export function MetricsHero({ commissions }: MetricsHeroProps) {
  // Lifetime Earnings
  const lifetimeEarnings = commissions.reduce((sum, c) => sum + c.agent_share_cents, 0) / 100;

  // Pending Commissions
  const pendingEarnings = commissions
    .filter(c => c.status !== 'paid')
    .reduce((sum, c) => sum + c.agent_share_cents, 0) / 100;

  // Paid Last Month
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const lastMonthPaid = commissions
    .filter(c => {
      const date = new Date(c.paid_at || c.created_at);
      return c.status === 'paid' && date >= oneMonthAgo;
    })
    .reduce((sum, c) => sum + c.agent_share_cents, 0) / 100;

  const metrics = [
    {
      label: "Lifetime Earnings",
      value: lifetimeEarnings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      label: "Paid Last Month",
      value: lastMonthPaid.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      change: "+8.2%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      label: "Pending Commissions",
      value: pendingEarnings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      change: "+15.3%",
      icon: Clock,
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-3xl font-bold text-foreground">
                ${metric.value}
              </p>
              <p className="text-sm text-primary font-medium">{metric.change} from last month</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <metric.icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}