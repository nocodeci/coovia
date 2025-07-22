"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Store } from "@/types/store"
import { mockStores } from "@/data/mock-stores"

interface StoreContextType {
  stores: Store[]
  selectedStore: Store | null
  isLoading: boolean
  setSelectedStore: (store: Store | null) => void
  refreshStores: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshStores = async () => {
    setIsLoading(true)
    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 500))
      setStores(mockStores)

      // Sélectionner automatiquement la première boutique active si aucune n'est sélectionnée
      if (!selectedStore && mockStores.length > 0) {
        const activeStore = mockStores.find((store) => store.status === "active")
        setSelectedStore(activeStore || mockStores[0])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des boutiques:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshStores()
  }, [])

  const value: StoreContextType = {
    stores,
    selectedStore,
    isLoading,
    setSelectedStore,
    refreshStores,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
