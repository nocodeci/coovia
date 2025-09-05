import { cn } from "@/lib/utils"

interface FullPageLoaderProps {
  message: string
  className?: string
  showSpinner?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8", 
  lg: "h-12 w-12"
}

export function FullPageLoader({ 
  message, 
  className,
  showSpinner = true,
  size = "md"
}: FullPageLoaderProps) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center", className)}>
      <div className="text-center">
        {showSpinner && (
          <div 
            className={cn(
              "animate-spin rounded-full border-b-2 border-primary mx-auto mb-4",
              sizeClasses[size]
            )}
            aria-hidden="true"
          />
        )}
        <p 
          className="text-neutral-600" 
          aria-live="polite"
          role="status"
          aria-label={message}
        >
          {message}
        </p>
      </div>
    </div>
  )
}
