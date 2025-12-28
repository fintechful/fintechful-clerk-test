"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
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
    {
      icon: Settings,
      label: "Settings",
      href: "/agent/settings",
      subItems: [
        { label: "Public Profile", href: "/agent/settings/profile" },
        // Add more settings sub-pages later if needed
      ],
    },
  ];

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
          const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href))
          const hasSubItems = !!item.subItems
          const [isOpen, setIsOpen] = useState(isActive) // Open if active sub-item

          return (
            <div key={item.label} className="space-y-1">
              <button
                onClick={() => hasSubItems && setIsOpen(!isOpen)}
                className={cn(
                  "w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
                  isActive && "bg-primary text-primary-foreground font-bold shadow-md",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.comingSoon && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Soon</span>
                      )}
                      {hasSubItems && (
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                      )}
                    </div>
                  </span>
                )}
              </button>

              {/* Submenu Dropdown */}
              {hasSubItems && !collapsed && (
                <div className={cn(
                  "ml-8 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}>
                  {item.subItems.map((sub) => {
                    const isSubActive = pathname === sub.href
                    return (
                      <Link key={sub.label} href={sub.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground",
                            isSubActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          )}
                        >
                          <span className="ml-2">{sub.label}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
