import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Configuration optimisée du client React Query pour e-commerce
 * 
 * Stratégies de cache :
 * - staleTime: 5min pour les données statiques (produits, catégories)
 * - staleTime: 30s pour les données dynamiques (stock, prix)
 * - cacheTime: 10min pour éviter les re-fetch inutiles
 * - retry: 3 tentatives avec backoff exponentiel
 * - refetchOnWindowFocus: false pour éviter les re-fetch agressifs
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache intelligent basé sur le type de données
      staleTime: 5 * 60 * 1000, // 5 minutes par défaut
      gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
      
      // Retry avec backoff exponentiel
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs 4xx (client)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Optimisations UX
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Gestion d'erreurs centralisée
      onError: (error: any) => {
        console.error('Query error:', error)
        
        // Erreurs spécifiques selon le type
        if (error?.response?.status === 401) {
          toast.error('Session expirée. Veuillez vous reconnecter.')
        } else if (error?.response?.status === 403) {
          toast.error('Accès refusé')
        } else if (error?.response?.status === 404) {
          toast.error('Ressource non trouvée')
        } else if (error?.response?.status >= 500) {
          toast.error('Erreur serveur. Veuillez réessayer.')
        } else {
          toast.error('Une erreur est survenue')
        }
      },
    },
    mutations: {
      // Optimisations pour les mutations
      retry: false, // Pas de retry pour les mutations
      onError: (error: any) => {
        console.error('Mutation error:', error)
        toast.error('Erreur lors de l\'opération')
      },
    },
  },
})

/**
 * Clés de cache optimisées pour e-commerce
 * Structure: [entity, action, params]
 */
export const queryKeys = {
  // Produits
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    search: (query: string) => [...queryKeys.products.all, 'search', query] as const,
  },
  
  // Catégories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (storeId: string) => [...queryKeys.categories.lists(), storeId] as const,
  },
  
  // Media
  media: {
    all: ['media'] as const,
    lists: () => [...queryKeys.media.all, 'list'] as const,
    list: (storeId: string) => [...queryKeys.media.lists(), storeId] as const,
  },
  
  // Stock (données dynamiques)
  stock: {
    all: ['stock'] as const,
    product: (productId: string) => [...queryKeys.stock.all, productId] as const,
  },
  
  // Panier
  cart: {
    all: ['cart'] as const,
    current: (storeId: string) => [...queryKeys.cart.all, storeId] as const,
  },
  
  // Commandes
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (storeId: string) => [...queryKeys.orders.lists(), storeId] as const,
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
  },
} as const

/**
 * Préfetching intelligent pour les données critiques
 */
export const prefetchCriticalData = async (storeId: string) => {
  // Précharger les catégories (navigation)
  await queryClient.prefetchQuery({
    queryKey: queryKeys.categories.list(storeId),
    queryFn: () => fetch(`/api/stores/${storeId}/categories`).then(res => res.json()),
    staleTime: 10 * 60 * 1000, // 10 minutes pour les catégories
  })
  
  // Précharger les produits populaires
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.list({ storeId, limit: 12, sort: 'popular' }),
    queryFn: () => fetch(`/api/stores/${storeId}/products?limit=12&sort=popular`).then(res => res.json()),
    staleTime: 2 * 60 * 1000, // 2 minutes pour les produits populaires
  })
}

/**
 * Invalidation intelligente du cache
 */
export const invalidateCache = {
  // Invalider tous les produits
  allProducts: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  
  // Invalider un produit spécifique
  product: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) }),
  
  // Invalider les listes de produits
  productLists: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() }),
  
  // Invalider le stock d'un produit
  stock: (productId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.stock.product(productId) }),
  
  // Invalider le panier
  cart: (storeId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.cart.current(storeId) }),
} 