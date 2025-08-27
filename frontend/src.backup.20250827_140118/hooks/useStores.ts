import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, type Store, type ApiResponse } from '@/lib/react-query-client'
import apiService from '@/lib/api'

// Hook pour récupérer toutes les boutiques de l'utilisateur
export const useStores = () => {
  return useQuery({
    queryKey: queryKeys.stores.list(),
    queryFn: async (): Promise<Store[]> => {
      const response = await apiService.getStores()
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors du chargement des boutiques')
      }
      return response.data
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}

// Hook pour récupérer une boutique spécifique
export const useStore = (storeId: string) => {
  return useQuery({
    queryKey: queryKeys.stores.detail(storeId),
    queryFn: async (): Promise<Store> => {
      const response = await apiService.getStore(storeId)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors du chargement de la boutique')
      }
      return response.data
    },
    enabled: !!storeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  })
}

// Hook pour récupérer les statistiques d'une boutique
export const useStoreStats = (storeId: string) => {
  return useQuery({
    queryKey: queryKeys.stores.stats(storeId),
    queryFn: async () => {
      const response = await apiService.getStoreStats(storeId)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors du chargement des statistiques')
      }
      return response.data
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour récupérer le graphique de revenus
export const useStoreRevenue = (storeId: string, timeRange: string = '30d') => {
  return useQuery({
    queryKey: queryKeys.stores.revenue(storeId, timeRange),
    queryFn: async () => {
      const response = await apiService.getRevenueChart(storeId, timeRange)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors du chargement du graphique de revenus')
      }
      return response.data
    },
    enabled: !!storeId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Hook pour récupérer les ventes récentes
export const useStoreSales = (storeId: string) => {
  return useQuery({
    queryKey: queryKeys.stores.sales(storeId),
    queryFn: async () => {
      const response = await apiService.getStoreSalesChart(storeId)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors du chargement des ventes')
      }
      return response.data
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour récupérer les commandes récentes
export const useStoreOrders = (storeId: string) => {
  return useQuery({
    queryKey: queryKeys.stores.orders(storeId),
    queryFn: async () => {
      const response = await apiService.getStoreRecentOrders(storeId)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors du chargement des commandes')
      }
      return response.data
    },
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour créer une nouvelle boutique
export const useCreateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (storeData: any) => {
      const response = await apiService.createStore(storeData)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors de la création de la boutique')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalider le cache des boutiques après création
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.list() })
    },
  })
}

// Hook pour mettre à jour une boutique
export const useUpdateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ storeId, storeData }: { storeId: string; storeData: any }) => {
      const response = await apiService.updateStore(storeId, storeData)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors de la mise à jour de la boutique')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalider les caches après mise à jour
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.list() })
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.detail(variables.storeId) })
    },
  })
}

// Hook pour supprimer une boutique
export const useDeleteStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (storeId: string) => {
      const response = await apiService.deleteStore(storeId)
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la suppression de la boutique')
      }
      return response
    },
    onSuccess: (data, storeId) => {
      // Invalider les caches après suppression
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.list() })
      queryClient.removeQueries({ queryKey: queryKeys.stores.detail(storeId) })
    },
  })
}

// Hook pour recharger manuellement les données
export const useRefreshStores = () => {
  const queryClient = useQueryClient()

  return {
    refreshStores: () => queryClient.invalidateQueries({ queryKey: queryKeys.stores.list() }),
    refreshStore: (storeId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.stores.detail(storeId) }),
    refreshStats: (storeId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.stores.stats(storeId) }),
  }
} 