"use client"

import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  DollarSign,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/agent/dashboard" },
    { icon: DollarSign, label: "Earnings", href: "/agent/earnings" },
    { icon: Users, label: "Agent Referrals", href: "/agent/agent-referrals" },
    { icon: Building2, label: "SMB Clients", href: "/agent/smb-clients" },
    { icon: TrendingUp, label: "GrowEasy", href: "/agent/groweasy", comingSoon: true },
    { icon: BarChart3, label: "Analytics", href: "/agent/analytics", comingSoon: true },
    { icon: FileText, label: "Reports", href: "/agent/reports" },
    { icon: Settings, label: "Settings", href: "/agent/settings" },
  ]

  return (
    <aside className={cn(
      "h-full flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">FinTechful</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.label} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent relative",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  collapsed && "justify-center",
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="flex items-center justify-between w-full">
                    {item.label}
                    {item.comingSoon && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Soon</span>
                    )}
                  </span>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
