import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.wozif.com/api';

// Configuration axios
const paymentApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types pour les paiements
export interface PaymentData {
  amount: number;
  currency: string;
  phone_number: string;
  country: string;
  payment_method: string;
  customer_name: string;
  customer_email: string;
  order_id?: string;
  customer_message?: string;
  store_id?: string;
  product_id?: string;
  product_name?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    payment_id?: string;
    deposit_id?: string;
    status: string;
    provider: string;
    amount: number;
    currency: string;
    fallback_used: boolean;
    url?: string;
    token?: string;
  };
  error?: string;
  details?: any;
}

export interface PaymentStatusResponse {
  success: boolean;
  message: string;
  data?: {
    status: string;
    provider: string;
    amount?: number;
    currency?: string;
    transaction_id?: string;
    deposit_id?: string;
  };
  error?: string;
}

export interface AvailableMethodsResponse {
  success: boolean;
  data: {
    [method: string]: {
      primary: string;
      fallback: string | null;
    };
  };
}

// Service de paiement intelligent
export const paymentService = {
  /**
   * Initialiser un paiement avec le système intelligent
   */
  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      console.log('🚀 Initialisation du paiement intelligent:', paymentData);
      
      const response = await paymentApi.post('/smart-payment/initialize', paymentData);
      
      console.log('✅ Réponse du paiement intelligent:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'initialisation du paiement:', error);
      
      if (error.response) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Erreur de connexion au service de paiement',
        error: error.message
      };
    }
  },

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPaymentStatus(paymentId: string, provider: string): Promise<PaymentStatusResponse> {
    try {
      console.log('🔍 Vérification du statut:', { paymentId, provider });
      
      const response = await paymentApi.post('/smart-payment/check-status', {
        payment_id: paymentId,
        provider: provider
      });
      
      console.log('✅ Statut du paiement:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la vérification du statut:', error);
      
      if (error.response) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Erreur lors de la vérification du statut',
        error: error.message
      };
    }
  },

  /**
   * Obtenir les méthodes de paiement disponibles par pays
   */
  async getAvailableMethods(country: string): Promise<AvailableMethodsResponse> {
    try {
      console.log('📋 Récupération des méthodes pour:', country);
      
      const response = await paymentApi.get(`/smart-payment/available-methods?country=${country}`);
      
      console.log('✅ Méthodes disponibles:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des méthodes:', error);
      
      if (error.response) {
        return error.response.data;
      }
      
      return {
        success: false,
        data: {}
      };
    }
  },

  /**
   * Traiter un paiement OTP (Orange Money CI)
   */
  async processOTPPayment(otpData: {
    phone_number: string;
    otp: string;
    payment_token: string;
    customer_name: string;
    customer_email: string;
  }): Promise<PaymentResponse> {
    try {
      console.log('📱 Traitement du paiement OTP:', otpData);
      
      const response = await paymentApi.post('/process-orange-money-ci-payment', otpData);
      
      console.log('✅ Réponse du paiement OTP:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors du traitement OTP:', error);
      
      if (error.response) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Erreur lors du traitement du code OTP',
        error: error.message
      };
    }
  },

  /**
   * Traiter un paiement Paydunya
   */
  async processPaydunyaPayment(paymentData: {
    payment_method: string;
    payment_token: string;
    customer_name: string;
    customer_email: string;
    phone_number: string;
    amount: number;
    currency: string;
  }): Promise<PaymentResponse> {
    try {
      console.log('💳 Traitement du paiement Paydunya:', paymentData);
      
      const response = await paymentApi.post('/process-paydunya-payment', paymentData);
      
      console.log('✅ Réponse du paiement Paydunya:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors du traitement Paydunya:', error);
      
      if (error.response) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Erreur lors du traitement Paydunya',
        error: error.message
      };
    }
  },

  /**
   * Traiter un paiement Pawapay
   */
  async processPawapayPayment(paymentData: {
    country: string;
    method: string;
    amount: number;
    currency: string;
    customer_name: string;
    customer_email: string;
    phone_number: string;
    order_id?: string;
  }): Promise<PaymentResponse> {
    try {
      console.log('🔄 Traitement du paiement Pawapay:', paymentData);
      
      const response = await paymentApi.post(`/pawapay/process/${paymentData.country}/${paymentData.method}`, paymentData);
      
      console.log('✅ Réponse du paiement Pawapay:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors du traitement Pawapay:', error);
      
      if (error.response) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Erreur lors du traitement Pawapay',
        error: error.message
      };
    }
  },

  /**
   * Obtenir les statistiques des providers
   */
  async getProviderStats(): Promise<any> {
    try {
      const response = await paymentApi.get('/smart-payment/provider-stats');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      return {
        success: false,
        data: {
          paydunya: { success_rate: 0, total_attempts: 0 },
          pawapay: { success_rate: 0, total_attempts: 0 }
        }
      };
    }
  }
};

