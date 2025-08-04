import React, { useState } from 'react';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentMethod, getPaymentMethodsByCountry } from '../data/payment-methods';

export const PaymentMethodsDemo: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('Côte d\'Ivoire');

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    console.log('🛒 Méthode sélectionnée:', method);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedMethod(null); // Reset selection when country changes
  };

  const availableMethods = getPaymentMethodsByCountry(selectedCountry);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Méthodes de Paiement
          </h1>
          <p className="text-gray-600 mb-8">
            Sélectionnez votre pays et votre méthode de paiement préférée
          </p>

          {/* Sélecteur de pays */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choisissez votre pays
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Côte d\'Ivoire', 'Sénégal', 'Burkina Faso', 'Bénin', 'Togo', 'Mali'].map((country) => (
                <button
                  key={country}
                  onClick={() => handleCountryChange(country)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedCountry === country
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-medium">{country}</div>
                    <div className="text-sm text-gray-500">
                      {availableMethods.length} méthode{availableMethods.length > 1 ? 's' : ''} disponible{availableMethods.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sélecteur de méthode de paiement */}
          <PaymentMethodSelector
            selectedCountry={selectedCountry}
            onMethodSelect={handleMethodSelect}
            selectedMethod={selectedMethod?.id}
          />

          {/* Informations détaillées */}
          {selectedMethod && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Détails de la méthode sélectionnée
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nom:</span> {selectedMethod.name}</div>
                    <div><span className="font-medium">Pays:</span> {selectedMethod.country}</div>
                    <div><span className="font-medium">Type:</span> {selectedMethod.type}</div>
                    <div><span className="font-medium">Frais:</span> {selectedMethod.fees} F CFA</div>
                    <div><span className="font-medium">Statut:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        selectedMethod.enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedMethod.enabled ? 'Activée' : 'Désactivée'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Logo</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 border border-gray-200 rounded-lg flex items-center justify-center bg-white">
                      {selectedMethod.logo ? (
                        <img
                          src={selectedMethod.logo}
                          alt={selectedMethod.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500';
                            fallback.textContent = selectedMethod.name.split(' ')[0];
                            target.parentNode?.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          {selectedMethod.name.split(' ')[0]}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Chemin: {selectedMethod.logo}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedMethod.logo ? 'Image configurée' : 'Image manquante'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistiques */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {availableMethods.length}
              </div>
              <div className="text-sm text-gray-600">
                Méthodes disponibles
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {availableMethods.filter(m => m.enabled).length}
              </div>
              <div className="text-sm text-gray-600">
                Méthodes activées
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {availableMethods.filter(m => m.logo).length}
              </div>
              <div className="text-sm text-gray-600">
                Logos configurés
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
