"use client"

import { useState, useEffect } from "react"
import type { Store } from "@/types/store"
import apiService from "@/lib/api"

export function useStore() {
  const [stores, setStores] = useState<Store[]>([])
  const [currentStore, setCurrentStore] = useState<Store | null>(null)
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
        const transformedStores: Store[] = response.data.map((store: any) => ({
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
            totalProducts: store.stats?.totalProducts || 0,
            totalOrders: store.stats?.totalOrders || 0,
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

  useEffect(() => {
    loadStores()
  }, [])

  return {
    stores,
    currentStore,
    setCurrentStore,
    isLoading,
    error,
    loadStores,
  }
}
