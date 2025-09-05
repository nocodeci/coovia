import { useState, useEffect, useRef } from 'react'
import { useResourceLoading } from '@/context/data-loading-context'
import { cache } from '@/lib/cache'

interface UseUnifiedDataLoadingProps<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  cacheKey: string
  resourceKey: string
  cacheTtl?: number
  loadingMessage?: string
  loadingType?: 'spinner' | 'skeleton'
  fallbackDelay?: number
}

export function useUnifiedDataLoading<T>({
  data,
  isLoading,
  error,
  cacheKey,
  resourceKey,
  cacheTtl = 5 * 60 * 1000,
  loadingMessage = 'Préparation des données...',
  loadingType = 'spinner',
  fallbackDelay = 300
}: UseUnifiedDataLoadingProps<T>) {
  const { startLoading, stopLoading } = useResourceLoading(resourceKey)
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
      // Démarrer le chargement global
      startLoading(loadingMessage, loadingType)
      setShowSkeleton(true)
      setHasData(false)
      setShouldShowContent(false)
    } else {
      // Arrêter le chargement global
      stopLoading()
      
      if (error) {
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
        }, fallbackDelay)
      } else {
        setShowSkeleton(false)
        setHasData(false)
        setShouldShowContent(false)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, error, data, cacheKey, cacheTtl, resourceKey, startLoading, stopLoading, loadingMessage, loadingType, fallbackDelay])

  return {
    showSkeleton,
    hasData,
    shouldShowContent,
    shouldShowError: !!error && !showSkeleton,
    shouldShowEmpty: !isLoading && !error && !data && !showSkeleton
  }
}

// Hook spécialisé pour les listes
export function useUnifiedListLoading<T>({
  data,
  isLoading,
  error,
  cacheKey,
  resourceKey,
  cacheTtl = 10 * 60 * 1000,
  loadingMessage = 'Préparation de la liste...',
  loadingType = 'skeleton',
  fallbackDelay = 200
}: UseUnifiedDataLoadingProps<T[]>) {
  const { startLoading, stopLoading } = useResourceLoading(resourceKey)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [hasData, setHasData] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (isLoading) {
      startLoading(loadingMessage, loadingType)
      setShowSkeleton(true)
      setHasData(false)
    } else {
      stopLoading()
      
      if (error) {
        setShowSkeleton(false)
        setHasData(false)
      } else if (data && data.length > 0) {
        cache.set(cacheKey, data, cacheTtl)
        
        timeoutRef.current = setTimeout(() => {
          setShowSkeleton(false)
          setHasData(true)
        }, fallbackDelay)
      } else {
        setShowSkeleton(false)
        setHasData(false)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, error, data, cacheKey, cacheTtl, resourceKey, startLoading, stopLoading, loadingMessage, loadingType, fallbackDelay])

  return {
    showSkeleton,
    hasData,
    shouldShowContent: hasData && !showSkeleton,
    shouldShowError: !!error && !showSkeleton,
    shouldShowEmpty: !isLoading && !error && (!data || data.length === 0) && !showSkeleton
  }
}

// Hook pour gérer le chargement de plusieurs ressources simultanément
export function useMultipleResourceLoading() {
  const { loadingStates, setLoading, clearLoading, hasAnyLoading } = useResourceLoading('')

  const startMultipleLoading = (resources: Array<{ key: string; message?: string; type?: 'spinner' | 'skeleton' }>) => {
    resources.forEach(({ key, message, type }) => {
      setLoading(key, { isLoading: true, message, type })
    })
  }

  const stopMultipleLoading = (resourceKeys: string[]) => {
    resourceKeys.forEach(key => clearLoading(key))
  }

  const getLoadingCount = () => Object.values(loadingStates).filter(state => state.isLoading).length

  return {
    loadingStates,
    hasAnyLoading,
    startMultipleLoading,
    stopMultipleLoading,
    getLoadingCount
  }
}
