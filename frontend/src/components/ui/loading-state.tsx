import React from "react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  message?: string
  className?: string
  size?: "sm" | "md" | "lg"
  showSpinner?: boolean
}

export function LoadingState({ 
  message = "Préparation en cours...", 
  className,
  size = "md",
  showSpinner = true
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

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

interface RedirectStateProps {
  message?: string
  className?: string
}

export function RedirectState({ 
  message = "Redirection en cours...", 
  className 
}: RedirectStateProps) {
  return (
    <LoadingState
      message={message}
      className={className}
      size="md"
      showSpinner={true}
    />
  )
}
