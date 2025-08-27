import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps avant que les données soient considérées comme périmées
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Temps de cache (données gardées en mémoire même si non utilisées)
      gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
      
      // Nombre de tentatives en cas d'échec
      retry: 2,
      
      // Temps entre les tentatives
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch automatique quand la fenêtre reprend le focus
      refetchOnWindowFocus: false,
      
      // Refetch automatique quand la connexion reprend
      refetchOnReconnect: true,
      
      // Refetch automatique quand le composant remonte
      refetchOnMount: true,
    },
    mutations: {
      // Nombre de tentatives pour les mutations
      retry: 1,
      
      // Temps entre les tentatives pour les mutations
      retryDelay: 1000,
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