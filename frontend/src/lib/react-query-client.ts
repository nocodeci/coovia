import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache agressif pour les données statiques (stores, produits)
      staleTime: 10 * 60 * 1000, // 10 minutes (augmenté)
      
      // Cache plus long pour éviter les re-fetch
      gcTime: 30 * 60 * 1000, // 30 minutes (augmenté)
      
      // Retry intelligent basé sur le type d'erreur
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs 4xx (client)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      
      // Backoff exponentiel optimisé
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      
      // Optimisations UX
      refetchOnWindowFocus: false, // Éviter les re-fetch agressifs
      refetchOnReconnect: true,
      refetchOnMount: false, // Éviter les re-fetch inutiles
      
      // Cache persistant pour les données critiques
      networkMode: 'online',
    },
    mutations: {
      // Pas de retry pour les mutations (éviter les doublons)
      retry: false,
      
      // Gestion d'erreurs centralisée
      onError: (error: any) => {
        console.error('Mutation error:', error)
      },
    },
  },
})

// Configuration pour les clés de requête
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    check: ['auth', 'check'] as const,
  },
  
  // Stores
  stores: {
    all: ['stores'] as const,
    list: () => [...queryKeys.stores.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.stores.all, 'detail', id] as const,
    stats: (id: string) => [...queryKeys.stores.all, 'stats', id] as const,
    revenue: (id: string, timeRange?: string) => 
      [...queryKeys.stores.all, 'revenue', id, timeRange] as const,
    sales: (id: string) => [...queryKeys.stores.all, 'sales', id] as const,
    orders: (id: string) => [...queryKeys.stores.all, 'orders', id] as const,
  },
  
  // Products
  products: {
    all: ['products'] as const,
    list: (storeId: string, filters?: any) => 
      [...queryKeys.products.all, 'list', storeId, filters] as const,
    detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
    categories: ['products', 'categories'] as const,
  },
  
  // Dashboard
  dashboard: {
    stats: (storeId: string) => ['dashboard', 'stats', storeId] as const,
    charts: (storeId: string) => ['dashboard', 'charts', storeId] as const,
  },
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  meta?: any
  pagination?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

// Types pour les stores
export interface Store {
  id: string
  name: string
  slug: string
  description?: string
  category?: string
  status: string
  owner_id: string
  address?: any
  contact?: any
  settings?: any
  created_at: string
  updated_at: string
}

// Types pour les produits
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  sale_price?: number
  sku: string
  category: string
  status: string
  stock_quantity: number
  min_stock_level: number
  images?: string[]
  files?: string[]
  created_at: string
  updated_at: string
}

// Types pour les stats
export interface StoreStats {
  revenue: {
    current: number
    growth: number
  }
  subscriptions: {
    current: number
    growth: number
  }
  sales: {
    current: number
    growth: number
  }
  active: {
    current: number
    recent: number
  }
} 