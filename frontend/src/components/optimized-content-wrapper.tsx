import { ReactNode } from "react"
import { useOptimizedLoading, useOptimizedListLoading } from "@/hooks/useOptimizedLoading"
import { OptimizedLoading } from "@/components/optimized-loading"

interface OptimizedContentWrapperProps<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  cacheKey: string
  cacheTtl?: number
  skeleton: ReactNode
  children: ReactNode
  emptyState?: ReactNode
  errorState?: ReactNode
  type?: "content" | "list"
}

export function OptimizedContentWrapper<T>({
  data,
  isLoading,
  error,
  cacheKey,
  cacheTtl,
  skeleton,
  children,
  emptyState,
  errorState,
  type = "content"
}: OptimizedContentWrapperProps<T>) {
  const hook = type === "list" 
    ? useOptimizedListLoading({ data: data as any, isLoading, error, cacheKey, cacheTtl })
    : useOptimizedLoading({ data, isLoading, error, cacheKey, cacheTtl })

  const { showSkeleton, shouldShowContent, shouldShowError, shouldShowEmpty } = hook

  if (showSkeleton) {
    return <>{skeleton}</>
  }

  if (shouldShowError) {
    return errorState ? <>{errorState}</> : (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-destructive text-lg font-semibold mb-2">Erreur</div>
          <div className="text-muted-foreground">{error}</div>
        </div>
      </div>
    )
  }

  if (shouldShowEmpty) {
    return emptyState ? <>{emptyState}</> : (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-muted-foreground">Aucune donnée disponible</div>
        </div>
      </div>
    )
  }

  if (shouldShowContent) {
    return <>{children}</>
  }

  return <>{skeleton}</>
}

// Composant spécialisé pour les pages
interface OptimizedPageWrapperProps<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  cacheKey: string
  cacheTtl?: number
  children: ReactNode
  emptyMessage?: string
}

export function OptimizedPageWrapper<T>({
  data,
  isLoading,
  error,
  cacheKey,
  cacheTtl,
  children,
  emptyMessage = "Aucune donnée disponible"
}: OptimizedPageWrapperProps<T>) {
  const { showSkeleton, shouldShowContent, shouldShowError, shouldShowEmpty } = useOptimizedLoading({
    data,
    isLoading,
    error,
    cacheKey,
    cacheTtl
  })

  if (showSkeleton) {
    return <OptimizedLoading type="skeleton" message="Chargement en cours..." />
  }

  if (shouldShowError) {
    return (
      <div className="min-h-screen bg-destructive/5 flex items-center justify-center p-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/20 max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-6 bg-destructive rounded-2xl flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground text-center mb-3">Oups !</h2>
          <p className="text-muted-foreground text-center mb-8">{error}</p>
        </div>
      </div>
    )
  }

  if (shouldShowEmpty) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/20 max-w-md w-full">
          <div className="text-center">
            <div className="text-muted-foreground text-lg">{emptyMessage}</div>
          </div>
        </div>
      </div>
    )
  }

  if (shouldShowContent) {
    return <>{children}</>
  }

  return <OptimizedLoading type="skeleton" message="Chargement en cours..." />
} 