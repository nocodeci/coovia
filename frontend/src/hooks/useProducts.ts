import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, type Product, type ApiResponse } from '@/lib/react-query-client'
import apiService from '@/lib/api'

// Interface pour les filtres de produits
export interface ProductFilters {
  search?: string
  category?: string
  status?: string
  page?: number
  per_page?: number
}

// Hook pour récupérer les produits d'une boutique avec filtres
export const useProducts = (storeId: string, filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(storeId, filters),
    queryFn: async (): Promise<{ data: Product[]; pagination?: any }> => {
      const response = await apiService.getStoreProducts(
        storeId, 
        filters.page || 1, 
        filters.per_page || 20
      )
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors du chargement des produits')
      }
      
      return {
        data: response.data as Product[],
        pagination: (response as any).pagination
      }
    },
    enabled: !!storeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  })
}

// Hook pour récupérer un produit spécifique
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: async (): Promise<Product> => {
      // Utiliser getStoreProducts avec un filtre pour récupérer un produit spécifique
      const response = await apiService.getStoreProducts('', 1, 1000) // Récupérer tous les produits
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors du chargement du produit')
      }
      
      const products = response.data as Product[]
      const product = products.find(p => p.id === productId)
      if (!product) {
        throw new Error('Produit non trouvé')
      }
      
      return product
    },
    enabled: !!productId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Hook pour créer un nouveau produit
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ storeId, productData }: { storeId: string; productData: any }) => {
      const response = await apiService.createProduct(storeId, productData)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors de la création du produit')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalider le cache des produits de cette boutique
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.products.list(variables.storeId) 
      })
    },
  })
}

// Hook pour mettre à jour un produit
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, productData }: { productId: string; productData: any }) => {
      const response = await apiService.updateProduct(productId, productData)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors de la mise à jour du produit')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalider les caches après mise à jour
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.productId) })
      // Invalider toutes les listes de produits (car le produit peut changer de statut/catégorie)
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

// Hook pour supprimer un produit
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiService.deleteProduct(productId)
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la suppression du produit')
      }
      return response
    },
    onSuccess: (data, productId) => {
      // Invalider les caches après suppression
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(productId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

// Hook pour récupérer les catégories
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.products.categories,
    queryFn: async () => {
      const response = await apiService.getCategories()
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors du chargement des catégories')
      }
      return response.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (catégories changent rarement)
    gcTime: 60 * 60 * 1000, // 1 heure
  })
}

// Hook pour créer une catégorie
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryData: any) => {
      const response = await apiService.createCategory(categoryData)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors de la création de la catégorie')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalider le cache des catégories après création
      queryClient.invalidateQueries({ queryKey: queryKeys.products.categories })
    },
  })
}

// Hook pour mettre à jour une catégorie
export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ categoryId, categoryData }: { categoryId: string; categoryData: any }) => {
      const response = await apiService.updateCategory(categoryId, categoryData)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors de la mise à jour de la catégorie')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalider les caches après mise à jour
      queryClient.invalidateQueries({ queryKey: queryKeys.products.categories })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

// Hook pour supprimer une catégorie
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await apiService.deleteCategory(categoryId)
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la suppression de la catégorie')
      }
      return response
    },
    onSuccess: () => {
      // Invalider les caches après suppression
      queryClient.invalidateQueries({ queryKey: queryKeys.products.categories })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

// Hook pour recharger manuellement les données
export const useRefreshProducts = () => {
  const queryClient = useQueryClient()

  return {
    refreshProducts: (storeId: string) => 
      queryClient.invalidateQueries({ queryKey: queryKeys.products.list(storeId) }),
    refreshProduct: (productId: string) => 
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) }),
    refreshCategories: () => 
      queryClient.invalidateQueries({ queryKey: queryKeys.products.categories }),
  }
} 