// Mapping des méthodes de paiement frontend vers backend
export const paymentMethodMapping = {
  // Côte d'Ivoire
  'orange-money-ci': 'ORANGE_MONEY_CI',
  'wave-ci': 'WAVE_CI',
  'mtn-ci': 'MTN_CI',
  'moov-ci': 'MOOV_CI',
  
  // Sénégal
  'e-money-senegal': 'E_MONEY_SN',
  'wizall-senegal': 'WIZALL_SN',
  'wave-senegal': 'WAVE_SN',
  'free-money-senegal': 'FREE_MONEY_SN',
  'orange-money-senegal': 'ORANGE_MONEY_SN',
  
  // Togo
  'togocel-togo': 'TOGOCEL_TG',
  't-money-togo': 'T_MONEY_TG',
  
  // Zambie
  'mtn-momo-zambia': 'MTN_MOMO_ZMB',
  'airtel-money-zambia': 'AIRTEL_MONEY_ZMB',
  'zamtel-money-zambia': 'ZAMTEL_MONEY_ZMB',
  
  // Ouganda
  'mtn-momo-uganda': 'MTN_MOMO_UG',
  'airtel-money-uganda': 'AIRTEL_MONEY_UG',
  
  // Tanzanie
  'mpesa-tanzania': 'MPESA_TZ',
  'airtel-money-tanzania': 'AIRTEL_MONEY_TZ',
  'tigo-pesa-tanzania': 'TIGO_PESA_TZ',
  
  // Kenya
  'mpesa-kenya': 'MPESA_KE',
  'airtel-money-kenya': 'AIRTEL_MONEY_KE',
  
  // Cameroun
  'mtn-momo-cameroon': 'MTN_MOMO_CM',
  'orange-cameroon': 'ORANGE_CM',
  
  // République Démocratique du Congo
  'airtel-congo': 'AIRTEL_CD',
  'orange-congo': 'ORANGE_CD',
  'vodacom-mpesa-congo': 'VODACOM_MPESA_CD',
  
  // Congo
  'airtel-congo-brazzaville': 'AIRTEL_CG',
  'mtn-momo-congo': 'MTN_MOMO_CG',
  
  // Gabon
  'airtel-gabon': 'AIRTEL_GA',
  
  // Rwanda
  'airtel-rwanda': 'AIRTEL_RW',
  'mtn-momo-rwanda': 'MTN_MOMO_RW',
  
  // Nigeria
  'mtn-momo-nigeria': 'MTN_MOMO_NG',
  'airtel-money-nigeria': 'AIRTEL_MONEY_NG',
  
  // Burkina Faso
  'orange-money-burkina': 'ORANGE_MONEY_BF',
  'moov-money-burkina': 'MOOV_MONEY_BF',
  
  // Mali
  'orange-money-mali': 'ORANGE_MONEY_ML',
  'moov-money-mali': 'MOOV_MONEY_ML'
};

// Mapping des pays
export const countryMapping = {
  'CI': 'CIV',
  'SN': 'SN',
  'TG': 'TG',
  'ZMB': 'ZMB',
  'UG': 'UG',
  'TZ': 'TZ',
  'KE': 'KE',
  'CM': 'CM',
  'CD': 'CD',
  'CG': 'CG',
  'GA': 'GA',
  'RW': 'RW',
  'NG': 'NG',
  'BF': 'BF',
  'ML': 'ML'
};

export default paymentService;
