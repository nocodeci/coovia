import apiService from '@/lib/api'

export interface CreateStoreData {
  name: string
  slug: string
  description?: string
  logo?: File
  productType?: string
  productCategories?: string[]
  address?: {
    city?: string
  }
  contact?: {
    email?: string
    phone?: string
  }
  settings?: {
    paymentMethods?: string[]
    monneroo?: {
      enabled: boolean
      secretKey?: string
      environment?: string
    }
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
      // Préparer les données pour l'envoi
      const formData = new FormData()
      
      // Données de base
      formData.append('name', data.name)
      formData.append('slug', data.slug)
      if (data.description) formData.append('description', data.description)
      if (data.logo) formData.append('logo', data.logo)
      if (data.productType) formData.append('productType', data.productType)
      if (data.productCategories) formData.append('productCategories', JSON.stringify(data.productCategories))
      
      // Adresse
      if (data.address?.city) formData.append('address[city]', data.address.city)
      
      // Contact
      if (data.contact?.email) formData.append('contact[email]', data.contact.email)
      if (data.contact?.phone) formData.append('contact[phone]', data.contact.phone)
      
      // Paramètres
      if (data.settings?.paymentMethods) formData.append('settings[paymentMethods]', JSON.stringify(data.settings.paymentMethods))
      if (data.settings?.currency) formData.append('settings[currency]', data.settings.currency)
      
      // Configuration Monneroo
      if (data.settings?.monneroo) {
        formData.append('settings[monneroo][enabled]', data.settings.monneroo.enabled.toString())
        if (data.settings.monneroo.secretKey) formData.append('settings[monneroo][secretKey]', data.settings.monneroo.secretKey)
        if (data.settings.monneroo.environment) formData.append('settings[monneroo][environment]', data.settings.monneroo.environment)
      }
      
      const response = await apiService.post(`${this.baseUrl}/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
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
