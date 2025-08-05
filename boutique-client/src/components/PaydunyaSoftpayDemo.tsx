import React, { useState } from 'react';
import PaydunyaSoftpayForm from './PaydunyaSoftpayForm';

const PaydunyaSoftpayDemo: React.FC = () => {
  const [demoData] = useState({
    paymentToken: 'demo_token_123456',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    amount: 5000,
    currency: 'XOF'
  });

  const handleSuccess = (response: any) => {
    console.log('Paiement réussi:', response);
    // Ici vous pouvez ajouter la logique pour rediriger ou afficher un message de succès
  };

  const handleError = (error: any) => {
    console.error('Erreur de paiement:', error);
    // Ici vous pouvez ajouter la logique pour gérer les erreurs
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Démonstration PayDunya SOFTPAY
        </h2>
        <p className="text-gray-600">
          Test du formulaire de paiement Orange Money Côte d'Ivoire
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Données de test</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Token:</strong> {demoData.paymentToken}</p>
          <p><strong>Client:</strong> {demoData.customerName}</p>
          <p><strong>Email:</strong> {demoData.customerEmail}</p>
          <p><strong>Montant:</strong> {demoData.amount} {demoData.currency}</p>
        </div>
      </div>

      <PaydunyaSoftpayForm
        paymentToken={demoData.paymentToken}
        customerName={demoData.customerName}
        customerEmail={demoData.customerEmail}
        amount={demoData.amount}
        currency={demoData.currency}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <div className="mt-6 text-xs text-gray-500">
        <p><strong>Note:</strong> Ceci est une démonstration. En production, le token de paiement sera généré dynamiquement.</p>
      </div>
    </div>
  );
};

export default PaydunyaSoftpayDemo; 