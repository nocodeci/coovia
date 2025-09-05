import { Skeleton } from "@/components/ui/skeleton"
import { CircleLoader } from "@/components/ui/circle-loader"

interface OptimizedLoadingProps {
  type?: "spinner" | "skeleton"
  message?: string
}

export function OptimizedLoading({ type = "spinner", message = "Préparation en cours..." }: OptimizedLoadingProps) {
  if (type === "skeleton") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <CircleLoader size="lg" message={message} />
    </div>
  )
}

// Composant spécialisé pour les listes
export function ListLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-card rounded-2xl p-6 border border-border/20 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Composant spécialisé pour les tableaux
export function TableLoadingSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border/20 overflow-hidden">
      <div className="p-6 border-b border-border/20">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-20 rounded-lg ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Composant spécialisé pour le dashboard
export function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-card rounded-xl p-6 border border-border/20">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 bg-card rounded-xl p-6 border border-border/20">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
          <div className="col-span-3 bg-card rounded-xl p-6 border border-border/20">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 