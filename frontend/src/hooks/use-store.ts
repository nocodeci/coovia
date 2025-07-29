import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/services/api"
import { toast } from "sonner"
import type { CreateStoreData, UpdateStoreData } from "@/types/store"

// Hook pour récupérer toutes les boutiques
export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const stores = await apiClient.getStores()
      return stores
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour récupérer une boutique spécifique
export function useStore(storeId: string | undefined) {
  return useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      if (!storeId) throw new Error("Store ID is required")
      const store = await apiClient.getStore(storeId)
      return store
    },
    enabled: !!storeId,
  })
}

// Hook pour récupérer le dashboard d'une boutique
export function useStoreDashboard(storeId: string | undefined) {
  return useQuery({
    queryKey: ["store-dashboard", storeId],
    queryFn: async () => {
      if (!storeId) throw new Error("Store ID is required")
      const dashboard = await apiClient.getStoreDashboard(storeId)
      return dashboard
    },
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook pour créer une boutique
export function useCreateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateStoreData) => {
      const store = await apiClient.createStore(data)
      return store
    },
    onSuccess: (newStore) => {
      // Invalider et refetch la liste des boutiques
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      toast.success("Boutique créée avec succès!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la création de la boutique")
    },
  })
}

// Hook pour mettre à jour une boutique
export function useUpdateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStoreData }) => {
      const store = await apiClient.updateStore(id, data)
      return store
    },
    onSuccess: (updatedStore, { id }) => {
      // Mettre à jour le cache
      queryClient.setQueryData(["store", id], updatedStore)
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      toast.success("Boutique mise à jour avec succès!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour de la boutique")
    },
  })
}

// Hook pour supprimer une boutique
export function useDeleteStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.deleteStore(id)
      return id
    },
    onSuccess: (deletedId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: ["store", deletedId] })
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      toast.success("Boutique supprimée avec succès!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression de la boutique")
    },
  })
}

// Hook pour changer le statut d'une boutique
export function useToggleStoreStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const store = await apiClient.toggleStoreStatus(id)
      return store
    },
    onSuccess: (updatedStore) => {
      // Mettre à jour le cache
      queryClient.setQueryData(["store", updatedStore.id.toString()], updatedStore)
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      toast.success("Statut de la boutique mis à jour!")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors du changement de statut")
    },
  })
}
