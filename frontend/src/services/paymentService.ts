import apiService from '@/lib/api'

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  city?: string
  country?: string
  zipCode?: string
}

export interface PaymentItem {
  name: string
  quantity: number
  unit_price: number
  total_price: number
  description?: string
}

export interface PaymentData {
  amount: number
  currency?: string
  description: string
  store_id?: string
  customer_info?: CustomerInfo
  items?: PaymentItem[]
}

export interface PaymentResult {
  success: boolean
  gateway_used: string
  redirect_url?: string
  payment_id?: string
  message: string
}

export interface PaymentStats {
  gateway: string
  total_payments: number
  successful_payments: number
  total_amount: number
}

export interface PaymentHistory {
  id: number
  user_id: string
  store_id?: string
  gateway: string
  payment_id?: string
  amount: number
  currency: string
  description?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  created_at: string
  paid_at?: string
}

class PaymentService {
  private baseUrl = '/payments'

  /**
   * Créer un paiement avec détection automatique de la passerelle
   */
  async createPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: `${this.baseUrl}/create`,
        data: paymentData
      })

      return response.data
    } catch (error: any) {
      console.error('Payment creation error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du paiement')
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPaymentStatus(paymentId: string, gateway: string): Promise<any> {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: `${this.baseUrl}/check-status`,
        data: {
          payment_id: paymentId,
          gateway: gateway
        }
      })

      return response.data
    } catch (error: any) {
      console.error('Payment status check error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du statut')
    }
  }

  /**
   * Obtenir les statistiques de paiement
   */
  async getPaymentStats(): Promise<{ success: boolean; stats?: PaymentStats[]; message?: string }> {
    try {
      const response = await apiService.request({
        method: 'GET',
        url: `${this.baseUrl}/stats`
      })

      return response.data
    } catch (error: any) {
      console.error('Payment stats error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des statistiques')
    }
  }

  /**
   * Obtenir l'historique des paiements
   */
  async getPaymentHistory(limit: number = 10): Promise<{ success: boolean; payments?: PaymentHistory[]; message?: string }> {
    try {
      const response = await apiService.request({
        method: 'GET',
        url: `${this.baseUrl}/history`,
        params: { limit }
      })

      return response.data
    } catch (error: any) {
      console.error('Payment history error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'historique')
    }
  }

  /**
   * Détecter la passerelle de paiement pour l'utilisateur
   */
  async detectGateway(): Promise<{ success: boolean; gateway: string; priority: string; message: string }> {
    try {
      const response = await apiService.request({
        method: 'GET',
        url: `${this.baseUrl}/detect-gateway`
      })

      return response.data
    } catch (error: any) {
      console.error('Gateway detection error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la détection de la passerelle')
    }
  }

  /**
   * Rediriger vers la page de paiement
   */
  redirectToPayment(redirectUrl: string): void {
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

  /**
   * Formater le montant selon la devise
   */
  formatAmount(amount: number, currency: string = 'XOF'): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  /**
   * Obtenir le nom de la passerelle
   */
  getGatewayName(gateway: string): string {
    const gatewayNames: Record<string, string> = {
      'moneroo': 'Moneroo',
      'paydunya': 'PayDunya',
      'pawapay': 'Pawapay',
      'default': 'Passerelle par défaut'
    }

    return gatewayNames[gateway] || gateway
  }

  /**
   * Obtenir la couleur de la passerelle
   */
  getGatewayColor(gateway: string): string {
    const gatewayColors: Record<string, string> = {
      'moneroo': 'bg-blue-500',
      'paydunya': 'bg-green-500',
      'pawapay': 'bg-purple-500',
      'default': 'bg-gray-500'
    }

    return gatewayColors[gateway] || 'bg-gray-500'
  }

  /**
   * Obtenir l'icône de la passerelle
   */
  getGatewayIcon(gateway: string): string {
    const gatewayIcons: Record<string, string> = {
      'moneroo': '💳',
      'paydunya': '🏦',
      'pawapay': '📱',
      'default': '💳'
    }

    return gatewayIcons[gateway] || '💳'
  }
}

export default new PaymentService() 