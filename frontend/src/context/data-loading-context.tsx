import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface LoadingState {
  isLoading: boolean
  message?: string
  type?: 'spinner' | 'skeleton'
}

interface DataLoadingContextType {
  loadingStates: Record<string, LoadingState>
  setLoading: (key: string, state: LoadingState) => void
  clearLoading: (key: string) => void
  clearAllLoading: () => void
  hasAnyLoading: boolean
  getGlobalLoadingState: () => LoadingState
}

const DataLoadingContext = createContext<DataLoadingContextType | undefined>(undefined)

interface DataLoadingProviderProps {
  children: ReactNode
}

export function DataLoadingProvider({ children }: DataLoadingProviderProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({})

  const setLoading = useCallback((key: string, state: LoadingState) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: state
    }))
  }, [])

  const clearLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newStates = { ...prev }
      delete newStates[key]
      return newStates
    })
  }, [])

  const clearAllLoading = useCallback(() => {
    setLoadingStates({})
  }, [])

  const hasAnyLoading = Object.values(loadingStates).some(state => state.isLoading)

  const getGlobalLoadingState = useCallback((): LoadingState => {
    const activeLoadings = Object.values(loadingStates).filter(state => state.isLoading)
    
    if (activeLoadings.length === 0) {
      return { isLoading: false }
    }

    // Retourner le premier état de chargement actif
    return activeLoadings[0]
  }, [loadingStates])

  const value: DataLoadingContextType = {
    loadingStates,
    setLoading,
    clearLoading,
    clearAllLoading,
    hasAnyLoading,
    getGlobalLoadingState
  }

  return (
    <DataLoadingContext.Provider value={value}>
      {children}
    </DataLoadingContext.Provider>
  )
}

export function useDataLoading() {
  const context = useContext(DataLoadingContext)
  if (context === undefined) {
    throw new Error('useDataLoading doit être utilisé dans un DataLoadingProvider')
  }
  return context
}

// Hook spécialisé pour gérer le chargement d'une ressource spécifique
export function useResourceLoading(resourceKey: string) {
  const { loadingStates, setLoading, clearLoading } = useDataLoading()
  
  const currentState = loadingStates[resourceKey] || { isLoading: false }
  
  const startLoading = useCallback((message?: string, type?: 'spinner' | 'skeleton') => {
    setLoading(resourceKey, { isLoading: true, message, type })
  }, [resourceKey, setLoading])
  
  const stopLoading = useCallback(() => {
    clearLoading(resourceKey)
  }, [resourceKey, clearLoading])
  
  return {
    isLoading: currentState.isLoading,
    message: currentState.message,
    type: currentState.type,
    startLoading,
    stopLoading
  }
}
