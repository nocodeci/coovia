import { toast } from "sonner"

// Fonctions utilitaires pour le debug
declare global {
  interface Window {
    fixToken: () => void
    cleanupDebug: () => void
    enableDebug: () => void
    disableDebug: () => void
  }
}

// Variable globale pour contrôler les logs de debug
let DEBUG_MODE = false

// Fonction pour activer le mode debug
export const enableDebug = () => {
  DEBUG_MODE = true
  console.log('🔧 Mode debug activé')
}

// Fonction pour désactiver le mode debug
export const disableDebug = () => {
  DEBUG_MODE = false
  console.log('🔧 Mode debug désactivé')
}

// Fonction pour nettoyer les logs de debug
export const cleanupDebug = () => {
  console.clear()
  console.log('🧹 Logs de debug nettoyés')
}

// Fonction pour corriger le token
export const fixToken = () => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    console.log('🔧 Token trouvé:', token.substring(0, 20) + '...')
  } else {
    console.log('⚠️ Aucun token trouvé')
  }
}

// Fonction de log conditionnel
export const debugLog = (message: string, data?: any) => {
  if (DEBUG_MODE) {
    console.log(message, data)
  }
}

// Ajouter les fonctions à la fenêtre globale
if (typeof window !== 'undefined') {
  window.fixToken = fixToken
  window.cleanupDebug = cleanupDebug
  window.enableDebug = enableDebug
  window.disableDebug = disableDebug
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

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
    this.token = localStorage.getItem('auth_token')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
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

  // Auth methods
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
    }
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async checkAuth() {
    return this.request('/auth/me')
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

  // Store methods
  async getStores() {
    return this.request('/stores')
  }

  async getStore(storeId: string) {
    return this.request(`/stores/${storeId}`)
  }

  async createStore(storeData: any) {
    return this.request('/stores', {
      method: 'POST',
      body: JSON.stringify(storeData),
    })
  }

  async updateStore(storeId: string, storeData: any) {
    return this.request(`/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    })
  }

  async deleteStore(storeId: string) {
    return this.request(`/stores/${storeId}`, {
      method: 'DELETE',
    })
  }

  // Store stats methods
  async getStoreStats(storeId: string) {
    return this.request(`/dashboard/stores/${storeId}/stats`)
  }

  async getRevenueChart(storeId: string, timeRange: string = '30d') {
    return this.request(`/dashboard/stores/${storeId}/revenue-chart?timeRange=${timeRange}`)
  }

  async getStoreRecentOrders(storeId: string) {
    return this.request(`/dashboard/stores/${storeId}/recent-orders`)
  }

  async getStoreSalesChart(storeId: string) {
    return this.request(`/dashboard/stores/${storeId}/sales-chart`)
  }

  // Product methods
  async getStoreProducts(storeId: string) {
    return this.request(`/stores/${storeId}/products`)
  }

  async createProduct(storeId: string, productData: any) {
    return this.request(`/stores/${storeId}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(productId: string, productData: any) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(productId: string) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
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
}

const apiService = new ApiService()
export default apiService
  