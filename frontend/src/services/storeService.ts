import apiService from '@/lib/api'

export interface CreateStoreData {
  name: string
  description?: string
  category?: string
  address?: {
    street?: string
    city?: string
    country?: string
  }
  contact?: {
    email?: string
    phone?: string
  }
  settings?: {
    digitalDelivery?: boolean
    autoDelivery?: boolean
    paymentMethods?: string[]
    currency?: string
  }
}

export interface Store {
  id: number
  name: string
  description?: string
  address?: string
  phone?: string
  website?: string
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

export interface StoreResponse {
  success: boolean
  message: string
  store?: Store
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

class StoreService {
  private baseUrl = '/api/stores'

  /**
   * Créer une nouvelle boutique pour un utilisateur
   * Cette méthode est appelée après le Just-in-time registration
   */
  async createStore(data: CreateStoreData): Promise<StoreResponse> {
    try {
      const response = await apiService.post(`${this.baseUrl}/create`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de la boutique')
    }
  }

  /**
   * Obtenir les informations de la boutique de l'utilisateur connecté
   */
  async getMyStore(): Promise<StoreResponse> {
    try {
      const response = await apiService.get(`${this.baseUrl}/my-store`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la boutique')
    }
  }

  /**
   * Mettre à jour les informations de la boutique
   */
  async updateStore(data: Partial<CreateStoreData>): Promise<StoreResponse> {
    try {
      const response = await apiService.put(`${this.baseUrl}/my-store`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la boutique')
    }
  }

  /**
   * Vérifier si l'utilisateur a une boutique
   */
  async hasStore(): Promise<{ hasStore: boolean; store?: Store }> {
    try {
      const response = await apiService.get(`${this.baseUrl}/my-store`)
      return {
        hasStore: true,
        store: response.data.store
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { hasStore: false }
      }
      throw new Error('Erreur lors de la vérification de la boutique')
    }
  }
}

export const storeService = new StoreService()
