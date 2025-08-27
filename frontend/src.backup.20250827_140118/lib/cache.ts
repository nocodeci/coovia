interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live en millisecondes
}

class Cache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const isExpired = Date.now() - item.timestamp > item.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Méthode pour nettoyer les éléments expirés
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Instance globale du cache
export const cache = new Cache()

// Nettoyer le cache toutes les 5 minutes
setInterval(() => {
  cache.cleanup()
}, 5 * 60 * 1000)

// Clés de cache communes
export const CACHE_KEYS = {
  STORES: 'stores',
  USER: 'user',
  STORE_STATS: (storeId: string) => `store_stats_${storeId}`,
  STORE_DETAILS: (storeId: string) => `store_details_${storeId}`,
  PRODUCTS: (storeId: string) => `products_${storeId}`,
  CATEGORIES: 'categories',
  ORDERS: (storeId: string) => `orders_${storeId}`,
  CUSTOMERS: (storeId: string) => `customers_${storeId}`,
  ANALYTICS: (storeId: string) => `analytics_${storeId}`,
  REVENUE_CHART: (storeId: string) => `revenue_chart_${storeId}`,
  SALES_CHART: (storeId: string) => `sales_chart_${storeId}`,
  DASHBOARD_DATA: (storeId: string) => `dashboard_${storeId}`,
} as const 