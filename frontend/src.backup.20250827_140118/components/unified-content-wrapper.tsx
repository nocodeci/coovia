import React, { ReactNode } from 'react'
import { useUnifiedDataLoading, useUnifiedListLoading } from '@/hooks/useUnifiedDataLoading'
import { OptimizedLoading } from '@/components/optimized-loading'
import { DataLoadingOverlay } from '@/components/data-loading-overlay'

interface UnifiedContentWrapperProps<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  cacheKey: string
  resourceKey: string
  cacheTtl?: number
  skeleton: ReactNode
  children: ReactNode
  emptyState?: ReactNode
  errorState?: ReactNode
  type?: "content" | "list"
  loadingMessage?: string
  loadingType?: 'spinner' | 'skeleton'
  showGlobalOverlay?: boolean
}

export function UnifiedContentWrapper<T>({
  data,
  isLoading,
  error,
  cacheKey,
  resourceKey,
  cacheTtl,
  skeleton,
  children,
  emptyState,
  errorState,
  type = "content",
  loadingMessage,
  loadingType,
  showGlobalOverlay = true
}: UnifiedContentWrapperProps<T>) {
  const hook = type === "list" 
    ? useUnifiedListLoading({ 
        data: data as any, 
        isLoading, 
        error, 
        cacheKey, 
        cacheTtl,
        resourceKey,
        loadingMessage,
        loadingType
      })
    : useUnifiedDataLoading({ 
        data, 
        isLoading, 
        error, 
        cacheKey, 
        cacheTtl,
        resourceKey,
        loadingMessage,
        loadingType
      })

  const { showSkeleton, shouldShowContent, shouldShowError, shouldShowEmpty } = hook

  return (
    <>
      {showGlobalOverlay && <DataLoadingOverlay />}
      
      {showSkeleton && skeleton}
      
      {shouldShowError && (
        errorState ? <>{errorState}</> : (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-destructive text-lg font-semibold mb-2">Erreur</div>
              <div className="text-muted-foreground">{error}</div>
            </div>
          </div>
        )
      )}
      
      {shouldShowEmpty && (
        emptyState ? <>{emptyState}</> : (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-muted-foreground">Aucune donnée disponible</div>
            </div>
          </div>
        )
      )}
      
      {shouldShowContent && children}
    </>
  )
}

// Composant spécialisé pour les pages
interface UnifiedPageWrapperProps<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  cacheKey: string
  resourceKey: string
  cacheTtl?: number
  children: ReactNode
  emptyMessage?: string
  loadingMessage?: string
  loadingType?: 'spinner' | 'skeleton'
}

export function UnifiedPageWrapper<T>({
  data,
  isLoading,
  error,
  cacheKey,
  resourceKey,
  cacheTtl,
  children,
  emptyMessage = "Aucune donnée disponible",
  loadingMessage = "Chargement de la page...",
  loadingType = 'skeleton'
}: UnifiedPageWrapperProps<T>) {
  const { showSkeleton, shouldShowContent, shouldShowError, shouldShowEmpty } = useUnifiedDataLoading({
    data,
    isLoading,
    error,
    cacheKey,
    cacheTtl,
    resourceKey,
    loadingMessage,
    loadingType
  })

  return (
    <>
      <DataLoadingOverlay />
      
      {showSkeleton && (
        <OptimizedLoading type="skeleton" message={loadingMessage} />
      )}

      {shouldShowError && (
        <div className="min-h-screen bg-destructive/5 flex items-center justify-center p-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/20 max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-6 bg-destructive rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground text-center mb-3">Oups !</h2>
            <p className="text-muted-foreground text-center mb-8">{error}</p>
          </div>
        </div>
      )}

      {shouldShowEmpty && (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/20 max-w-md w-full">
            <div className="text-center">
              <div className="text-muted-foreground text-lg">{emptyMessage}</div>
            </div>
          </div>
        </div>
      )}

      {shouldShowContent && children}
    </>
  )
}

// Composant pour les sections de contenu avec overlay local
interface UnifiedSectionWrapperProps<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  cacheKey: string
  resourceKey: string
  cacheTtl?: number
  children: ReactNode
  skeleton: ReactNode
  emptyState?: ReactNode
  errorState?: ReactNode
  loadingMessage?: string
  loadingType?: 'spinner' | 'skeleton'
}

export function UnifiedSectionWrapper<T>({
  data,
  isLoading,
  error,
  cacheKey,
  resourceKey,
  cacheTtl,
  children,
  skeleton,
  emptyState,
  errorState,
  loadingMessage = "Chargement...",
  loadingType = 'spinner'
}: UnifiedSectionWrapperProps<T>) {
  const { showSkeleton, shouldShowContent, shouldShowError, shouldShowEmpty } = useUnifiedDataLoading({
    data,
    isLoading,
    error,
    cacheKey,
    cacheTtl,
    resourceKey,
    loadingMessage,
    loadingType
  })

  return (
    <div className="relative">
      {showSkeleton && skeleton}
      
      {shouldShowError && (
        errorState ? <>{errorState}</> : (
          <div className="text-center p-4">
            <div className="text-destructive text-sm">{error}</div>
          </div>
        )
      )}
      
      {shouldShowEmpty && (
        emptyState ? <>{emptyState}</> : (
          <div className="text-center p-4">
            <div className="text-muted-foreground text-sm">Aucune donnée</div>
          </div>
        )
      )}
      
      {shouldShowContent && children}
      
      {/* Overlay local pour cette section */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="bg-card/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-border/20">
            <OptimizedLoading type={loadingType} message={loadingMessage} />
          </div>
        </div>
      )}
    </div>
  )
}
