"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react"
import { cache, CACHE_KEYS } from "@/lib/cache"
import apiService from "@/lib/api"

interface Store {
  id: string
  name: string
  description?: string
  logo?: string
  owner_id: string
  created_at: string
  updated_at: string
}

interface StoreContextType {
  stores: Store[]
  currentStore: Store | null
  isLoading: boolean
  error: string | null
  hasLoaded: boolean
  setCurrentStore: (store: Store) => void
  refreshStores: () => Promise<void>
  loadStoreStats: (storeId: string) => Promise<any>
}

const StoreContext = createContext<StoreContextType | null>(null)

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}

interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([])
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const loadStoresInProgress = useRef(false)

  const loadStores = async (forceRefresh = false) => {
    // Éviter les appels simultanés
    if (loadStoresInProgress.current && !forceRefresh) return
    
    loadStoresInProgress.current = true
    
    try {
      setError(null)
      
      // Vérifier le cache d'abord (sauf si forceRefresh)
      if (!forceRefresh) {
        const cachedStores = cache.get<Store[]>(CACHE_KEYS.STORES)
        if (cachedStores && cachedStores.length > 0) {
          setStores(cachedStores)
          setHasLoaded(true)
          setIsLoading(false)
          
          // Restaurer la boutique sélectionnée depuis le localStorage
          const savedStoreId = localStorage.getItem("selectedStoreId")
          if (savedStoreId) {
            const savedStore = cachedStores.find(store => store.id === savedStoreId)
            if (savedStore) {
              setCurrentStoreState(savedStore)
            } else {
              localStorage.removeItem("selectedStoreId")
            }
          }
          return
        }
      }

      const response = await apiService.getStores()

      if (response.success && response.data) {
        const transformedStores = (response.data as any[]).map((store: any) => ({
          id: store.id,
          name: store.name,
          description: store.description,
          logo: store.logo,
          owner_id: store.owner_id,
          created_at: store.created_at,
          updated_at: store.updated_at,
        }))

        setStores(transformedStores)
        setHasLoaded(true)

        // Mettre en cache les boutiques avec TTL plus long
        cache.set(CACHE_KEYS.STORES, transformedStores, 15 * 60 * 1000) // 15 minutes

        // Restaurer la boutique sélectionnée depuis le localStorage
        const savedStoreId = localStorage.getItem("selectedStoreId")
        if (savedStoreId) {
          const savedStore = transformedStores.find((store: Store) => store.id === savedStoreId)
          if (savedStore) {
            setCurrentStoreState(savedStore)
          } else {
            localStorage.removeItem("selectedStoreId")
          }
        }
      } else {
        setError('Erreur lors du chargement des boutiques')
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors du chargement des boutiques:", err)
      setError(err.message || "Erreur lors du chargement des boutiques")
    } finally {
      setIsLoading(false)
      loadStoresInProgress.current = false
    }
  }

  const setCurrentStore = (store: Store) => {
    setCurrentStoreState(store)
    localStorage.setItem("selectedStoreId", store.id)
  }

  const refreshStores = async () => {
    console.log('🔄 refreshStores called')
    setHasLoaded(false)
    cache.delete(CACHE_KEYS.STORES)
    await loadStores(true) // Force refresh
  }

  const loadStoreStats = async (storeId: string) => {
    try {
      // Vérifier le cache des stats
      const cacheKey = `store_stats_${storeId}`
      const cachedStats = cache.get(cacheKey)
      if (cachedStats) {
        return cachedStats
      }

      const response = await apiService.getStoreStats(storeId)
      
      if (response.success && response.data) {
        // Mettre en cache les stats pour 5 minutes
        cache.set(cacheKey, response.data, 5 * 60 * 1000)
        return response.data
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des statistiques')
      }
    } catch (error: any) {
      console.error("🚨 Erreur lors du chargement des stats:", error)
      throw error
    }
  }

  // Charger les boutiques au montage du composant - OPTIMISÉ
  useEffect(() => {
    const token = localStorage.getItem("sanctum_token")
    
    // Ne charger que si on a un token valide
    if (token) {
      // Vérifier immédiatement le cache
      const cachedStores = cache.get<Store[]>(CACHE_KEYS.STORES)
      if (cachedStores && cachedStores.length > 0) {
        setStores(cachedStores)
        setHasLoaded(true)
        setIsLoading(false)
        
        // Restaurer la boutique sélectionnée depuis le localStorage
        const savedStoreId = localStorage.getItem("selectedStoreId")
        if (savedStoreId) {
          const savedStore = cachedStores.find(store => store.id === savedStoreId)
          if (savedStore) {
            setCurrentStoreState(savedStore)
          } else {
            localStorage.removeItem("selectedStoreId")
          }
        }
        return
      }
      
      // Si pas de cache, charger immédiatement
      loadStores()
    } else {
      // Pas de token, ne pas charger les boutiques
      setStores([])
      setCurrentStoreState(null)
      setHasLoaded(true)
      setIsLoading(false)
    }
  }, [])

  const value: StoreContextType = {
    stores,
    currentStore,
    isLoading,
    error,
    hasLoaded,
    setCurrentStore,
    refreshStores,
    loadStoreStats,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
