import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SettingsCardProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SettingsCard({ 
  title, 
  description, 
  icon, 
  children, 
  className 
}: SettingsCardProps) {
  return (
    <Card className={cn("border-0 shadow-sm hover:shadow-md transition-all duration-200", className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            {icon}
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
