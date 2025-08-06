import React, { useState } from 'react';
import OrangeMoneyCIForm from './OrangeMoneyCIForm';
import WaveCIForm from './WaveCIForm';
import MTNCIForm from './MTNCIForm';
import MoovCIForm from './MoovCIForm';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface PaymentMethodSelectorProps {
  paymentToken: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentToken,
  customerName,
  customerEmail,
  customerPhone,
  amount,
  currency,
  onSuccess,
  onError
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'orange-money-ci',
      name: 'Orange Money',
      description: 'Paiement par Orange Money Côte d\'Ivoire',
      icon: '📞',
      color: 'orange',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'wave-ci',
      name: 'Wave',
      description: 'Paiement par Wave Côte d\'Ivoire',
      icon: '💙',
      color: 'blue',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'mtn-ci',
      name: 'MTN Money',
      description: 'Paiement par MTN Money Côte d\'Ivoire',
      icon: '📱',
      color: 'yellow',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 'moov-ci',
      name: 'Moov Money',
      description: 'Paiement par Moov Money Côte d\'Ivoire',
      icon: '📲',
      color: 'purple',
      bgColor: 'bg-purple-100'
    }
  ];

  const renderPaymentForm = () => {
      const commonProps = {
    paymentToken,
    customerName,
    customerEmail,
    customerPhone,
    amount,
    currency,
    onSuccess,
    onError
  };

    switch (selectedMethod) {
      case 'orange-money-ci':
        return <OrangeMoneyCIForm {...commonProps} />;
      case 'wave-ci':
        return <WaveCIForm {...commonProps} />;
      case 'mtn-ci':
        return <MTNCIForm {...commonProps} />;
      case 'moov-ci':
        return <MoovCIForm {...commonProps} />;
      default:
        return null;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      orange: 'border-orange-200 hover:border-orange-300 focus:ring-orange-500',
      blue: 'border-blue-200 hover:border-blue-300 focus:ring-blue-500',
      yellow: 'border-yellow-200 hover:border-yellow-300 focus:ring-yellow-500',
      purple: 'border-purple-200 hover:border-purple-300 focus:ring-purple-500'
    };
    return colorMap[color] || 'border-gray-200 hover:border-gray-300 focus:ring-gray-500';
  };

  const getTextColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      orange: 'text-orange-600',
      blue: 'text-blue-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!selectedMethod ? (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Choisissez votre méthode de paiement
            </h2>
            <p className="text-gray-600">
              Sélectionnez votre méthode de paiement mobile préférée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-6 border-2 rounded-lg transition-all duration-200 ${getColorClasses(method.color)} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${method.bgColor} rounded-full flex items-center justify-center text-2xl`}>
                    {method.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-semibold ${getTextColor(method.color)}`}>
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">Informations importantes</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>• Assurez-vous d'avoir suffisamment de fonds sur votre compte mobile</p>
                  <p>• Vérifiez que votre numéro est actif et enregistré</p>
                  <p>• Gardez votre téléphone à proximité pendant le paiement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <button
              onClick={() => setSelectedMethod('')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux méthodes de paiement
            </button>
          </div>
          {renderPaymentForm()}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector; 