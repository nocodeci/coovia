"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import type { Store } from "@/types/store"

export function useStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [currentStore, setCurrentStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStores = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.getStores()
      setStores(response.data)

      // Sélectionner automatiquement le premier magasin si aucun n'est sélectionné
      if (response.data.length > 0 && !currentStore) {
        const savedStoreId = localStorage.getItem("current_store_id")
        const storeToSelect = savedStoreId
          ? response.data.find((store) => store.id === savedStoreId) || response.data[0]
          : response.data[0]

        setCurrentStore(storeToSelect)
        localStorage.setItem("current_store_id", storeToSelect.id)
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors du chargement des magasins")
      toast.error("Erreur", {
        description: "Impossible de charger les magasins",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createStore = async (storeData: Omit<Store, "id" | "created_at" | "updated_at">) => {
    setIsLoading(true)
    try {
      const response = await apiClient.createStore(storeData)
      setStores((prev) => [...prev, response.data])
      toast.success("Magasin créé", {
        description: `Le magasin ${response.data.name} a été créé avec succès`,
      })
      return response.data
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible de créer le magasin",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateStore = async (storeId: string, storeData: Partial<Store>) => {
    setIsLoading(true)
    try {
      const response = await apiClient.updateStore(storeId, storeData)
      setStores((prev) => prev.map((store) => (store.id === storeId ? response.data : store)))

      // Mettre à jour le magasin courant si c'est celui qui a été modifié
      if (currentStore?.id === storeId) {
        setCurrentStore(response.data)
      }

      toast.success("Magasin mis à jour", {
        description: `Le magasin ${response.data.name} a été mis à jour avec succès`,
      })
      return response.data
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible de mettre à jour le magasin",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteStore = async (storeId: string) => {
    setIsLoading(true)
    try {
      await apiClient.deleteStore(storeId)
      setStores((prev) => prev.filter((store) => store.id !== storeId))

      // Si le magasin supprimé était le magasin courant, sélectionner un autre
      if (currentStore?.id === storeId) {
        const remainingStores = stores.filter((store) => store.id !== storeId)
        if (remainingStores.length > 0) {
          setCurrentStore(remainingStores[0])
          localStorage.setItem("current_store_id", remainingStores[0].id)
        } else {
          setCurrentStore(null)
          localStorage.removeItem("current_store_id")
        }
      }

      toast.success("Magasin supprimé", {
        description: "Le magasin a été supprimé avec succès",
      })
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible de supprimer le magasin",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const switchStore = (store: Store) => {
    setCurrentStore(store)
    localStorage.setItem("current_store_id", store.id)
    toast.success("Magasin sélectionné", {
      description: `Vous travaillez maintenant sur ${store.name}`,
    })
  }

  useEffect(() => {
    fetchStores()
  }, [])

  return {
    stores,
    currentStore,
    isLoading,
    error,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    switchStore,
  }
}
