import { useState, useEffect, useRef } from "react"
import { cache, CACHE_KEYS } from "@/lib/cache"

interface UseOptimizedLoadingProps<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  cacheKey: string
  cacheTtl?: number
  fallbackDelay?: number
}

export function useOptimizedLoading<T>({
  data,
  isLoading,
  error,
  cacheKey,
  cacheTtl = 5 * 60 * 1000, // 5 minutes par défaut
  fallbackDelay = 1000
}: UseOptimizedLoadingProps<T>) {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [hasData, setHasData] = useState(false)
  const [shouldShowContent, setShouldShowContent] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Nettoyer le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (isLoading) {
      setShowSkeleton(true)
      setHasData(false)
      setShouldShowContent(false)
    } else if (error) {
      setShowSkeleton(false)
      setHasData(false)
      setShouldShowContent(false)
    } else if (data) {
      // Mettre en cache les données
      cache.set(cacheKey, data, cacheTtl)
      
      // Attendre un délai minimum pour éviter le clignotement
      timeoutRef.current = setTimeout(() => {
        setShowSkeleton(false)
        setHasData(true)
        setShouldShowContent(true)
      }, 300)
    } else {
      setShowSkeleton(false)
      setHasData(false)
      setShouldShowContent(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, error, data, cacheKey, cacheTtl])

  return {
    showSkeleton,
    hasData,
    shouldShowContent,
    shouldShowError: !!error && !showSkeleton,
    shouldShowEmpty: !isLoading && !error && !data && !showSkeleton
  }
}

// Hook spécialisé pour les listes
export function useOptimizedListLoading<T>({
  data,
  isLoading,
  error,
  cacheKey,
  cacheTtl = 10 * 60 * 1000, // 10 minutes pour les listes
  fallbackDelay = 1000
}: UseOptimizedLoadingProps<T[]>) {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [hasData, setHasData] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (isLoading) {
      setShowSkeleton(true)
      setHasData(false)
    } else if (error) {
      setShowSkeleton(false)
      setHasData(false)
    } else if (data && data.length > 0) {
      // Mettre en cache les données
      cache.set(cacheKey, data, cacheTtl)
      
      timeoutRef.current = setTimeout(() => {
        setShowSkeleton(false)
        setHasData(true)
      }, 200)
    } else {
      setShowSkeleton(false)
      setHasData(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, error, data, cacheKey, cacheTtl])

  return {
    showSkeleton,
    hasData,
    shouldShowContent: hasData && !showSkeleton,
    shouldShowError: !!error && !showSkeleton,
    shouldShowEmpty: !isLoading && !error && (!data || data.length === 0) && !showSkeleton
  }
} 