import * as React from "react"
import { cn } from "@/lib/utils"

interface SettingsSidebarProps {
  children: React.ReactNode
  className?: string
}

export function SettingsSidebar({ children, className }: SettingsSidebarProps) {
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
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}
