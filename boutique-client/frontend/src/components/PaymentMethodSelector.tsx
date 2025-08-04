import React, { useState } from 'react';
import { paymentMethods, PaymentMethod, getPaymentMethodsByCountry } from '../data/payment-methods';

interface PaymentMethodSelectorProps {
  selectedCountry?: string;
  onMethodSelect?: (method: PaymentMethod) => void;
  selectedMethod?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedCountry = 'Côte d\'Ivoire',
  onMethodSelect,
  selectedMethod
}) => {
  const [selectedCountryState, setSelectedCountryState] = useState(selectedCountry);

  // Obtenir les méthodes de paiement pour le pays sélectionné
  const availableMethods = getPaymentMethodsByCountry(selectedCountryState);

  const handleMethodSelect = (method: PaymentMethod) => {
    onMethodSelect?.(method);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountryState(country);
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de pays */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pays
        </label>
        <select
          value={selectedCountryState}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Côte d'Ivoire">Côte d'Ivoire</option>
          <option value="Sénégal">Sénégal</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Bénin">Bénin</option>
          <option value="Togo">Togo</option>
          <option value="Mali">Mali</option>
        </select>
      </div>

      {/* Méthodes de paiement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Méthode de paiement
        </label>
        <div className="grid grid-cols-2 gap-3">
          {availableMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              className={`p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                {/* Logo de la méthode de paiement */}
                <div className="w-12 h-12 flex items-center justify-center">
                  {method.logo ? (
                    <img
                      src={method.logo}
                      alt={method.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback si l'image ne se charge pas
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500';
                        fallback.textContent = method.name.split(' ')[0];
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      {method.name.split(' ')[0]}
                    </div>
                  )}
                </div>
                
                {/* Nom de la méthode */}
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {method.name}
                  </div>
                  {method.fees && (
                    <div className="text-xs text-gray-500">
                      Frais: {method.fees} F CFA
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Informations sur les frais */}
      {selectedMethod && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-900">
                Méthode sélectionnée
              </div>
              <div className="text-xs text-blue-700">
                {getPaymentMethodsByCountry(selectedCountryState).find(m => m.id === selectedMethod)?.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
