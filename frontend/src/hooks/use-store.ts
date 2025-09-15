"use client"

import { useState, useEffect } from "react"
import type { Store } from "@/types/store"
import apiService from "@/lib/api"

// Cache global pour éviter les re-chargements
let globalStoresCache: Store[] | null = null
let globalCurrentStoreCache: Store | null = null
let isInitialized = false

export function useStore() {
  const [stores, setStores] = useState<Store[]>(globalStoresCache || [])
  const [currentStore, setCurrentStore] = useState<Store | null>(globalCurrentStoreCache)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStores = async () => {
    // Si on a déjà des données en cache, ne pas recharger
    if (globalStoresCache && globalStoresCache.length > 0) {
      console.log("📦 Utilisation du cache des boutiques")
      setStores(globalStoresCache)
      if (globalCurrentStoreCache) {
        setCurrentStore(globalCurrentStoreCache)
      }
      return
    }

    try {
      // Ne pas afficher le loading si on a déjà des données
      if (stores.length === 0) {
        setIsLoading(true)
      }
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
        
        // Mettre en cache global
        globalStoresCache = transformedStores
        setStores(transformedStores)
        
        // Sélectionner automatiquement la première boutique si aucune n'est sélectionnée
        if (!globalCurrentStoreCache && transformedStores.length > 0) {
          globalCurrentStoreCache = transformedStores[0]
          setCurrentStore(transformedStores[0])
        }
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
    // Ne charger que si pas encore initialisé
    if (!isInitialized) {
      isInitialized = true
      loadStores()
    }
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
