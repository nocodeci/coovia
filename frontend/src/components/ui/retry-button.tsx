import React from "react"
import { AccessibleButton } from "./accessible-button"
import { cn } from "@/lib/utils"

interface RetryButtonProps {
  onRetry: () => void
  loading?: boolean
  error?: boolean
  className?: string
  children?: React.ReactNode
  ariaLabel?: string
}

export function RetryButton({
  onRetry,
  loading = false,
  error = false,
  className,
  children = "Réessayer",
  ariaLabel = "Réessayer l'opération"
}: RetryButtonProps) {
  return (
    <AccessibleButton
      onClick={onRetry}
      loading={loading}
      error={error}
      className={cn(
        "transition-all duration-200",
        error && "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </AccessibleButton>
  )
}

interface ErrorRetrySectionProps {
  title: string
  description: string
  onRetry: () => void
  loading?: boolean
  className?: string
}

export function ErrorRetrySection({
  title,
  description,
  onRetry,
  loading = false,
  className
}: ErrorRetrySectionProps) {
  return (
    <div 
      className={cn(
        "text-center py-8 px-4",
        className
      )}
      role="alert" 
      aria-live="assertive"
    >
      <div className="text-destructive text-lg font-semibold mb-2">
        {title}
      </div>
      <div className="text-muted-foreground mb-4">
        {description}
      </div>
      <RetryButton
        onRetry={onRetry}
        loading={loading}
        error={true}
        ariaLabel={`Réessayer: ${title}`}
      >
        Réessayer
      </RetryButton>
    </div>
  )
}
