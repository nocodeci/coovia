import React, { useState, useEffect } from 'react';

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
    ]
  };

  useEffect(() => {
    // Mettre à jour les méthodes disponibles selon le pays sélectionné
    const availableMethods = paymentMethodsConfig[selectedCountry] || [];
    setMethods(availableMethods);
    
    // Réinitialiser la sélection si le pays change
    if (selectedMethod && !availableMethods.find(m => m.id === selectedMethod)) {
      onMethodSelect('');
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
    <div className="mt-3">
      <div className="relative flex flex-row items-center">
        {/* Bouton de navigation gauche */}
        <button 
          className="absolute md:-left-7 -left-2 top-1/2 z-10 bg-neutral-100 hover:bg-neutral-200 rounded-full p-1 transition-colors duration-200"
          type="button"
          style={{ transform: 'translateY(-50%)' }}
          hidden={methods.length <= 3}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="m15.0001 19.92-6.52-6.52c-.77-.77-.77-2.03 0-2.8L15 4.08"></path>
          </svg>
        </button>

        {/* Container des méthodes de paiement */}
        <div className="grid grid-flow-col overflow-x-auto md:py-4 py-3 space-x-3 scroll-smooth transition-[width] duration-300 md:max-w-[400px] max-w-xs">
          <div className="w-1 h-full min-w-[1rem] -mr-4"></div>
          
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

          <div className="w-1 h-full min-w-[1rem] -ml-4"></div>
        </div>

        {/* Bouton de navigation droite */}
        <button 
          className="absolute md:-right-8 -right-4 z-10 bg-neutral-100 hover:bg-neutral-200 rounded-full p-1 transition-colors duration-200"
          type="button"
          hidden={methods.length <= 3}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="m8.91 19.92 6.5199-6.52c.77-.77.77-2.03 0-2.8l-6.52-6.52"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector; 