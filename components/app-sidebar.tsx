"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Code, Server, Rocket, HeadphonesIcon, BarChart3, Users, Plug } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["Product Manager", "Admin", "Engineer", "Platform"] },
  {
    name: "Product",
    href: "/product",
    icon: Package,
    roles: ["Product Manager", "Admin", "Implementation", "Support"],
  },
  { name: "Engineering", href: "/engineering", icon: Code, roles: ["Engineer", "Admin", "Implementation", "Support"] },
  { name: "Platform", href: "/platform", icon: Server, roles: ["Platform", "Admin", "Implementation", "Support"] },
  {
    name: "Implementation",
    href: "/implementation",
    icon: Rocket,
    roles: ["Product Manager", "Admin", "Engineer", "Platform"],
  },
  {
    name: "Support",
    href: "/support",
    icon: HeadphonesIcon,
    roles: ["Product Manager", "Admin", "Engineer", "Platform"],
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["Product Manager", "Admin", "Engineer", "Platform"],
  },
  {
    name: "Resources",
    href: "/resources",
    icon: Users,
    roles: ["Product Manager", "Admin", "Engineer", "Platform"],
  },
  {
    name: "Integration",
    href: "/integration",
    icon: Plug,
    roles: ["Product Manager", "Admin", "Engineer", "Platform"],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavigation = navigation.filter((item) => {
    if (!user) return true
    return item.roles.includes(user.role)
  })

  return (
    <div className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex flex-col">
          <h1 className="font-sans text-lg font-bold text-sidebar-foreground">NUVIO</h1>
          <p className="text-xs text-sidebar-foreground/60">Product Lifecycle Manager</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border-l-4 border-primary bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm"
                  : "border-l-4 border-transparent text-sidebar-foreground hover:border-primary/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
