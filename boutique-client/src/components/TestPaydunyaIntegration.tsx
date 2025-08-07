import React from 'react';
import CheckoutComplete from './CheckoutComplete';

const TestPaydunyaIntegration: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Test d'Intégration Paydunya
          </h1>
          <p className="text-lg text-gray-600">
            Testez le checkout avec les formulaires Paydunya personnalisés
          </p>
        </div>

        <CheckoutComplete
          storeId="test-store"
          productId="test-product-123"
          productName="Produit de Test"
          price={5000}
          storeName="NOCODE2"
          storeLogo="N"
        />
      </div>
    </div>
  );
};

export default TestPaydunyaIntegration; 