import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface SettingsToggleProps {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

const SettingsToggle = React.forwardRef<HTMLDivElement, SettingsToggleProps>(
  ({ label, description, checked, onCheckedChange, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer",
        className
      )}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      <div className="space-y-0.5">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  )
)
SettingsToggle.displayName = "SettingsToggle"

export { SettingsToggle }
