import React, { useState } from 'react';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentMethod } from '../data/payment-methods';

export const PaymentExample: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    console.log('Méthode sélectionnée:', method);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sélection de méthode de paiement
      </h1>
      
      <PaymentMethodSelector
        selectedCountry="Côte d'Ivoire"
        onMethodSelect={handleMethodSelect}
        selectedMethod={selectedMethod?.id}
      />

      {selectedMethod && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-medium text-green-900 mb-2">
            Méthode sélectionnée
          </h3>
          <div className="text-sm text-green-700">
            <p><strong>Nom:</strong> {selectedMethod.name}</p>
            <p><strong>Pays:</strong> {selectedMethod.country}</p>
            <p><strong>Type:</strong> {selectedMethod.type}</p>
            <p><strong>Frais:</strong> {selectedMethod.fees} F CFA</p>
          </div>
        </div>
      )}
    </div>
  );
};
