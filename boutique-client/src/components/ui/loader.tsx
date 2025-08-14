import * as React from "react"
import { cn } from "../../lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "dots" | "pulse"
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = "md", variant = "spinner", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12"
    }

    const spinnerClasses = cn(
      "animate-spin rounded-full border-2 border-muted border-t-primary",
      sizeClasses[size],
      className
    )

    const dotsClasses = cn(
      "flex space-x-1",
      className
    )

    const pulseClasses = cn(
      "animate-pulse rounded-full bg-primary",
      sizeClasses[size],
      className
    )

    if (variant === "dots") {
      return (
        <div ref={ref} className={dotsClasses} {...props}>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
        </div>
      )
    }

    if (variant === "pulse") {
      return <div ref={ref} className={pulseClasses} {...props} />
    }

    return <div ref={ref} className={spinnerClasses} {...props} />
  }
)
Loader.displayName = "Loader"

export { Loader }

