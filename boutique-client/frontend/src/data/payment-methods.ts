export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  country: string;
  type: 'mobile_money' | 'card' | 'bank_transfer';
  enabled: boolean;
  fees?: number;
}

export const paymentMethods: PaymentMethod[] = [
  // Côte d'Ivoire
  {
    id: 'wave_ci',
    name: 'Wave Côte d\'Ivoire',
    logo: '/assets/images/payment-methods/wave-ci.png',
    country: 'Côte d\'Ivoire',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'orange_money_ci',
    name: 'Orange Money Côte d\'Ivoire',
    logo: '/assets/images/payment-methods/orange-money-ci.png',
    country: 'Côte d\'Ivoire',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'mtn_ci',
    name: 'MTN Mobile Money Côte d\'Ivoire',
    logo: '/assets/images/payment-methods/mtn-ci.png',
    country: 'Côte d\'Ivoire',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'moov_ci',
    name: 'Moov Money Côte d\'Ivoire',
    logo: '/assets/images/payment-methods/moov-ci.png',
    country: 'Côte d\'Ivoire',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },

  // Sénégal
  {
    id: 'wave_senegal',
    name: 'Wave Sénégal',
    logo: '/assets/images/payment-methods/wave-senegal.png',
    country: 'Sénégal',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'orange_money_senegal',
    name: 'Orange Money Sénégal',
    logo: '/assets/images/payment-methods/orange-money-senegal.png',
    country: 'Sénégal',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'free_money_senegal',
    name: 'Free Money Sénégal',
    logo: '/assets/images/payment-methods/free-money-senegal.png',
    country: 'Sénégal',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'expresso_senegal',
    name: 'Expresso Sénégal',
    logo: '/assets/images/payment-methods/expresso-senegal.png',
    country: 'Sénégal',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'wizall_senegal',
    name: 'Wizall Sénégal',
    logo: '/assets/images/payment-methods/wizall-senegal.png',
    country: 'Sénégal',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },

  // Burkina Faso
  {
    id: 'orange_money_burkina',
    name: 'Orange Money Burkina Faso',
    logo: '/assets/images/payment-methods/orange-money-burkina.png',
    country: 'Burkina Faso',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'moov_burkina',
    name: 'Moov Money Burkina Faso',
    logo: '/assets/images/payment-methods/moov-burkina.png',
    country: 'Burkina Faso',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },

  // Bénin
  {
    id: 'moov_benin',
    name: 'Moov Money Bénin',
    logo: '/assets/images/payment-methods/moov-benin.png',
    country: 'Bénin',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'mtn_benin',
    name: 'MTN Mobile Money Bénin',
    logo: '/assets/images/payment-methods/mtn-benin.png',
    country: 'Bénin',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },

  // Togo
  {
    id: 't_money_togo',
    name: 'T-Money Togo',
    logo: '/assets/images/payment-methods/t-money-togo.png',
    country: 'Togo',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'moov_togo',
    name: 'Moov Money Togo',
    logo: '/assets/images/payment-methods/moov-togo.png',
    country: 'Togo',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },

  // Mali
  {
    id: 'orange_money_mali',
    name: 'Orange Money Mali',
    logo: '/assets/images/payment-methods/orange-money-mali.png',
    country: 'Mali',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'moov_mali',
    name: 'Moov Money Mali',
    logo: '/assets/images/payment-methods/moov-mali.png',
    country: 'Mali',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },

  // Méthodes universelles
  {
    id: 'paydunya',
    name: 'PayDunya',
    logo: '/assets/images/payment-methods/paydunya.png',
    country: 'Tous les pays',
    type: 'mobile_money',
    enabled: true,
    fees: 100
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    logo: '/assets/images/payment-methods/card.png',
    country: 'Tous les pays',
    type: 'card',
    enabled: true,
    fees: 100
  }
];

// Fonction pour obtenir les méthodes de paiement par pays
export const getPaymentMethodsByCountry = (country: string): PaymentMethod[] => {
  return paymentMethods.filter(method => 
    method.country === country || method.country === 'Tous les pays'
  );
};

// Fonction pour obtenir une méthode de paiement par ID
export const getPaymentMethodById = (id: string): PaymentMethod | undefined => {
  return paymentMethods.find(method => method.id === id);
};

// Fonction pour obtenir les méthodes de paiement activées
export const getEnabledPaymentMethods = (): PaymentMethod[] => {
  return paymentMethods.filter(method => method.enabled);
};
