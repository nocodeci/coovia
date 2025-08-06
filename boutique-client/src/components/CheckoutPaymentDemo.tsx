import React, { useState } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentFormRenderer from './PaymentFormRenderer';

interface CheckoutPaymentDemoProps {
  // Props pour la démonstration
}

const CheckoutPaymentDemo: React.FC<CheckoutPaymentDemoProps> = () => {
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

  const handlePaymentSuccess = (response: any) => {
    console.log('Paiement réussi:', response);
    alert('Paiement réussi !');
  };

  const handlePaymentError = (error: any) => {
    console.error('Erreur de paiement:', error);
    alert('Erreur de paiement: ' + error.message);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Démonstration - Checkout avec Sélection de Paiement
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section de configuration */}
        <div>
          {/* Section Pays */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays de livraison
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Sélecteur de méthodes de paiement */}
          <PaymentMethodSelector
            selectedCountry={selectedCountry}
            onMethodSelect={handlePaymentMethodSelect}
            selectedMethod={selectedPaymentMethod}
          />

          {/* Informations de paiement */}
          {selectedPaymentMethod && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Informations de paiement
              </h3>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>Pays :</strong> {selectedCountry}</p>
                <p><strong>Méthode :</strong> {selectedPaymentMethod}</p>
                <p><strong>Montant :</strong> 5,000 XOF</p>
                <p><strong>Statut :</strong> Prêt pour le paiement</p>
              </div>
            </div>
          )}
        </div>

        {/* Section formulaire de paiement */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Formulaire de paiement
          </h3>
          
          {selectedPaymentMethod ? (
            <PaymentFormRenderer
              selectedMethod={selectedPaymentMethod}
              paymentToken="demo-token-123"
              customerName="John Doe"
              customerEmail="john@example.com"
              customerPhone="+2250700000000"
              amount={5000}
              currency="XOF"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          ) : (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600">
                  Sélectionnez une méthode de paiement pour afficher le formulaire
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions d'intégration */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Instructions d'intégration
        </h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p>1. Placez le <code>PaymentMethodSelector</code> après le sélecteur de pays</p>
          <p>2. Utilisez le <code>PaymentFormRenderer</code> pour afficher le formulaire approprié</p>
          <p>3. Les méthodes s'adaptent automatiquement selon le pays sélectionné</p>
          <p>4. Gérez les callbacks <code>onSuccess</code> et <code>onError</code> pour traiter les résultats</p>
        </div>
      </div>

      {/* Code d'exemple */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Code d'exemple complet
        </h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Dans votre composant Checkout
const [selectedCountry, setSelectedCountry] = useState('Côte d\'Ivoire');
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

const handlePaymentSuccess = (response) => {
  // Traiter le succès du paiement
  console.log('Paiement réussi:', response);
};

const handlePaymentError = (error) => {
  // Traiter l'erreur de paiement
  console.error('Erreur de paiement:', error);
};

return (
  <div>
    {/* Sélecteur de pays */}
    <CountrySelector 
      value={selectedCountry} 
      onChange={setSelectedCountry} 
    />
    
    {/* Sélecteur de méthodes de paiement */}
    <PaymentMethodSelector
      selectedCountry={selectedCountry}
      onMethodSelect={setSelectedPaymentMethod}
      selectedMethod={selectedPaymentMethod}
    />
    
    {/* Formulaire de paiement */}
    {selectedPaymentMethod && (
      <PaymentFormRenderer
        selectedMethod={selectedPaymentMethod}
        paymentToken={paymentToken}
        customerName={customerName}
        customerEmail={customerEmail}
        amount={amount}
        currency={currency}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    )}
  </div>
);`}
        </pre>
      </div>
    </div>
  );
};

export default CheckoutPaymentDemo; 