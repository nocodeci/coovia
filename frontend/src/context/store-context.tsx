"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Store } from "@/types/store"
import { mockStores } from "@/data/mock-stores"

interface StoreContextType {
  stores: Store[]
  currentStore: Store | null
  isLoading: boolean
  error: string | null
  setCurrentStore: (store: Store) => void
  refreshStores: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export const useStore = () => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
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

  // Simuler le chargement des boutiques
  const loadStores = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simuler un délai de chargement
      await new Promise((resolve) => setTimeout(resolve, 500))

      setStores(mockStores)

      // Sélectionner automatiquement la première boutique active
      const activeStore = mockStores.find((store) => store.status === "active")
      if (activeStore && !currentStore) {
        setCurrentStoreState(activeStore)
        localStorage.setItem("selectedStoreId", activeStore.id)
      }
    } catch (err) {
      setError("Erreur lors du chargement des boutiques")
      console.error("Error loading stores:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les boutiques au montage du composant
  useEffect(() => {
    loadStores()
  }, [])

  // Restaurer la boutique sélectionnée depuis localStorage
  useEffect(() => {
    const savedStoreId = localStorage.getItem("selectedStoreId")
    if (savedStoreId && stores.length > 0) {
      const savedStore = stores.find((store) => store.id === savedStoreId)
      if (savedStore) {
        setCurrentStoreState(savedStore)
      }
    }
  }, [stores])

  const setCurrentStore = (store: Store) => {
    setCurrentStoreState(store)
    localStorage.setItem("selectedStoreId", store.id)
  }

  const refreshStores = async () => {
    await loadStores()
  }

  const value: StoreContextType = {
    stores,
    currentStore,
    isLoading,
    error,
    setCurrentStore,
    refreshStores,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
