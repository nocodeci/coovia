import React, { useState } from 'react';
import PaymentMethodSelector from './paydunya/PaymentMethodSelector';

interface CountryPaymentIntegrationProps {
  // Props pour l'intégration
}

const CountryPaymentIntegration: React.FC<CountryPaymentIntegrationProps> = () => {
  const [selectedCountry, setSelectedCountry] = useState('Côte d\'Ivoire');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const countries = [
    'Côte d\'Ivoire',
    'Bénin',
    'Togo',
    'Mali',
    'Sénégal',
    'Burkina Faso'
  ];

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedPaymentMethod(''); // Réinitialiser la méthode quand le pays change
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Intégration Sélecteur de Pays + Paiement
      </h2>

      {/* Sélecteur de pays (votre composant existant) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pays de livraison
        </label>
        <div className="relative">
          <button 
            type="button" 
            className="flex items-center space-x-3 w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200"
            onClick={() => {
              // Ici vous pouvez ouvrir votre dropdown de pays
              console.log('Ouvrir dropdown pays');
            }}
          >
            <img 
              data-testid="circle-country-flag" 
              className="w-5 h-5 rounded-full" 
              title="ci" 
              height="100" 
              src="https://react-circle-flags.pages.dev/ci.svg"
              alt={selectedCountry}
            />
            <span className="text-sm font-medium text-gray-900">
              {selectedCountry}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-chevron-down w-4 h-4 text-gray-400 ml-auto" 
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Sélecteur de méthodes de paiement - s'affiche automatiquement */}
      <PaymentMethodSelector
        paymentToken="demo-token-123"
        customerName="John Doe"
        customerEmail="john@example.com"
        customerPhone="+2250700000000"
        amount={5000}
        currency="XOF"
        onSuccess={(response) => console.log('Success:', response)}
        onError={(error) => console.error('Error:', error)}
      />

      {/* Affichage de la sélection */}
      {selectedPaymentMethod && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-green-800">
              Méthode sélectionnée : <strong>{selectedPaymentMethod}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Instructions d'intégration */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">
          Code d'intégration
        </h3>
        <pre className="text-xs text-blue-700 overflow-x-auto">
{`// Dans votre composant Checkout
const [selectedCountry, setSelectedCountry] = useState('Côte d\'Ivoire');
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

return (
  <div>
    {/* Votre sélecteur de pays existant */}
    <div className="relative">
      <button type="button" className="flex items-center space-x-3 w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200">
        <img data-testid="circle-country-flag" className="w-5 h-5 rounded-full" title="ci" height="100" src="https://react-circle-flags.pages.dev/ci.svg">
        <span className="text-sm font-medium text-gray-900">Côte d'Ivoire</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-4 h-4 text-gray-400 ml-auto" aria-hidden="true">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>
    </div>

    {/* Sélecteur de méthodes de paiement - s'affiche automatiquement */}
    <PaymentMethodSelector
      selectedCountry={selectedCountry}
      onMethodSelect={setSelectedPaymentMethod}
      selectedMethod={selectedPaymentMethod}
    />
  </div>
);`}
        </pre>
      </div>
    </div>
  );
};

export default CountryPaymentIntegration; 