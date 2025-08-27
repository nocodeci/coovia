import apiService from '@/lib/api'

export interface MonerooConfig {
  secretKey: string
  environment: 'sandbox' | 'live'
  webhookUrl?: string
  isConnected: boolean
}

export interface MonerooConfigResponse {
  success: boolean
  data?: MonerooConfig
  message?: string
}

class MonerooConfigService {
  private baseUrl = '/moneroo-config'

  /**
   * Sauvegarder la configuration Moneroo
   */
  async saveConfig(config: Omit<MonerooConfig, 'isConnected'>): Promise<MonerooConfigResponse> {
    try {
      const response = await apiService.request(`${this.baseUrl}/store`, {
        method: 'POST',
        body: JSON.stringify({
          secret_key: config.secretKey,
          environment: config.environment,
          webhook_url: config.webhookUrl,
        })
      })

      return response
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde de la configuration Moneroo:', error)
      return {
        success: false,
        message: error.message || 'Erreur lors de la sauvegarde'
      }
    }
  }

  /**
   * Récupérer la configuration Moneroo de l'utilisateur
   */
  async getConfig(): Promise<MonerooConfigResponse> {
    try {
      const response = await apiService.request(`${this.baseUrl}/show`)
      
      // Mapper les données du backend vers le format frontend
      if (response.success && response.data) {
        const backendData = response.data as any
        const frontendData: MonerooConfig = {
          secretKey: backendData.secret_key || '',
          environment: backendData.environment || 'sandbox',
          webhookUrl: backendData.webhook_url || '',
          isConnected: backendData.is_connected || false
        }
        
        return {
          success: true,
          data: frontendData,
          message: response.message
        }
      }
      
      return response
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return {
          success: false,
          message: 'Aucune configuration trouvée'
        }
      }
      
      console.error('Erreur lors de la récupération de la configuration Moneroo:', error)
      return {
        success: false,
        message: error.message || 'Erreur lors de la récupération'
      }
    }
  }

  /**
   * Tester la configuration Moneroo
   */
  async testConfig(config: Omit<MonerooConfig, 'isConnected'>): Promise<MonerooConfigResponse> {
    try {
      const response = await apiService.request(`${this.baseUrl}/test`, {
        method: 'POST',
        body: JSON.stringify({
          secret_key: config.secretKey,
          environment: config.environment,
        })
      })

      return response
    } catch (error: any) {
      console.error('Erreur lors du test de la configuration Moneroo:', error)
      return {
        success: false,
        message: error.message || 'Erreur lors du test'
      }
    }
  }

  /**
   * Supprimer la configuration Moneroo
   */
  async deleteConfig(): Promise<MonerooConfigResponse> {
    try {
      const response = await apiService.request(`${this.baseUrl}/destroy`, {
        method: 'DELETE'
      })
      return response
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la configuration Moneroo:', error)
      return {
        success: false,
        message: error.message || 'Erreur lors de la suppression'
      }
    }
  }

  /**
   * Vérifier si l'utilisateur a une configuration Moneroo
   */
  async hasConfig(): Promise<boolean> {
    try {
      const response = await this.getConfig()
      return response.success && response.data?.isConnected === true
    } catch (error) {
      return false
    }
  }
}

export const monerooConfigService = new MonerooConfigService() 