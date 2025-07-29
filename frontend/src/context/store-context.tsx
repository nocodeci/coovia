"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { storeService } from "@/services/api"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import type { Store, StoreStats, CreateStoreData, UpdateStoreData } from "@/types/store"

interface StoreContextType {
  stores: Store[]
  currentStore: Store | null
  storeStats: StoreStats | null
  isLoading: boolean
  error: string | null
  fetchStores: () => Promise<void>
  setCurrentStore: (store: Store | null) => void
  createStore: (data: CreateStoreData) => Promise<Store>
  updateStore: (id: string, data: UpdateStoreData) => Promise<Store>
  deleteStore: (id: string) => Promise<void>
  toggleStoreStatus: (id: string) => Promise<void>
  fetchStoreDashboard: (id: string) => Promise<void>
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
  const [storeStats, setStoreStats] = useState<StoreStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated } = useAuth()

  // Charger les boutiques quand l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated) {
      fetchStores()
    }
  }, [isAuthenticated])

  // Restaurer la boutique courante depuis localStorage
  useEffect(() => {
    const savedStore = localStorage.getItem("current_store")
    if (savedStore) {
      try {
        const store = JSON.parse(savedStore)
        setCurrentStoreState(store)
      } catch (error) {
        console.error("Erreur lors de la restauration de la boutique:", error)
        localStorage.removeItem("current_store")
      }
    }
  }, [])

  const fetchStores = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const storesData = await storeService.getStores()
      setStores(storesData)
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors du chargement des boutiques"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const setCurrentStore = (store: Store | null) => {
    setCurrentStoreState(store)
    if (store) {
      localStorage.setItem("current_store", JSON.stringify(store))
      localStorage.setItem("selectedStoreId", store.id)
    } else {
      localStorage.removeItem("current_store")
      localStorage.removeItem("selectedStoreId")
    }
  }

  const createStore = async (data: CreateStoreData): Promise<Store> => {
    try {
      setIsLoading(true)
      const newStore = await storeService.createStore(data)
      setStores((prev) => [...prev, newStore])
      toast.success("Boutique créée avec succès!")
      return newStore
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors de la création de la boutique"
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateStore = async (id: string, data: UpdateStoreData): Promise<Store> => {
    try {
      setIsLoading(true)
      const updatedStore = await storeService.updateStore(id, data)
      setStores((prev) => prev.map((store) => (store.id === id ? updatedStore : store)))

      if (currentStore?.id === id) {
        setCurrentStore(updatedStore)
      }

      toast.success("Boutique mise à jour avec succès!")
      return updatedStore
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la boutique"
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteStore = async (id: string) => {
    try {
      setIsLoading(true)
      await storeService.deleteStore(id)
      setStores((prev) => prev.filter((store) => store.id !== id))

      if (currentStore?.id === id) {
        setCurrentStore(null)
      }

      toast.success("Boutique supprimée avec succès!")
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la boutique"
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStoreStatus = async (id: string) => {
    try {
      const updatedStore = await storeService.toggleStoreStatus(id)
      setStores((prev) => prev.map((store) => (store.id === id ? updatedStore : store)))

      if (currentStore?.id === id) {
        setCurrentStore(updatedStore)
      }

      toast.success("Statut de la boutique mis à jour!")
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors du changement de statut"
      toast.error(message)
      throw error
    }
  }

  const fetchStoreDashboard = async (id: string) => {
    try {
      setIsLoading(true)
      const stats = await storeService.getStoreDashboard(id)
      setStoreStats(stats)
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors du chargement du dashboard"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const value: StoreContextType = {
    stores,
    currentStore,
    storeStats,
    isLoading,
    error,
    fetchStores,
    setCurrentStore,
    createStore,
    updateStore,
    deleteStore,
    toggleStoreStatus,
    fetchStoreDashboard,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
