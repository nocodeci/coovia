import React from 'react'
import { useDataLoading } from '@/context/data-loading-context'
import { OptimizedLoading } from '@/components/optimized-loading'
import { cn } from '@/lib/utils'

interface DataLoadingOverlayProps {
  className?: string
  position?: 'fixed' | 'absolute'
  zIndex?: number
}

export function DataLoadingOverlay({ 
  className,
  position = 'fixed',
  zIndex = 50
}: DataLoadingOverlayProps) {
  const { hasAnyLoading, getGlobalLoadingState } = useDataLoading()
  const globalState = getGlobalLoadingState()

  if (!hasAnyLoading || !globalState.isLoading) {
    return null
  }

  return (
    <div 
      className={cn(
        position === 'fixed' ? 'fixed inset-0' : 'absolute inset-0',
        'bg-background/80 backdrop-blur-sm',
        'flex items-center justify-center',
        'transition-all duration-300 ease-in-out',
        className
      )}
      style={{ zIndex }}
    >
      <div className="bg-card/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-border/20">
        <OptimizedLoading 
          type={globalState.type || 'spinner'} 
          message={globalState.message || 'Chargement des données...'} 
        />
      </div>
    </div>
  )
}

// Composant spécialisé pour les sections de contenu
export function ContentLoadingOverlay({ 
  className,
  children 
}: { 
  className?: string
  children: React.ReactNode 
}) {
  const { hasAnyLoading, getGlobalLoadingState } = useDataLoading()
  const globalState = getGlobalLoadingState()

  return (
    <div className={cn('relative', className)}>
      {children}
      {hasAnyLoading && globalState.isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="bg-card/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-border/20">
            <OptimizedLoading 
              type={globalState.type || 'spinner'} 
              message={globalState.message || 'Chargement...'} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Composant pour afficher un indicateur de chargement discret
export function LoadingIndicator({ 
  className,
  size = 'sm'
}: { 
  className?: string
  size?: 'sm' | 'md' | 'lg' 
}) {
  const { hasAnyLoading } = useDataLoading()

  if (!hasAnyLoading) {
    return null
  }

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        sizeClasses[size],
        'bg-primary rounded-full animate-pulse'
      )} />
    </div>
  )
}
