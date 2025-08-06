import React, { useState } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';

const PaydunyaFormsDemo: React.FC = () => {
  const [demoData] = useState({
    paymentToken: 'demo_token_123456',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    amount: 5000,
    currency: 'XOF'
  });

  const handleSuccess = (response: any) => {
    console.log('Paiement réussi:', response);
    alert(`Paiement réussi ! ${response.message}`);
  };

  const handleError = (error: any) => {
    console.error('Erreur de paiement:', error);
    alert(`Erreur de paiement: ${error.message || 'Erreur inconnue'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 Démonstration PayDunya SOFTPAY
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Testez les formulaires de paiement personnalisés pour chaque méthode mobile
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Données de test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Token:</strong> {demoData.paymentToken}</p>
                <p><strong>Client:</strong> {demoData.customerName}</p>
              </div>
              <div>
                <p><strong>Email:</strong> {demoData.customerEmail}</p>
                <p><strong>Montant:</strong> {demoData.amount} {demoData.currency}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <PaymentMethodSelector
            paymentToken={demoData.paymentToken}
            customerName={demoData.customerName}
            customerEmail={demoData.customerEmail}
            customerPhone="+2250700000000"
            amount={demoData.amount}
            currency={demoData.currency}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800">Informations de développement</h3>
              <div className="mt-2 text-sm text-blue-700 space-y-2">
                <p><strong>Note:</strong> Ceci est une démonstration. En production, le token de paiement sera généré dynamiquement.</p>
                <p><strong>Backend:</strong> API Laravel avec clés Paydunya en mode production</p>
                <p><strong>Frontend:</strong> Composants React TypeScript avec Tailwind CSS</p>
                <p><strong>Méthodes supportées:</strong> Orange Money, Wave, MTN Money, Moov Money</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">📞</span>
              </div>
              <h4 className="font-semibold text-orange-800">Orange Money</h4>
            </div>
            <p className="text-xs text-orange-700">
              Code USSD: #144*82#<br/>
              Code OTP requis
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-sm">💙</span>
              </div>
              <h4 className="font-semibold text-blue-800">Wave</h4>
            </div>
            <p className="text-xs text-blue-700">
              Application Wave<br/>
              Redirection automatique
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-sm">📱</span>
              </div>
              <h4 className="font-semibold text-yellow-800">MTN Money</h4>
            </div>
            <p className="text-xs text-yellow-700">
              Compte MTN Money<br/>
              Validation SMS
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 text-sm">📲</span>
              </div>
              <h4 className="font-semibold text-purple-800">Moov Money</h4>
            </div>
            <p className="text-xs text-purple-700">
              Compte Moov Money<br/>
              Popup de validation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaydunyaFormsDemo; 