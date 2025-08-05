import React, { useState } from 'react';
import axios from 'axios';

interface PaydunyaSoftpayFormProps {
  paymentToken: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

const PaydunyaSoftpayForm: React.FC<PaydunyaSoftpayFormProps> = ({
  paymentToken,
  customerName,
  customerEmail,
  amount,
  currency,
  onSuccess,
  onError
}) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const laravelApiUrl = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/process-paydunya-payment`;

      const response = await axios.post<PaymentResponse>(laravelApiUrl, {
        phone_number: phone,
        otp: otp,
        payment_token: paymentToken,
        customer_name: customerName,
        customer_email: customerEmail
      });

      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        onSuccess?.(response.data);
      } else {
        setStatus('error');
        setMessage(response.data.message);
        onError?.(response.data);
      }
    } catch (error: any) {
      setStatus('error');
      const errorMessage = error.response?.data?.message || 'Une erreur critique est survenue.';
      setMessage(errorMessage);
      onError?.(error);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Paiement Réussi !</h3>
            <p className="text-sm text-green-700 mt-1">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Paiement par Orange Money (Côte d'Ivoire)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Montant à payer : <span className="font-semibold">{formatAmount(amount, currency)}</span>
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Instructions</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>1. Composez <code className="bg-blue-100 px-1 rounded">#144*82#</code> sur votre téléphone</p>
                <p>2. Suivez les instructions pour obtenir votre code de paiement</p>
                <p>3. Entrez le code reçu dans le champ ci-dessous</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de téléphone Orange
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07xxxxxxxx"
            required
            disabled={status === 'loading'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Code OTP de paiement
          </label>
          <input
            id="otp"
            type="text"
            pattern="\d*"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Code à 4 chiffres"
            required
            disabled={status === 'loading'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Validation en cours...
            </div>
          ) : (
            `Payer ${formatAmount(amount, currency)}`
          )}
        </button>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur de paiement</h3>
                <p className="text-sm text-red-700 mt-1">{message}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PaydunyaSoftpayForm; 