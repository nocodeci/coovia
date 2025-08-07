import React, { useState, useEffect } from 'react';

// Styles CSS pour masquer la barre de défilement
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
  }
`;

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  country: string;
  available: boolean;
}

interface PaymentMethodSelectorProps {
  selectedCountry: string;
  onMethodSelect: (method: string) => void;
  selectedMethod?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedCountry,
  onMethodSelect,
  selectedMethod
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  // Configuration des méthodes de paiement par pays
  const paymentMethodsConfig: Record<string, PaymentMethod[]> = {
    'Côte d\'Ivoire': [
      {
        id: 'wave-ci',
        name: 'Wave CI',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/wave.svg',
        country: 'Côte d\'Ivoire',
        available: true
      },
      {
        id: 'orange-money-ci',
        name: 'Orange Money CI',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg',
        country: 'Côte d\'Ivoire',
        available: true
      },
      {
        id: 'mtn-ci',
        name: 'MTN MoMo CI',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/momo.svg',
        country: 'Côte d\'Ivoire',
        available: true
      },
      {
        id: 'moov-ci',
        name: 'Moov Money CI',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/moov_money.svg',
        country: 'Côte d\'Ivoire',
        available: true
      }
    ],
    'Bénin': [
      {
        id: 'mtn-benin',
        name: 'MTN Bénin',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/momo.svg',
        country: 'Bénin',
        available: true
      },
      {
        id: 'moov-benin',
        name: 'Moov Bénin',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/moov_money.svg',
        country: 'Bénin',
        available: true
      }
    ],
    'Togo': [
      {
        id: 'togocel-togo',
        name: 'Togocel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/togocel.svg',
        country: 'Togo',
        available: true
      },
      {
        id: 't-money-togo',
        name: 'T-Money Togo',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/momo.svg',
        country: 'Togo',
        available: true
      }
    ],
    'Mali': [
      {
        id: 'orange-money-mali',
        name: 'Orange Money Mali',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg',
        country: 'Mali',
        available: true
      },
      {
        id: 'moov-mali',
        name: 'Moov Mali',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/moov_money.svg',
        country: 'Mali',
        available: true
      }
    ],
    'Sénégal': [
      {
        id: 'e-money-senegal',
        name: 'E-Money Sénégal',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/e_money_sn.svg',
        country: 'Sénégal',
        available: true
      },
      {
        id: 'wizall-senegal',
        name: 'Wizall Sénégal',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/wizall_sn.svg',
        country: 'Sénégal',
        available: true
      },
      {
        id: 'wave-senegal',
        name: 'Wave Sénégal',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/wave.svg',
        country: 'Sénégal',
        available: true
      },
      {
        id: 'free-money-senegal',
        name: 'Free Money Sénégal',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/freemoney_sn.svg',
        country: 'Sénégal',
        available: true
      },
      {
        id: 'orange-money-senegal',
        name: 'Orange Money Sénégal',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg',
        country: 'Sénégal',
        available: true
      }
    ],
    'Burkina Faso': [
      {
        id: 'orange-money-burkina',
        name: 'Orange Money Burkina',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg',
        country: 'Burkina Faso',
        available: true
      },
      {
        id: 'moov-burkina',
        name: 'Moov Burkina',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/moov_money.svg',
        country: 'Burkina Faso',
        available: true
      }
    ],
    'Cameroun': [
      {
        id: 'mtn-momo-cameroon',
        name: 'MTN MoMo',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg',
        country: 'Cameroun',
        available: true
      },
      {
        id: 'orange-cameroon',
        name: 'Orange Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg',
        country: 'Cameroun',
        available: true
      }
    ],
    'République Démocratique du Congo': [
      {
        id: 'airtel-congo',
        name: 'Airtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg',
        country: 'République Démocratique du Congo',
        available: true
      },
      {
        id: 'orange-congo',
        name: 'Orange Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg',
        country: 'République Démocratique du Congo',
        available: true
      },
      {
        id: 'vodacom-mpesa-congo',
        name: 'Vodacom M-Pesa',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/vodacom_mpesa.svg',
        country: 'République Démocratique du Congo',
        available: true
      }
    ],
    'Congo': [
      {
        id: 'airtel-congo-brazzaville',
        name: 'Airtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg',
        country: 'Congo',
        available: true
      },
      {
        id: 'mtn-momo-congo',
        name: 'MTN MoMo',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg',
        country: 'Congo',
        available: true
      }
    ],
    'Gabon': [
      {
        id: 'airtel-gabon',
        name: 'Airtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg',
        country: 'Gabon',
        available: true
      }
    ],
    'Rwanda': [
      {
        id: 'airtel-rwanda',
        name: 'Airtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg',
        country: 'Rwanda',
        available: true
      },
      {
        id: 'mtn-momo-rwanda',
        name: 'MTN MoMo',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg',
        country: 'Rwanda',
        available: true
      }
    ],
    'Zambie': [
      {
        id: 'mtn-momo-zambia',
        name: 'MTN MoMo',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg',
        country: 'Zambie',
        available: true
      },
      {
        id: 'airtel-money-zambia',
        name: 'Airtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg',
        country: 'Zambie',
        available: true
      },
      {
        id: 'zamtel-money-zambia',
        name: 'Zamtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/zamtel_money.svg',
        country: 'Zambie',
        available: true
      }
    ],
    'Ouganda': [
      {
        id: 'mtn-momo-uganda',
        name: 'MTN MoMo',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg',
        country: 'Ouganda',
        available: true
      },
      {
        id: 'airtel-money-uganda',
        name: 'Airtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg',
        country: 'Ouganda',
        available: true
      }
    ],
    'Tanzanie': [
      {
        id: 'mpesa-tanzania',
        name: 'M-Pesa',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/mpesa.svg',
        country: 'Tanzanie',
        available: true
      },
      {
        id: 'airtel-money-tanzania',
        name: 'Airtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg',
        country: 'Tanzanie',
        available: true
      },
      {
        id: 'tigo-pesa-tanzania',
        name: 'Tigo Pesa',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/tigo_pesa.svg',
        country: 'Tanzanie',
        available: true
      }
    ],
    'Kenya': [
      {
        id: 'mpesa-kenya',
        name: 'M-Pesa',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/mpesa.svg',
        country: 'Kenya',
        available: true
      },
      {
        id: 'airtel-money-kenya',
        name: 'Airtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg',
        country: 'Kenya',
        available: true
      }
    ],
    'Nigeria': [
      {
        id: 'mtn-momo-nigeria',
        name: 'MTN MoMo',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg',
        country: 'Nigeria',
        available: true
      },
      {
        id: 'airtel-money-nigeria',
        name: 'Airtel Money',
        icon: 'https://assets.cdn.moneroo.io/icons/circle/airtel_money.svg',
        country: 'Nigeria',
        available: true
      }
    ]
  };

  useEffect(() => {
    // Mettre à jour les méthodes disponibles selon le pays sélectionné
    const availableMethods = paymentMethodsConfig[selectedCountry] || [];
    setMethods(availableMethods);
    
    console.log('PaymentMethodSelector - selectedCountry:', selectedCountry);
    console.log('PaymentMethodSelector - selectedMethod:', selectedMethod);
    console.log('PaymentMethodSelector - availableMethods:', availableMethods);
    
    // Si aucune méthode n'est sélectionnée et qu'il y a des méthodes disponibles,
    // pré-sélectionner la première méthode
    if (!selectedMethod && availableMethods.length > 0) {
      console.log('PaymentMethodSelector - Pré-sélection de:', availableMethods[0].id);
      onMethodSelect(availableMethods[0].id);
    }
    // Réinitialiser la sélection si le pays change et que la méthode actuelle n'est pas disponible
    else if (selectedMethod && !availableMethods.find(m => m.id === selectedMethod)) {
      console.log('PaymentMethodSelector - Réinitialisation vers:', availableMethods[0]?.id || '');
      onMethodSelect(availableMethods.length > 0 ? availableMethods[0].id : '');
    }
  }, [selectedCountry, selectedMethod, onMethodSelect]);

  const handleMethodSelect = (methodId: string) => {
    onMethodSelect(methodId);
  };

  // Ne pas afficher si aucun pays n'est sélectionné ou si aucune méthode n'est disponible
  if (!selectedCountry || methods.length === 0) {
    return null;
  }

  return (
    <>
      <style>{scrollbarHideStyles}</style>
      <div className="mt-3">
      <div className="relative flex flex-row items-center">
        {/* Container des méthodes de paiement */}
        <div className="grid grid-flow-col overflow-x-auto md:py-4 py-3 space-x-3 scroll-smooth transition-[width] duration-300 md:max-w-[400px] max-w-xs scrollbar-hide">
          
          {methods.map((method) => (
            <div key={method.id} className="relative">
              {/* Badge de sélection */}
              <div className={`absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm ${selectedMethod === method.id ? 'block' : 'hidden'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-600">
                  <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm4.78 7.7-5.67 5.67c-.14.14-.33.22-.53.22s-.39-.08-.53-.22l-2.83-2.83c-.29-.29-.29-.77 0-1.06.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0 .29.29.29.76 0 1.06Z"></path>
                </svg>
              </div>

              {/* Bouton de méthode de paiement */}
              <button
                className={`shadow-sm rounded-lg p-2 transition-all duration-200 hover:shadow-md ${
                  selectedMethod === method.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                type="button"
                onClick={() => handleMethodSelect(method.id)}
                disabled={!method.available}
              >
                <div className="flex flex-col items-center space-y-1">
                  {/* Icône */}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      className="w-5 h-5 object-contain" 
                      src={method.icon} 
                      alt={method.name}
                      onError={(e) => {
                        // Fallback si l'image ne charge pas
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback icon */}
                    <div className="hidden w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Nom */}
                  <div className="text-center">
                    <div className="font-poppins text-xs text-neutral-700 truncate w-16">
                      {method.name}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}


        </div>
      </div>
    </div>
    </>
  );
};

export default PaymentMethodSelector; 