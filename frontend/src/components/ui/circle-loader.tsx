import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CircleLoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  message?: string
}

export function CircleLoader({ 
  size = "md", 
  className,
  message = "Préparation en cours..." 
}: CircleLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="text-center space-y-3">
        <div className="relative">
          <Loader2 className={cn(
            sizeClasses[size], 
            "animate-spin text-primary mx-auto"
          )} />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        </div>
        {message && (
          <p className="text-muted-foreground text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  )
} 