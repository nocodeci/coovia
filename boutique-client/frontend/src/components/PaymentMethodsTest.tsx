import React, { useState } from 'react';
import { PaymentMethod, getPaymentMethodsByCountry, getEnabledPaymentMethods } from '../data/payment-methods';

export const PaymentMethodsTest: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('Côte d\'Ivoire');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const countries = ['Côte d\'Ivoire', 'Sénégal', 'Burkina Faso', 'Bénin', 'Togo', 'Mali'];
  const availableMethods = getPaymentMethodsByCountry(selectedCountry);
  const enabledMethods = getEnabledPaymentMethods();

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    console.log('🛒 Méthode sélectionnée:', method);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test des Méthodes de Paiement
          </h1>
          <p className="text-gray-600 mb-8">
            Vérification de toutes les méthodes de paiement configurées
          </p>

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {enabledMethods.length}
              </div>
              <div className="text-sm text-blue-700">
                Total des méthodes
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {availableMethods.length}
              </div>
              <div className="text-sm text-green-700">
                Méthodes pour {selectedCountry}
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {availableMethods.filter(m => m.logo).length}
              </div>
              <div className="text-sm text-orange-700">
                Logos configurés
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {countries.length}
              </div>
              <div className="text-sm text-purple-700">
                Pays supportés
              </div>
            </div>
          </div>

          {/* Sélecteur de pays */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sélectionnez un pays
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    setSelectedCountry(country);
                    setSelectedMethod(null);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedCountry === country
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-medium">{country}</div>
                    <div className="text-sm text-gray-500">
                      {getPaymentMethodsByCountry(country).length} méthode{getPaymentMethodsByCountry(country).length > 1 ? 's' : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Méthodes disponibles pour {selectedCountry}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method)}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                    selectedMethod?.id === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    {/* Logo */}
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg">
                      {method.logo ? (
                        <img
                          src={method.logo}
                          alt={method.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500';
                            fallback.textContent = method.name.split(' ')[0];
                            target.parentNode?.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          {method.name.split(' ')[0]}
                        </div>
                      )}
                    </div>
                    
                    {/* Informations */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {method.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {method.type}
                      </div>
                      {method.fees && (
                        <div className="text-xs text-green-600 font-medium">
                          {method.fees} F CFA
                        </div>
                      )}
                    </div>

                    {/* Statut */}
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      method.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {method.enabled ? 'Activée' : 'Désactivée'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Détails de la méthode sélectionnée */}
          {selectedMethod && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Détails de la méthode sélectionnée
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">ID:</span> {selectedMethod.id}</div>
                    <div><span className="font-medium">Nom:</span> {selectedMethod.name}</div>
                    <div><span className="font-medium">Pays:</span> {selectedMethod.country}</div>
                    <div><span className="font-medium">Type:</span> {selectedMethod.type}</div>
                    <div><span className="font-medium">Frais:</span> {selectedMethod.fees} F CFA</div>
                    <div><span className="font-medium">Logo:</span> {selectedMethod.logo || 'Non configuré'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Aperçu du logo</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 border border-gray-200 rounded-lg flex items-center justify-center bg-white">
                      {selectedMethod.logo ? (
                        <img
                          src={selectedMethod.logo}
                          alt={selectedMethod.name}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500';
                            fallback.textContent = selectedMethod.name.split(' ')[0];
                            target.parentNode?.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
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
        </div>
      </div>
    </div>
  );
};
