import React from "react"
import { Skeleton } from "./skeleton"
import { cn } from "@/lib/utils"

interface AccessibleSkeletonProps {
  className?: string
  children?: React.ReactNode
  ariaLabel?: string
  showContent?: boolean
}

export function AccessibleSkeleton({ 
  className, 
  children, 
  ariaLabel = "Préparation en cours",
  showContent = false 
}: AccessibleSkeletonProps) {
  return (
    <div 
      className={cn("relative", className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <Skeleton className={cn("animate-pulse", className)} />
      {showContent && children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  )
}

export function AccessibleTableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-label="Préparation du tableau">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <AccessibleSkeleton className="h-8 w-48" ariaLabel="Préparation du titre" />
        <AccessibleSkeleton className="h-10 w-32" ariaLabel="Préparation du bouton" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <div className="border-b p-4">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <AccessibleSkeleton 
                key={i} 
                className="h-4 w-20" 
                ariaLabel={`Chargement de la colonne ${i + 1}`} 
              />
            ))}
          </div>
        </div>
        
        {/* Table rows skeleton */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b p-4 last:border-b-0">
            <div className="grid grid-cols-6 gap-4">
              <div className="flex items-center space-x-3">
                <AccessibleSkeleton className="h-10 w-10 rounded" ariaLabel="Préparation de l'image" />
                <div className="space-y-1">
                  <AccessibleSkeleton className="h-4 w-32" ariaLabel="Préparation du nom" />
                  <AccessibleSkeleton className="h-3 w-20" ariaLabel="Préparation de la description" />
                </div>
              </div>
              {Array.from({ length: columns - 1 }).map((_, colIndex) => (
                <AccessibleSkeleton 
                  key={colIndex} 
                  className="h-4 w-20" 
                  ariaLabel={`Chargement de la cellule ${rowIndex + 1}, ${colIndex + 2}`} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <AccessibleSkeleton className="h-4 w-32" ariaLabel="Préparation des informations de pagination" />
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <AccessibleSkeleton 
              key={i} 
              className="h-8 w-8" 
              ariaLabel={`Chargement du bouton de pagination ${i + 1}`} 
            />
          ))}
        </div>
      </div>
      
      <span className="sr-only">Préparation du tableau en cours, veuillez patienter</span>
    </div>
  )
}
