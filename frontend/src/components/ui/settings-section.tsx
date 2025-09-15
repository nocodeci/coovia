import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SettingsSectionProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
  iconColor?: string
}

export function SettingsSection({ 
  title, 
  description, 
  icon, 
  children, 
  className,
  iconColor = "primary"
}: SettingsSectionProps) {
  const iconBgColors = {
    primary: "bg-primary/10",
    emerald: "bg-emerald-100 dark:bg-emerald-900/20",
    red: "bg-red-100 dark:bg-red-900/20",
    cyan: "bg-cyan-100 dark:bg-cyan-900/20",
    violet: "bg-violet-100 dark:bg-violet-900/20",
    amber: "bg-amber-100 dark:bg-amber-900/20",
  }

  const iconTextColors = {
    primary: "text-primary",
    emerald: "text-emerald-600 dark:text-emerald-400",
    red: "text-red-600 dark:text-red-400",
    cyan: "text-cyan-600 dark:text-cyan-400",
    violet: "text-violet-600 dark:text-violet-400",
    amber: "text-amber-600 dark:text-amber-400",
  }

  return (
    <Card className={cn("border-0 shadow-sm hover:shadow-md transition-all duration-200", className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            iconBgColors[iconColor as keyof typeof iconBgColors] || iconBgColors.primary
          )}>
            <div className={cn(
              "h-4 w-4",
              iconTextColors[iconColor as keyof typeof iconTextColors] || iconTextColors.primary
            )}>
              {icon}
            </div>
          </div>
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  )
}