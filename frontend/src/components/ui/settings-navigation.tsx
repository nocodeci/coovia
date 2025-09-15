import * as React from "react"
import { cn } from "@/lib/utils"
import { SettingsNavItem } from "./settings-nav-item"
import { IconSettings, IconUser, IconTool } from "@tabler/icons-react"

interface SettingsNavigationProps {
  currentPath?: string
  className?: string
}

const navigationItems = [
  {
    href: "/settings/store",
    icon: <IconSettings className="h-4 w-4" />,
    label: "Paramètres de la boutique"
  },
  {
    href: "/settings/account", 
    icon: <IconUser className="h-4 w-4" />,
    label: "Paramètres du compte"
  },
  {
    href: "/settings/advanced",
    icon: <IconTool className="h-4 w-4" />,
    label: "Paramètres avancés"
  }
]

export function SettingsNavigation({ currentPath, className }: SettingsNavigationProps) {
  return (
    <div 
      className={cn(
        "relative bg-background w-full min-w-40 px-4 py-6",
        "rounded-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300",
        "bg-gradient-to-br from-background via-background to-muted/10",
        "backdrop-blur-sm",
        className
      )}
    >
      <nav className="flex flex-col space-y-2">
        {navigationItems.map((item) => (
          <SettingsNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            isActive={currentPath === item.href}
          >
            {item.label}
          </SettingsNavItem>
        ))}
      </nav>
    </div>
  )
}
