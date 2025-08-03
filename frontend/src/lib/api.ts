import { toast } from "sonner"
import { cache, CACHE_KEYS } from "./cache"

// Fonction de log conditionnel (pour les logs de cache uniquement)
export const debugLog = (message: string, data?: any) => {
  // Logs silencieux en production
  if (import.meta.env.DEV) {
    console.log(message, data)
  }
}

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  meta?: any
  token?: string
  user?: any
}

class ApiService {
  private baseUrl: string
  private token: string | null = null
  private requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
    this.token = localStorage.getItem('auth_token')
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)

      let data: any
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        if (response.status === 422) {
          // Validation errors
          const errorMessage = data.message || 'Erreurs de validation'
          const validationErrors = data.errors ? Object.values(data.errors).flat() : []
          throw new Error(`${errorMessage}: ${validationErrors.join(', ')}`)
        }
        
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return data
    } catch (error: any) {
      console.error('🚨 API Error:', error)
      throw error
    }
  }

  // Auth methods - OPTIMISÉ
  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    // La réponse de l'API Laravel a une structure différente
    if (response.success && response.token) {
      this.token = response.token
      if (this.token) {
        localStorage.setItem('auth_token', this.token)
      }
    }
    
    return response
  }

  setToken(token: string) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } finally {
      this.token = null
      localStorage.removeItem('auth_token')
      
      // Nettoyer tout le cache lors de la déconnexion
      cache.clear()
      this.requestCache.clear()
    }
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async checkAuth() {
    // Vérifier le cache d'abord avec TTL plus long
    const cachedUser = cache.get(CACHE_KEYS.USER)
    if (cachedUser) {
      return { success: true, user: cachedUser }
    }
    
    const response = await this.request('/auth/check')
    
    // Mettre en cache si la requête réussit avec TTL plus long
    if (response.success && response.user) {
      cache.set(CACHE_KEYS.USER, response.user, 60 * 60 * 1000) // 1 heure
    }
    
    return response
  }

  // MFA methods
  async verifyMfa(code: string) {
    return this.request('/auth/mfa/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  async setupMfa() {
    return this.request('/auth/mfa/setup', { method: 'POST' })
  }

  async enableMfa(code: string) {
    return this.request('/auth/mfa/enable', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  async disableMfa(password: string) {
    return this.request('/auth/mfa/disable', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  }

  async regenerateBackupCodes() {
    return this.request('/auth/mfa/backup-codes', { method: 'POST' })
  }

  // Store methods - OPTIMISÉ
  async getStores() {
    // Vérifier le cache d'abord avec TTL plus long
    const cachedStores = cache.get(CACHE_KEYS.STORES)
    if (cachedStores) {
      return { success: true, data: cachedStores }
    }
    
    const response = await this.request('/stores')
    
    // Mettre en cache si la requête réussit avec TTL plus long
    if (response.success && response.data) {
      cache.set(CACHE_KEYS.STORES, response.data, 15 * 60 * 1000) // 15 minutes
    }
    
    return response
  }

  async getStore(storeId: string) {
    return this.request(`/stores/${storeId}`)
  }

  async createStore(storeData: any) {
    const response = await this.request('/stores', {
      method: 'POST',
      body: JSON.stringify(storeData),
    })
    
    // Invalider le cache des stores après création
    if (response.success) {
      cache.delete(CACHE_KEYS.STORES)
    }
    
    return response
  }

  async updateStore(storeId: string, storeData: any) {
    const response = await this.request(`/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    })
    
    // Invalider les caches après mise à jour
    if (response.success) {
      cache.delete(CACHE_KEYS.STORES)
      cache.delete(`store_${storeId}`)
    }
    
    return response
  }

  async deleteStore(storeId: string) {
    const response = await this.request(`/stores/${storeId}`, {
      method: 'DELETE',
    })
    
    // Invalider les caches après suppression
    if (response.success) {
      cache.delete(CACHE_KEYS.STORES)
      cache.delete(`store_${storeId}`)
    }
    
    return response
  }

  // Store stats methods - OPTIMISÉ
  async getStoreStats(storeId: string) {
    // Vérifier le cache d'abord
    const cacheKey = CACHE_KEYS.STORE_STATS(storeId)
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return { success: true, data: cachedData, message: 'Données depuis le cache' }
    }

    const response = await this.request(`/dashboard/stores/${storeId}/stats`)
    
    // Mettre en cache si succès avec TTL plus long
    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 10 * 60 * 1000) // 10 minutes
    }
    
    return response
  }

  async getRevenueChart(storeId: string, timeRange: string = '30d') {
    // Vérifier le cache d'abord
    const cacheKey = CACHE_KEYS.REVENUE_CHART(storeId)
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return { success: true, data: cachedData, message: 'Données depuis le cache' }
    }

    const response = await this.request(`/dashboard/stores/${storeId}/revenue-chart?timeRange=${timeRange}`)
    
    // Mettre en cache si succès avec TTL plus long
    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 15 * 60 * 1000) // 15 minutes
    }
    
    return response
  }

  async getStoreRecentOrders(storeId: string) {
    // Vérifier le cache d'abord
    const cacheKey = CACHE_KEYS.ORDERS(storeId)
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return { success: true, data: cachedData, message: 'Données depuis le cache' }
    }

    const response = await this.request(`/dashboard/stores/${storeId}/recent-orders`)
    
    // Mettre en cache si succès avec TTL plus long
    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 5 * 60 * 1000) // 5 minutes
    }
    
    return response
  }

  async getStoreSalesChart(storeId: string) {
    // Vérifier le cache d'abord
    const cacheKey = CACHE_KEYS.SALES_CHART(storeId)
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return { success: true, data: cachedData, message: 'Données depuis le cache' }
    }

    const response = await this.request(`/dashboard/stores/${storeId}/sales-chart`)
    
    // Mettre en cache si succès avec TTL plus long
    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 15 * 60 * 1000) // 15 minutes
    }
    
    return response
  }

  // Product methods - OPTIMISÉ avec pagination
  async getStoreProducts(storeId: string, page: number = 1, perPage: number = 20) {
    // Vérifier le cache d'abord
    const cacheKey = `${CACHE_KEYS.PRODUCTS(storeId)}_page_${page}_per_${perPage}`
    const cachedProducts = cache.get(cacheKey)
    if (cachedProducts) {
      return { success: true, data: cachedProducts, message: 'Produits depuis le cache' }
    }

    const response = await this.request(`/stores/${storeId}/products?page=${page}&per_page=${perPage}`)
    
    // Mettre en cache si succès avec TTL plus long
    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 15 * 60 * 1000) // 15 minutes
    }
    
    return response
  }

  async createProduct(storeId: string, productData: any) {
    const response = await this.request(`/stores/${storeId}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    })
    
    // Invalider le cache des produits après création
    if (response.success) {
      this.invalidateProductCache(storeId)
    }
    
    return response
  }

  async updateProduct(productId: string, productData: any) {
    const response = await this.request(`/public/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
    
    // Invalider le cache des produits après mise à jour
    if (response.success) {
      this.invalidateProductCache(productId)
    }
    
    return response
  }

  async deleteProduct(productId: string) {
    const response = await this.request(`/public/products/${productId}`, {
      method: 'DELETE',
    })
    
    // Invalider le cache des produits après suppression
    if (response.success) {
      this.invalidateProductCache(productId)
    }
    
    return response
  }

  // Méthode pour invalider le cache des produits
  private invalidateProductCache(storeId: string) {
    // Supprimer tous les caches de produits de cette boutique
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(`products_${storeId}`)) {
        cache.delete(key)
      }
    })
  }

  // Category methods
  async getCategories() {
    return this.request('/categories')
  }

  async createCategory(categoryData: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  }

  async updateCategory(categoryId: string, categoryData: any) {
    return this.request(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  }

  async deleteCategory(categoryId: string) {
    return this.request(`/categories/${categoryId}`, {
      method: 'DELETE',
    })
  }

  // Media methods
  async getStoreMedia(storeId: string, params: {
    type?: string
    search?: string
    sortBy?: string
    sortOrder?: string
    page?: number
    perPage?: number
  } = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.type && params.type !== 'all') {
      queryParams.append('type', params.type)
    }
    if (params.search) {
      queryParams.append('search', params.search)
    }
    if (params.sortBy) {
      queryParams.append('sort_by', params.sortBy)
    }
    if (params.sortOrder) {
      queryParams.append('sort_order', params.sortOrder)
    }
    if (params.page) {
      queryParams.append('page', params.page.toString())
    }
    if (params.perPage) {
      queryParams.append('per_page', params.perPage.toString())
    }

    const queryString = queryParams.toString()
    const endpoint = `/stores/${storeId}/media${queryString ? `?${queryString}` : ''}`
    
    return this.request(endpoint)
  }

  async uploadMedia(storeId: string, files: File[]) {
    const formData = new FormData()
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })

    return this.request(`/stores/${storeId}/media`, {
      method: 'POST',
      headers: {
        // Ne pas définir Content-Type pour FormData
      },
      body: formData,
    })
  }

  async updateMedia(storeId: string, mediaId: string, data: { name: string }) {
    return this.request(`/stores/${storeId}/media/${mediaId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteMedia(storeId: string, mediaId: string) {
    return this.request(`/stores/${storeId}/media/${mediaId}`, {
      method: 'DELETE',
    })
  }
}

const apiService = new ApiService()
export default apiService
  