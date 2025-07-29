"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Store } from "@/types/store"
import apiService from "@/lib/api"

interface StoreContextType {
  stores: Store[]
  currentStore: Store | null
  isLoading: boolean
  error: string | null
  setCurrentStore: (store: Store) => void
  refreshStores: () => Promise<void>
  loadStoreStats: (storeId: string) => Promise<any>
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

  const loadStores = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("🔄 Chargement des boutiques depuis l'API...")
      
      const response = await apiService.getStores()
      console.log("📡 Réponse API stores:", response)
      
      if (response.success && response.data) {
        // Transformer les données de l'API pour correspondre au type Store
        const transformedStores: Store[] = (response.data as any[]).map((store: any) => ({
          id: store.id.toString(),
          name: store.name,
          description: store.description,
          logo: store.logo,
          status: store.status,
          plan: store.settings?.plan || 'starter',
          createdAt: store.created_at,
          updatedAt: store.updated_at,
          settings: {
            currency: store.settings?.currency || 'XOF',
            language: store.settings?.language || 'fr',
            timezone: store.settings?.timezone || 'Africa/Abidjan',
            notifications: {
              email: store.settings?.notifications?.email || true,
              sms: store.settings?.notifications?.sms || false,
              push: store.settings?.notifications?.push || true,
            },
            features: {
              inventory: store.settings?.features?.inventory || true,
              analytics: store.settings?.features?.analytics || true,
              multiChannel: store.settings?.features?.multiChannel || false,
              customDomain: store.settings?.features?.customDomain || false,
            },
          },
          stats: {
            totalProducts: store.stats?.totalProducts || store.products_count || 0,
            totalOrders: store.stats?.totalOrders || store.orders_count || 0,
            totalRevenue: store.stats?.totalRevenue || 0,
            totalCustomers: store.stats?.totalCustomers || 0,
            conversionRate: store.stats?.conversionRate || 0,
            averageOrderValue: store.stats?.averageOrderValue || 0,
          },
          contact: {
            email: store.contact?.email || '',
            phone: store.contact?.phone || '',
            address: {
              street: store.address?.street || '',
              city: store.address?.city || '',
              state: store.address?.state || '',
              country: store.address?.country || '',
              postalCode: store.address?.postal_code || '',
            },
          },
        }))

        console.log("✅ Boutiques transformées:", transformedStores)
        setStores(transformedStores)
      } else {
        console.error("❌ Erreur API stores:", response.message)
        setError(response.message || 'Erreur lors du chargement des boutiques')
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors du chargement des boutiques:", err)
      setError(err.message || "Erreur lors du chargement des boutiques")
    } finally {
      setIsLoading(false)
    }
  }

  const setCurrentStore = (store: Store) => {
    console.log("🏪 Définition de la boutique courante:", store.name)
    setCurrentStoreState(store)
    localStorage.setItem("selectedStoreId", store.id)
  }

  const refreshStores = async () => {
    console.log("🔄 Actualisation des boutiques...")
    await loadStores()
  }

  const loadStoreStats = async (storeId: string) => {
    try {
      console.log("📊 Chargement des stats pour la boutique:", storeId)
      const response = await apiService.getStoreStats(storeId)
      console.log("📡 Réponse API stats:", response)
      
      if (response.success && response.data) {
        return {
          store: stores.find(s => s.id === storeId),
          stats: (response.data as any).stats || {},
          overview: (response.data as any).overview || {},
        }
      } else {
        console.error("❌ Erreur API stats:", response.message)
        throw new Error(response.message || "Erreur lors du chargement des statistiques")
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors du chargement des stats:", err)
      throw err
    }
  }

  // Charger les boutiques au montage du composant
  useEffect(() => {
    loadStores()
  }, [])

  const value: StoreContextType = {
    stores,
    currentStore,
    isLoading,
    error,
    setCurrentStore,
    refreshStores,
    loadStoreStats,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
