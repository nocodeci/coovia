import React from 'react'
import { useDataLoading } from '@/context/data-loading-context'
import { OptimizedLoading } from '@/components/optimized-loading'
import { useLoadingZIndex } from '@/hooks/use-z-index'
import { cn } from '@/lib/utils'

interface DataLoadingOverlayProps {
  className?: string
  position?: 'fixed' | 'absolute'
  zIndex?: number
  blurIntensity?: 'none' | 'sm' | 'md' | 'lg'
  blockInteraction?: boolean
}

export function DataLoadingOverlay({ 
  className,
  position = 'fixed',
  zIndex,
  blurIntensity = 'md',
  blockInteraction = true
}: DataLoadingOverlayProps) {
  const { getGlobalLoadingState } = useDataLoading()
  const globalState = getGlobalLoadingState()
  
  // Z-index intelligent selon le type
  const smartZIndex = useLoadingZIndex('overlay')

  // Centralisation du calcul du loading
  const isLoading = globalState.isLoading

  if (!isLoading) {
    return null
  }

  // Configuration du blur selon l'intensité
  const blurClasses = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  }

  return (
    <div 
      className={cn(
        position === 'fixed' ? 'fixed inset-0' : 'absolute inset-0',
        'bg-background/80',
        blurClasses[blurIntensity],
        'flex items-center justify-center',
        'transition-all duration-300 ease-in-out',
        blockInteraction ? 'pointer-events-auto' : 'pointer-events-none',
        className
      )}
      style={{ zIndex: zIndex ?? smartZIndex }}
      role="alert"
      aria-live="assertive"
      aria-label="Préparation en cours"
    >
      <div className="bg-card/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-border/20">
        <OptimizedLoading 
          type={globalState.type || 'spinner'} 
          message={globalState.message || 'Préparation des données...'} 
        />
      </div>
    </div>
  )
}

// Composant spécialisé pour les sections de contenu
export function ContentLoadingOverlay({ 
  className,
  children,
  blurIntensity = 'sm',
  blockInteraction = true
}: { 
  className?: string
  children: React.ReactNode
  blurIntensity?: 'none' | 'sm' | 'md' | 'lg'
  blockInteraction?: boolean
}) {
  const { getGlobalLoadingState } = useDataLoading()
  const globalState = getGlobalLoadingState()

  // Centralisation du calcul du loading
  const isLoading = globalState.isLoading

  // Configuration du blur selon l'intensité
  const blurClasses = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div 
          className={cn(
            'absolute inset-0 bg-background/60 rounded-xl flex items-center justify-center',
            blurClasses[blurIntensity],
            blockInteraction ? 'pointer-events-auto' : 'pointer-events-none'
          )}
          role="alert"
          aria-live="polite"
          aria-label="Préparation de la section"
        >
          <div className="bg-card/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-border/20">
            <OptimizedLoading 
              type={globalState.type || 'spinner'} 
              message={globalState.message || 'Préparation...'} 
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
  size = 'sm',
  showText = false
}: { 
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}) {
  const { getGlobalLoadingState } = useDataLoading()
  const globalState = getGlobalLoadingState()

  // Centralisation du calcul du loading
  const isLoading = globalState.isLoading

  if (!isLoading) {
    return null
  }

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div 
      className={cn('flex items-center justify-center gap-2', className)}
      role="status"
      aria-live="polite"
      aria-label={showText ? globalState.message || 'Préparation...' : 'Préparation en cours'}
    >
      <div className={cn(
        sizeClasses[size],
        'bg-primary rounded-full animate-pulse'
      )} />
      {showText && (
        <span className="text-sm text-muted-foreground">
          {globalState.message || 'Préparation...'}
        </span>
      )}
    </div>
  )
}
