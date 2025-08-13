import apiService from '@/lib/api'

export interface CreateStoreData {
  name: string
  slug?: string // Rendre optionnel pour permettre la génération automatique
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
  slug?: string
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
  data?: Store // Ajouter la propriété data pour la réponse de création
  store?: Store
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

class StoreService {
  private baseUrl = '/stores'

  /**
   * Créer une nouvelle boutique pour un utilisateur
   * Cette méthode est appelée après le Just-in-time registration
   */
  async createStore(data: CreateStoreData): Promise<StoreResponse> {
    try {
      // Validation des données requises
      if (!data.name) {
        throw new Error('Le nom de la boutique est requis')
      }
      
      if (!data.slug) {
        throw new Error('Le sous-domaine de la boutique est requis')
      }
      
      // Utiliser le slug fourni par l'utilisateur
      let slug = data.slug
      
      // Nettoyer le slug (supprimer les caractères spéciaux et les espaces)
      slug = slug.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
      
      // Vérifier si le slug est valide
      if (slug.length < 3) {
        throw new Error('Le sous-domaine doit contenir au moins 3 caractères')
      }
      
      // Vérifier si le slug est disponible
      const slugCheck = await this.checkSlugAvailability(slug)
      if (!slugCheck.available) {
        // Générer des suggestions
        const suggestions = this.generateSuggestions(slug)
        const suggestionsText = suggestions.length > 0 ? ` Suggestions: ${suggestions.join(', ')}` : ''
        throw new Error(`Ce nom de boutique n'est pas disponible.${suggestionsText}`)
      }
      
      // Préparer les données pour l'envoi
      const formData = new FormData()
      
      // Log pour debug (à supprimer plus tard)
      console.log('🔍 StoreService - Création boutique:', { name: data.name, slug })
      
      // Données de base
      formData.append('name', data.name)
      formData.append('slug', slug)
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
        formData.append('settings[monneroo][enabled]', data.settings.monneroo.enabled ? '1' : '0')
        if (data.settings.monneroo.secretKey) formData.append('settings[monneroo][secretKey]', data.settings.monneroo.secretKey)
        if (data.settings.monneroo.environment) formData.append('settings[monneroo][environment]', data.settings.monneroo.environment)
      }
      
      // Debug: vérifier le contenu du FormData (à supprimer plus tard)
      const entries = Array.from(formData.entries())
      console.log('🔍 StoreService - FormData créé avec', entries.length, 'champs')
      
      const response = await apiService.post(`${this.baseUrl}`, formData)
      return response
    } catch (error: any) {
      console.error('StoreService.createStore error:', error)
      
      // Si c'est une erreur de parsing JSON (souvent une erreur 404 ou 500)
      if (error.message.includes('Unexpected token')) {
        throw new Error('Erreur de communication avec le serveur. Vérifiez que le backend est accessible.')
      }
      
      // Si c'est une erreur réseau
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.')
      }
      
      // Retourner la réponse d'erreur du backend si disponible
      if (error.response?.data) {
        console.error('Backend error response:', error.response.data)
        return error.response.data
      }
      
      // Sinon, lancer une exception avec un message plus détaillé
      throw new Error(`Erreur lors de la création de la boutique: ${error.message}`)
    }
  }

  /**
   * Vérifier si un slug est disponible
   */
  async checkSlugAvailability(slug: string): Promise<{ available: boolean; message: string }> {
    try {
      const response = await apiService.get(`/stores/subdomain/${slug}/check`)
      return {
        available: response.success && !response.data?.exists,
        message: response.data?.message || 'Slug disponible'
      }
    } catch (error: any) {
      return {
        available: false,
        message: error.message || 'Erreur lors de la vérification'
      }
    }
  }

  /**
   * Générer des suggestions de slugs alternatifs
   */
  private generateSuggestions(baseSlug: string): string[] {
    const suggestions = []
    const base = baseSlug.replace(/-[0-9]+$/, '') // Enlever les chiffres à la fin
    
    // Ajouter des suffixes numériques
    for (let i = 1; i <= 3; i++) {
      suggestions.push(`${base}-${i}`)
    }
    
    // Ajouter des suffixes descriptifs
    const suffixes = ['pro', 'store', 'shop', 'digital', 'online', 'my', 'best']
    suffixes.forEach(suffix => {
      suggestions.push(`${base}-${suffix}`)
    })
    
    return suggestions.slice(0, 6) // Limiter à 6 suggestions
  }

  /**
   * Obtenir les informations de la boutique de l'utilisateur connecté
   */
  async getMyStore(): Promise<StoreResponse> {
    try {
      const response = await apiService.get(`${this.baseUrl}/my-store`)
      return response
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
      return response
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
        store: response.store
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
