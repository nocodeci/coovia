import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { queryKeys, invalidateCache } from '@/lib/query-client'
import { apiService } from '@/lib/api'
import { toast } from 'sonner'

/**
 * Hook optimisé pour la gestion des produits e-commerce
 * 
 * Fonctionnalités :
 * - Cache intelligent avec React Query
 * - Préfetching des données critiques
 * - Optimistic updates pour les actions
 * - Gestion d'erreurs centralisée
 * - Filtrage et tri côté client
 */
export const useOptimizedProducts = (storeId: string, filters?: any) => {
  const queryClient = useQueryClient()

  // Query principale avec cache intelligent
  const {
    data: productsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: queryKeys.products.list({ storeId, ...filters }),
    queryFn: () => apiService.getProducts(storeId, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes pour les produits
    gcTime: 5 * 60 * 1000, // 5 minutes en cache
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })

  // Données optimisées avec calculs memoizés
  const products = useMemo(() => {
    if (!productsData?.data) return []
    
    return productsData.data.map((product: any) => ({
      ...product,
      // Calculs optimisés côté client
      hasDiscount: product.originalPrice && product.originalPrice > product.price,
      discountPercentage: product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
      isLowStock: product.stock !== undefined && product.stock <= 5 && product.stock > 0,
      isOutOfStock: product.stock === 0,
      mainImage: product.images?.[0]?.thumbnail || product.images?.[0]?.url,
    }))
  }, [productsData])

  // Pagination optimisée
  const pagination = useMemo(() => {
    if (!productsData?.pagination) return null
    
    return {
      currentPage: productsData.pagination.current_page,
      totalPages: productsData.pagination.last_page,
      total: productsData.pagination.total,
      perPage: productsData.pagination.per_page,
      hasNextPage: productsData.pagination.current_page < productsData.pagination.last_page,
      hasPrevPage: productsData.pagination.current_page > 1,
    }
  }, [productsData])

  // Mutation pour ajouter au panier avec optimistic update
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: string; quantity?: number }) =>
      apiService.addToCart(storeId, productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      // Optimistic update du panier
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current(storeId) })
      
      const previousCart = queryClient.getQueryData(queryKeys.cart.current(storeId))
      
      queryClient.setQueryData(queryKeys.cart.current(storeId), (old: any) => {
        if (!old) return { items: [{ productId, quantity }] }
        
        const existingItem = old.items?.find((item: any) => item.productId === productId)
        if (existingItem) {
          return {
            ...old,
            items: old.items.map((item: any) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }
        }
        
        return {
          ...old,
          items: [...(old.items || []), { productId, quantity }]
        }
      })
      
      return { previousCart }
    },
    onError: (err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.current(storeId), context.previousCart)
      }
      toast.error('Erreur lors de l\'ajout au panier')
    },
    onSuccess: () => {
      toast.success('Produit ajouté au panier')
    },
    onSettled: () => {
      // Revalider le panier
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current(storeId) })
    },
  })

  // Mutation pour ajouter aux favoris
  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => apiService.addToWishlist(storeId, productId),
    onSuccess: () => {
      toast.success('Ajouté aux favoris')
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout aux favoris')
    },
  })

  // Callbacks optimisés
  const addToCart = useCallback((productId: string, quantity = 1) => {
    addToCartMutation.mutate({ productId, quantity })
  }, [addToCartMutation])

  const addToWishlist = useCallback((productId: string) => {
    addToWishlistMutation.mutate(productId)
  }, [addToWishlistMutation])

  // Préfetching intelligent
  const prefetchProduct = useCallback((productId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(productId),
      queryFn: () => apiService.getProduct(productId),
      staleTime: 5 * 60 * 1000, // 5 minutes pour les détails
    })
  }, [queryClient])

  // Filtrage côté client pour les interactions instantanées
  const filteredProducts = useMemo(() => {
    if (!filters?.search) return products
    
    const searchTerm = filters.search.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category?.name.toLowerCase().includes(searchTerm)
    )
  }, [products, filters?.search])

  // Tri côté client pour la réactivité
  const sortedProducts = useMemo(() => {
    if (!filters?.sort) return filteredProducts
    
    return [...filteredProducts].sort((a, b) => {
      switch (filters.sort) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        default:
          return 0
      }
    })
  }, [filteredProducts, filters?.sort])

  return {
    // Données
    products: sortedProducts,
    pagination,
    isLoading,
    error,
    
    // Actions
    addToCart,
    addToWishlist,
    prefetchProduct,
    refetch,
    
    // États des mutations
    isAddingToCart: addToCartMutation.isPending,
    isAddingToWishlist: addToWishlistMutation.isPending,
    
    // Métadonnées
    totalProducts: products.length,
    hasProducts: products.length > 0,
  }
}

/**
 * Hook spécialisé pour les détails d'un produit
 */
export const useProductDetails = (productId: string) => {
  const queryClient = useQueryClient()

  const {
    data: product,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => apiService.getProduct(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes pour les détails
    enabled: !!productId,
  })

  // Précharger les produits similaires
  const prefetchSimilarProducts = useCallback(() => {
    if (product?.category_id) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.list({ 
          categoryId: product.category_id, 
          exclude: productId,
          limit: 4 
        }),
        queryFn: () => apiService.getProducts('', { 
          categoryId: product.category_id, 
          exclude: productId,
          limit: 4 
        }),
        staleTime: 2 * 60 * 1000,
      })
    }
  }, [product, productId, queryClient])

  return {
    product,
    isLoading,
    error,
    refetch,
    prefetchSimilarProducts,
  }
}

/**
 * Hook pour la recherche en temps réel
 */
export const useProductSearch = (storeId: string, searchTerm: string, debounceMs = 300) => {
  const {
    data: searchResults,
    isLoading,
    error
  } = useQuery({
    queryKey: queryKeys.products.search(searchTerm),
    queryFn: () => apiService.searchProducts(storeId, searchTerm),
    staleTime: 30 * 1000, // 30 secondes pour les résultats de recherche
    enabled: searchTerm.length >= 2,
    refetchOnWindowFocus: false,
  })

  return {
    searchResults: searchResults?.data || [],
    isLoading,
    error,
    hasResults: (searchResults?.data?.length || 0) > 0,
  }
} 