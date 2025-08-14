'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui';
import styles from './payment-method-selector.module.css';

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  type: string;
  country: string;
  enabled: boolean;
}

interface PaymentMethodSelectorProps {
  selectedCountry: string;
  onMethodSelect: (method: string) => void;
  selectedMethod: string;
}

const paymentMethodsByCountry: { [key: string]: PaymentMethod[] } = {
  'CI': [
    { id: 'wave-ci', name: 'Wave CI', logo: 'https://assets.cdn.moneroo.io/icons/circle/wave.svg', type: 'mobile_money', country: 'CI', enabled: true },
    { id: 'orange-money-ci', name: 'Orange Money CI', logo: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg', type: 'mobile_money', country: 'CI', enabled: true },
    { id: 'mtn-ci', name: 'MTN MoMo CI', logo: 'https://assets.cdn.moneroo.io/icons/circle/momo.svg', type: 'mobile_money', country: 'CI', enabled: true },
    { id: 'moov-ci', name: 'Moov Money CI', logo: 'https://assets.cdn.moneroo.io/icons/circle/moov_money.svg', type: 'mobile_money', country: 'CI', enabled: true }
  ],
  'SN': [
    { id: 'e-money-senegal', name: 'E-Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/e_money_sn.svg', type: 'mobile_money', country: 'SN', enabled: true },
    { id: 'wizall-senegal', name: 'Wizall', logo: 'https://assets.cdn.moneroo.io/icons/circle/wizall_sn.svg', type: 'mobile_money', country: 'SN', enabled: true },
    { id: 'wave-senegal', name: 'Wave', logo: 'https://assets.cdn.moneroo.io/icons/circle/wave.svg', type: 'mobile_money', country: 'SN', enabled: true },
    { id: 'free-money-senegal', name: 'Free Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/freemoney_sn.svg', type: 'mobile_money', country: 'SN', enabled: true },
    { id: 'orange-money-senegal', name: 'Orange Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg', type: 'mobile_money', country: 'SN', enabled: true }
  ],
  'TG': [
    { id: 'togocel-togo', name: 'Togocel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/togocel.svg', type: 'mobile_money', country: 'TG', enabled: true },
    { id: 't-money-togo', name: 'T-Money', logo: '/t-money.png', type: 'mobile_money', country: 'TG', enabled: true }
  ],
  'ZMB': [
    { id: 'mtn-momo-zambia', name: 'MTN MoMo', logo: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg', type: 'mobile_money', country: 'ZMB', enabled: true },
    { id: 'airtel-money-zambia', name: 'Airtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg', type: 'mobile_money', country: 'ZMB', enabled: true },
    { id: 'zamtel-money-zambia', name: 'Zamtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/zamtel_money.svg', type: 'mobile_money', country: 'ZMB', enabled: true }
  ],
  'UG': [
    { id: 'mtn-momo-uganda', name: 'MTN MoMo', logo: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg', type: 'mobile_money', country: 'UG', enabled: true },
    { id: 'airtel-money-uganda', name: 'Airtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg', type: 'mobile_money', country: 'UG', enabled: true }
  ],
  'TZ': [
    { id: 'mpesa-tanzania', name: 'M-Pesa', logo: 'https://assets.cdn.moneroo.io/icons/circle/mpesa.svg', type: 'mobile_money', country: 'TZ', enabled: true },
    { id: 'airtel-money-tanzania', name: 'Airtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg', type: 'mobile_money', country: 'TZ', enabled: true },
    { id: 'tigo-pesa-tanzania', name: 'Tigo Pesa', logo: 'https://assets.cdn.moneroo.io/icons/circle/tigo_pesa.svg', type: 'mobile_money', country: 'TZ', enabled: true }
  ],
  'KE': [
    { id: 'mpesa-kenya', name: 'M-Pesa', logo: 'https://assets.cdn.moneroo.io/icons/circle/mpesa.svg', type: 'mobile_money', country: 'KE', enabled: true },
    { id: 'airtel-money-kenya', name: 'Airtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg', type: 'mobile_money', country: 'KE', enabled: true }
  ],
  'CM': [
    { id: 'mtn-momo-cameroon', name: 'MTN MoMo', logo: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg', type: 'mobile_money', country: 'CM', enabled: true },
    { id: 'orange-cameroon', name: 'Orange Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg', type: 'mobile_money', country: 'CM', enabled: true }
  ],
  'CD': [
    { id: 'airtel-congo', name: 'Airtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg', type: 'mobile_money', country: 'CD', enabled: true },
    { id: 'orange-congo', name: 'Orange Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg', type: 'mobile_money', country: 'CD', enabled: true },
    { id: 'vodacom-mpesa-congo', name: 'Vodacom M-Pesa', logo: 'https://assets.cdn.moneroo.io/icons/circle/vodacom_mpesa.svg', type: 'mobile_money', country: 'CD', enabled: true }
  ],
  'CG': [
    { id: 'airtel-congo-brazzaville', name: 'Airtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg', type: 'mobile_money', country: 'CG', enabled: true },
    { id: 'mtn-momo-congo', name: 'MTN MoMo', logo: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg', type: 'mobile_money', country: 'CG', enabled: true }
  ],
  'GA': [
    { id: 'airtel-gabon', name: 'Airtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg', type: 'mobile_money', country: 'GA', enabled: true }
  ],
  'RW': [
    { id: 'airtel-rwanda', name: 'Airtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg', type: 'mobile_money', country: 'RW', enabled: true },
    { id: 'mtn-momo-rwanda', name: 'MTN MoMo', logo: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg', type: 'mobile_money', country: 'RW', enabled: true }
  ],
  'NG': [
    { id: 'mtn-momo-nigeria', name: 'MTN MoMo', logo: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg', type: 'mobile_money', country: 'NG', enabled: true },
    { id: 'airtel-money-nigeria', name: 'Airtel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg', type: 'mobile_money', country: 'NG', enabled: true }
  ],
  'BF': [
    { id: 'orange-money-burkina', name: 'Orange Money BF', logo: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg', type: 'mobile_money', country: 'BF', enabled: true },
    { id: 'moov-money-burkina', name: 'Moov Money BF', logo: 'https://assets.cdn.moneroo.io/icons/circle/moov_money.svg', type: 'mobile_money', country: 'BF', enabled: true }
  ],
  'ML': [
    { id: 'orange-money-mali', name: 'Orange Money ML', logo: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg', type: 'mobile_money', country: 'ML', enabled: true },
    { id: 'moov-money-mali', name: 'Moov Money ML', logo: 'https://assets.cdn.moneroo.io/icons/circle/moov_money.svg', type: 'mobile_money', country: 'ML', enabled: true }
  ]
};

export function PaymentMethodSelector({ selectedCountry, onMethodSelect, selectedMethod }: PaymentMethodSelectorProps) {
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const methods = paymentMethodsByCountry[selectedCountry] || [];
    setAvailableMethods(methods);
    
    // Pré-sélectionner la première méthode disponible
    if (methods.length > 0 && !selectedMethod) {
      onMethodSelect(methods[0].id);
    }
  }, [selectedCountry, selectedMethod, onMethodSelect]);

  if (availableMethods.length === 0) {
    return (
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-3">Méthode de paiement</div>
        <div className="text-sm text-muted-foreground italic">
          Aucune méthode de paiement disponible pour ce pays
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Méthode de paiement</div>
      
      {/* Carrousel horizontal des méthodes de paiement */}
      <div className="relative">
        <div className={styles.paymentCarousel}>
          {availableMethods.map((method) => (
            <div key={method.id} className={styles.paymentMethodItem}>
              {/* Badge de sélection */}
              <div className={`${styles.selectionBadge} ${
                selectedMethod === method.id ? styles.selected : ''
              }`}>
                {selectedMethod === method.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={styles.selectionIcon}>
                    <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm4.78 7.7-5.67 5.67c-.14.14-.33.22-.53.22s-.39-.08-.53-.22l-2.83-2.83c-.29-.29-.29-.77 0-1.06.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0 .29.29.29.76 0 1.06Z"></path>
                  </svg>
                )}
              </div>
              
              {/* Bouton de méthode de paiement */}
              <button
                type="button"
                className={`${styles.paymentMethodButton} ${
                  selectedMethod === method.id ? styles.selected : ''
                }`}
                onClick={() => onMethodSelect(method.id)}
              >
                {/* Avatar avec logo */}
                <div className={styles.paymentMethodAvatar}>
                  <img 
                    className={styles.paymentMethodLogo} 
                    src={method.logo} 
                    alt={method.name}
                    onError={(e) => {
                      // Fallback en cas d'erreur de chargement
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback avec initiale */}
                  <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm hidden`}>
                    {method.name.charAt(0)}
                  </div>
                </div>
                
                {/* Nom de la méthode */}
                <div className={styles.paymentMethodName}>
                  {method.name}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicateur de méthode sélectionnée */}
      {selectedMethod && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-900">
                {availableMethods.find(m => m.id === selectedMethod)?.name}
              </div>
              <div className="text-xs text-blue-600">Méthode sélectionnée</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

