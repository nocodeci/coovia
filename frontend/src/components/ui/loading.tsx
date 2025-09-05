"use client"

import React from 'react'
import { Loader2, Shield, Sparkles, Zap, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'auth' | 'sparkle' | 'pulse' | 'dots'
  text?: string
  className?: string
  fullScreen?: boolean
}

export function Loading({
  size = 'md',
  variant = 'default',
  text,
  className,
  fullScreen = false
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const renderLoader = () => {
    switch (variant) {
      case 'auth':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className={cn(
                "animate-spin rounded-full border-4 border-blue-200",
                sizeClasses[size]
              )} />
              <div className={cn(
                "absolute top-0 left-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600",
                sizeClasses[size]
              )} />
            </div>
            {text && (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">{text}</p>
                <p className="text-xs text-gray-500">Veuillez patienter...</p>
              </div>
            )}
          </div>
        )

      case 'sparkle':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Sparkles className={cn("text-blue-600 animate-pulse", sizeClasses[size])} />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            {text && (
              <p className="text-sm font-medium text-gray-700">{text}</p>
            )}
          </div>
        )

      case 'pulse':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            {text && (
              <p className="text-sm font-medium text-gray-700">{text}</p>
            )}
          </div>
        )

      case 'dots':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            {text && (
              <p className="text-sm font-medium text-gray-700">{text}</p>
            )}
          </div>
        )

      default:
        return (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} />
            {text && (
              <p className="text-sm font-medium text-gray-700">{text}</p>
            )}
          </div>
        )
    }
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border">
          {renderLoader()}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {renderLoader()}
    </div>
  )
}

// Composants spécialisés pour des cas d'usage courants
export function AuthLoading({ text = "Vérification de l'authentification..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <Loading variant="auth" size="lg" text={text} />
      </div>
    </div>
  )
}

export function PageLoading({ text = "Préparation de la page..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
          <Globe className="w-10 h-10 text-white" />
        </div>
        <Loading variant="default" size="lg" text={text} />
      </div>
    </div>
  )
}

export function ContentLoading({ text = "Préparation..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loading variant="pulse" size="md" text={text} />
    </div>
  )
}

export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex items-center space-x-2">
      <Loading variant="default" size={size} />
      <span>Préparation...</span>
    </div>
  )
}

// Composant de skeleton pour le chargement de contenu
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  )
}

// Composants de skeleton spécialisés
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <Skeleton className="h-6 w-1/3" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/6" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Skeleton className="w-24 h-24 rounded-full mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <CardSkeleton />
    </div>
  )
}
