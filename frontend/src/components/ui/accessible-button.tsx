import React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  success?: boolean
  successText?: string
  error?: boolean
  errorText?: string
  children: React.ReactNode
}

export function AccessibleButton({
  loading = false,
  loadingText = "Préparation...",
  success = false,
  successText = "Succès",
  error = false,
  errorText = "Erreur",
  children,
  className,
  disabled,
  ...props
}: AccessibleButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Button
      className={cn(
        loading && "opacity-75 cursor-not-allowed",
        success && "bg-green-600 hover:bg-green-700",
        error && "bg-red-600 hover:bg-red-700",
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-live={loading ? "polite" : "off"}
      {...props}
    >
      {loading ? (
        <>
          <span className="sr-only">{loadingText}</span>
          <div className="flex items-center gap-2">
            <div 
              className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span>{loadingText}</span>
          </div>
        </>
      ) : success ? (
        <>
          <span className="sr-only">{successText}</span>
          <div className="flex items-center gap-2">
            <svg 
              className="h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successText}</span>
          </div>
        </>
      ) : error ? (
        <>
          <span className="sr-only">{errorText}</span>
          <div className="flex items-center gap-2">
            <svg 
              className="h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{errorText}</span>
          </div>
        </>
      ) : (
        children
      )}
    </Button>
  )
}
