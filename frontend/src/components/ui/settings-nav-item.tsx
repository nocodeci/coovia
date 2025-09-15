import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SettingsNavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  isActive?: boolean
  className?: string
}

export function SettingsNavItem({ 
  href, 
  icon, 
  children, 
  isActive = false,
  className 
}: SettingsNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200",
        "disabled:pointer-events-none disabled:opacity-50 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "h-11 px-4 py-2 justify-start",
        isActive 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm",
        className
      )}
    >
      <span className="flex h-4 w-4 items-center justify-center">
        {icon}
      </span>
      {children}
    </Link>
  )
}
