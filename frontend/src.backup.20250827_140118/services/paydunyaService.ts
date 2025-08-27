import apiService from '@/lib/api'

export interface PayDunyaInvoiceData {
  amount: number
  description: string
  store_name?: string
  customer_info?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
  }
  items?: Array<{
    name: string
    quantity: number
    unit_price: number
    total_price: number
    description?: string
  }>
  store_id?: string
}

export interface PayDunyaPaymentData {
  customer_name: string
  customer_email: string
  phone_number: string
  invoice_token?: string
  payment_token?: string
  authorization_code?: string
}

export interface PayDunyaCardData {
  full_name: string
  email: string
  card_number: string
  card_cvv: string
  card_expired_date_year: string
  card_expired_date_month: string
  token: string
}

export interface PayDunyaResult {
  success: boolean
  invoice_url?: string
  token?: string
  url?: string
  om_url?: string
  maxit_url?: string
  message: string
  error?: string
}

class PayDunyaService {
  private baseUrl = '/paydunya'

  /**
   * Créer une facture PayDunya
   */
  async createInvoice(data: PayDunyaInvoiceData): Promise<PayDunyaResult> {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: `${this.baseUrl}/create-invoice`,
        data
      })

      return response.data
    } catch (error: any) {
      console.error('PayDunya invoice creation error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de la facture PayDunya')
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  async checkStatus(token: string): Promise<any> {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: `${this.baseUrl}/check-status`,
        data: { token }
      })

      return response.data
    } catch (error: any) {
      console.error('PayDunya status check error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du statut')
    }
  }

  /**
   * Paiement par Orange Money Sénégal (QR Code)
   */
  async payWithOrangeMoneyQR(data: PayDunyaPaymentData): Promise<PayDunyaResult> {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: `${this.baseUrl}/orange-money-qr`,
        data
      })

      return response.data
    } catch (error: any) {
      console.error('Orange Money QR payment error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors du paiement Orange Money QR')
    }
  }

  /**
   * Paiement par Orange Money Sénégal (OTP)
   */
  async payWithOrangeMoneyOTP(data: PayDunyaPaymentData & { authorization_code: string }): Promise<PayDunyaResult> {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: `${this.baseUrl}/orange-money-otp`,
        data
      })

      return response.data
    } catch (error: any) {
      console.error('Orange Money OTP payment error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors du paiement Orange Money OTP')
    }
  }

  /**
   * Paiement par Free Money Sénégal
   */
  async payWithFreeMoney(data: PayDunyaPaymentData): Promise<PayDunyaResult> {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: `${this.baseUrl}/free-money`,
        data
      })

      return response.data
    } catch (error: any) {
      console.error('Free Money payment error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors du paiement Free Money')
    }
  }

  /**
   * Paiement par Wave Sénégal
   */
  async payWithWave(data: PayDunyaPaymentData): Promise<PayDunyaResult> {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: `${this.baseUrl}/wave`,
        data
      })

      return response.data
    } catch (error: any) {
      console.error('Wave payment error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors du paiement Wave')
    }
  }

  /**
   * Paiement par carte bancaire
   */
  async payWithCard(data: PayDunyaCardData): Promise<PayDunyaResult> {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: `${this.baseUrl}/card`,
        data
      })

      return response.data
    } catch (error: any) {
      console.error('Card payment error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors du paiement par carte')
    }
  }

  /**
   * Valider les clés API PayDunya
   */
  async validateApiKeys(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.request({
        method: 'GET',
        url: `${this.baseUrl}/validate-keys`
      })

      return response.data
    } catch (error: any) {
      console.error('PayDunya API validation error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la validation des clés API')
    }
  }

  /**
   * Obtenir les méthodes de paiement supportées
   */
  async getSupportedMethods(): Promise<{
    success: boolean
    data?: {
      methods: Record<string, any>
      countries: Record<string, string[]>
      fees: Record<string, number>
    }
    message?: string
  }> {
    try {
      const response = await apiService.request({
        method: 'GET',
        url: `${this.baseUrl}/supported-methods`
      })

      return response.data
    } catch (error: any) {
      console.error('PayDunya methods error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des méthodes')
    }
  }

  /**
   * Rediriger vers la page de paiement
   */
  redirectToPayment(url: string): void {
    if (url) {
      window.location.href = url
    }
  }

  /**
   * Obtenir les méthodes de paiement par pays
   */
  getPaymentMethodsByCountry(country: string): string[] {
    const countryMethods: Record<string, string[]> = {
      'Sénégal': [
        'orange_money_senegal',
        'free_money_senegal',
        'wave_senegal',
        'expresso_senegal',
        'wizall_senegal'
      ],
      'Côte d\'Ivoire': [
        'orange_money_ci',
        'mtn_ci',
        'moov_ci',
        'wave_ci'
      ],
      'Burkina Faso': [
        'orange_money_burkina',
        'moov_burkina'
      ],
      'Bénin': [
        'moov_benin',
        'mtn_benin'
      ],
      'Togo': [
        't_money_togo',
        'moov_togo'
      ],
      'Mali': [
        'orange_money_mali',
        'moov_mali'
      ]
    }

    return countryMethods[country] || []
  }

  /**
   * Obtenir le nom de la méthode de paiement
   */
  getPaymentMethodName(method: string): string {
    const methodNames: Record<string, string> = {
      'orange_money_senegal': 'Orange Money Sénégal',
      'free_money_senegal': 'Free Money Sénégal',
      'wave_senegal': 'Wave Sénégal',
      'expresso_senegal': 'Expresso Sénégal',
      'wizall_senegal': 'Wizall Sénégal',
      'orange_money_ci': 'Orange Money Côte d\'Ivoire',
      'mtn_ci': 'MTN Côte d\'Ivoire',
      'moov_ci': 'Moov Côte d\'Ivoire',
      'wave_ci': 'Wave Côte d\'Ivoire',
      'orange_money_burkina': 'Orange Money Burkina Faso',
      'moov_burkina': 'Moov Burkina Faso',
      'moov_benin': 'Moov Bénin',
      'mtn_benin': 'MTN Bénin',
      't_money_togo': 'T-Money Togo',
      'moov_togo': 'Moov Togo',
      'orange_money_mali': 'Orange Money Mali',
      'moov_mali': 'Moov Mali',
      'paydunya': 'PayDunya',
      'card': 'Carte Bancaire'
    }

    return methodNames[method] || method
  }

  /**
   * Obtenir l'icône de la méthode de paiement
   */
  getPaymentMethodIcon(method: string): string {
    const methodIcons: Record<string, string> = {
      'orange_money_senegal': '🟠',
      'free_money_senegal': '🟢',
      'wave_senegal': '🌊',
      'expresso_senegal': '📱',
      'wizall_senegal': '💳',
      'orange_money_ci': '🟠',
      'mtn_ci': '🟡',
      'moov_ci': '🔵',
      'wave_ci': '🌊',
      'orange_money_burkina': '🟠',
      'moov_burkina': '🔵',
      'moov_benin': '🔵',
      'mtn_benin': '🟡',
      't_money_togo': '📱',
      'moov_togo': '🔵',
      'orange_money_mali': '🟠',
      'moov_mali': '🔵',
      'paydunya': '💳',
      'card': '💳'
    }

    return methodIcons[method] || '💳'
  }

  /**
   * Obtenir la couleur de la méthode de paiement
   */
  getPaymentMethodColor(method: string): string {
    const methodColors: Record<string, string> = {
      'orange_money_senegal': 'bg-orange-500',
      'free_money_senegal': 'bg-green-500',
      'wave_senegal': 'bg-blue-500',
      'expresso_senegal': 'bg-purple-500',
      'wizall_senegal': 'bg-indigo-500',
      'orange_money_ci': 'bg-orange-500',
      'mtn_ci': 'bg-yellow-500',
      'moov_ci': 'bg-blue-500',
      'wave_ci': 'bg-blue-500',
      'orange_money_burkina': 'bg-orange-500',
      'moov_burkina': 'bg-blue-500',
      'moov_benin': 'bg-blue-500',
      'mtn_benin': 'bg-yellow-500',
      't_money_togo': 'bg-purple-500',
      'moov_togo': 'bg-blue-500',
      'orange_money_mali': 'bg-orange-500',
      'moov_mali': 'bg-blue-500',
      'paydunya': 'bg-green-500',
      'card': 'bg-gray-500'
    }

    return methodColors[method] || 'bg-gray-500'
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
}

export default new PayDunyaService() 