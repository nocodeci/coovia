// Service API pour l'application mobile Wozif

// Utilise EXPO_PUBLIC_API_URL si défini, sinon fallback local
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.191:8000/api').replace(/\/$/, '')

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string; // Format de l'API Laravel
  updated_at: string; // Format de l'API Laravel
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category: string;
  stock?: number; // Peut être null
  stock_quantity?: number; // Nom alternatif dans Laravel
  status: 'active' | 'inactive';
  created_at?: string; // Format Laravel
  updated_at?: string; // Format Laravel
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
    console.log('🌐 API Request:', url)
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    }

    if (this.token) {
      ;(headers as Record<string, string>).Authorization = `Bearer ${this.token}`
      console.log('🔑 Token utilisé:', this.token.substring(0, 20) + '...')
    }

    try {
      console.log('📤 Envoi de la requête...')
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log('📥 Réponse reçue:', response.status, response.statusText)

      if (!response.ok) {
        let msg = `HTTP ${response.status}: ${response.statusText}`
        try {
          const data = await response.json()
          msg = data.message || msg
          console.error('❌ Erreur API:', msg)
          throw new Error(msg)
        } catch {
          console.error('❌ Erreur API:', msg)
          throw new Error(msg)
        }
      }

      // Tente JSON sinon renvoie texte
      const contentType = response.headers.get('content-type') || ''
      const result = contentType.includes('application/json') ? response.json() : response.text()
      console.log('✅ Réponse API réussie')
      return result
    } catch (error) {
      console.error('❌ API request failed:', error)
      throw error
    }
  }

  // Santé de l'API (public)
  async health() {
    return this.request('/health')
  }

  // Produits publics (public)
  async getPublicProducts(): Promise<{ success: boolean; products: Product[]; count: number }> {
    return this.request('/products')
  }

  // Authentication
  async login(email: string, password: string) {
    try {
      console.log('🔐 Tentative de connexion avec:', email)
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      
      console.log('📥 Réponse de connexion:', response)
      
      if ((response as any)?.success && (response as any)?.token) {
        console.log('✅ Connexion réussie, token défini')
        this.setToken((response as any).token)
        return response
      } else {
        console.error('❌ Réponse de connexion invalide:', response)
        throw new Error('Réponse de connexion invalide')
      }
    } catch (error) {
      console.error('❌ Échec de connexion:', error)
      throw error
    }
  }

  async logout() {
    this.token = null
    return this.request('/auth/logout', { method: 'POST' })
  }

  // Stores protégés (exemples, nécessitent token)
  async getStores(): Promise<Store[]> {
    try {
      const response = await this.request('/stores')
      console.log('📦 Réponse brute de getStores:', response)
      
      // L'API retourne { data: [...], success: true, message: "..." }
      // On doit extraire le tableau data
      if (response && response.data && Array.isArray(response.data)) {
        console.log('✅ Boutiques extraites:', response.data.length)
        return response.data
      } else {
        console.error('❌ Format de réponse inattendu:', response)
        return []
      }
    } catch (error) {
      console.error('Erreur lors du chargement des boutiques:', error)
      return []
    }
  }

  async getStore(id: string): Promise<Store> {
    return this.request(`/stores/${id}`)
  }

  async createStore(data: Partial<Store>): Promise<Store> {
    return this.request('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateStore(id: string, data: Partial<Store>): Promise<Store> {
    return this.request(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Products protégés (exemples)
  async getProducts(storeId: string): Promise<Product[]> {
    try {
      const response = await this.request(`/stores/${storeId}/products`)
      console.log('📦 Réponse brute de getProducts:', response)
      
      // L'API retourne { data: [...], success: true, message: "..." }
      if (response && response.data && Array.isArray(response.data)) {
        console.log('✅ Produits extraits:', response.data.length)
        return response.data
      } else {
        console.error('❌ Format de réponse inattendu pour les produits:', response)
        return []
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
      return []
    }
  }

  async getProduct(storeId: string, productId: string): Promise<Product> {
    return this.request(`/stores/${storeId}/products/${productId}`)
  }

  async createProduct(storeId: string, data: Partial<Product>): Promise<Product> {
    return this.request(`/stores/${storeId}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProduct(storeId: string, productId: string, data: Partial<Product>): Promise<Product> {
    return this.request(`/stores/${storeId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(storeId: string, productId: string): Promise<void> {
    return this.request(`/stores/${storeId}/products/${productId}`, {
      method: 'DELETE',
    })
  }

  // User profile
  async getUserProfile(): Promise<User> {
    return this.request('/user/profile')
  }

  async updateUserProfile(data: Partial<User>): Promise<User> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Statistics (protégé)
  async getStoreStats(storeId: string, period: 'day' | 'week' | 'month' | 'year' = 'month') {
    return this.request(`/stores/${storeId}/stats?period=${period}`)
  }

  // Dashboard KPIs (protégé)
  async getDashboardKPIs(storeId: string) {
    try {
      const response = await this.request(`/dashboard/stores/${storeId}/stats`)
      return response
    } catch (error) {
      // Fallback avec des données de démonstration si l'API n'est pas disponible
      return {
        revenueToday: 1247.50,
        revenue7d: 8934.20,
        ordersToday: 12,
        orders7d: 89
      }
    }
  }

  // Orders récentes (protégé)
  async getRecentOrders(storeId: string, limit: number = 10) {
    try {
      const response = await this.request(`/stores/${storeId}/orders?limit=${limit}&sort=desc`)
      return response
    } catch (error) {
      // Fallback avec des données de démonstration
      return [
        {
          id: '1',
          total: 149.99,
          currency: 'EUR',
          status: 'paid',
          createdAt: new Date().toISOString(),
          customerName: 'Marie Dupont',
          customerEmail: 'marie@email.com'
        },
        {
          id: '2',
          total: 89.50,
          currency: 'EUR',
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          customerName: 'Jean Martin',
          customerEmail: 'jean@email.com'
        },
        {
          id: '3',
          total: 234.00,
          currency: 'EUR',
          status: 'shipped',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          customerName: 'Sophie Bernard',
          customerEmail: 'sophie@email.com'
        }
      ]
    }
  }
}

export const apiService = new ApiService()
export default apiService
