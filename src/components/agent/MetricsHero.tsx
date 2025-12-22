import { Card } from "@/components/ui/card"
import { DollarSign, TrendingUp, Clock } from "lucide-react"

export function MetricsHero() {
  const metrics = [
    {
      label: "Lifetime Earnings",
      value: "$284,592",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      label: "Paid Last Month",
      value: "$18,247",
      change: "+8.2%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      label: "Pending Commissions",
      value: "$9,814",
      change: "+15.3%",
      icon: Clock,
      trend: "up",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-3xl font-bold text-foreground">{metric.value}</p>
              <p className="text-sm text-primary font-medium">{metric.change} from last month</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <metric.icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
