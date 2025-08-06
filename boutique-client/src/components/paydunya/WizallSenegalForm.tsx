import React, { useState } from 'react';
import axios from 'axios';

interface WizallSenegalFormProps {
  paymentToken: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const WizallSenegalForm: React.FC<WizallSenegalFormProps> = ({
  paymentToken,
  customerName,
  customerEmail,
  customerPhone,
  amount,
  currency,
  onSuccess,
  onError
}) => {
  // Extraire le numéro sans le préfixe +221 pour l'affichage
  const phoneWithoutPrefix = customerPhone.replace('+221', '');
  const [phone, setPhone] = useState(phoneWithoutPrefix);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const laravelApiUrl = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/process-wizall-senegal-payment`;

      const response = await axios.post(laravelApiUrl, {
        phone_number: `+221${phone}`,
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
    return new Intl.NumberFormat('fr-SN', {
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
            <h3 className="text-sm font-medium text-green-800">Paiement Wizall Réussi !</h3>
            <p className="text-sm text-green-700 mt-1">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
            <img 
              src="https://assets.cdn.moneroo.io/icons/circle/wizall_sn.svg"
              alt="Wizall Sénégal"
              className="w-6 h-6"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Paiement par Wizall
            </h3>
            <p className="text-sm text-gray-600">Sénégal</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Montant à payer : <span className="font-semibold text-purple-600">{formatAmount(amount, currency)}</span>
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-purple-800">Instructions</h4>
              <p className="text-sm text-purple-700 mt-1">
                Entrez votre numéro Wizall pour effectuer le paiement. Vous recevrez un SMS de confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de téléphone Wizall
          </label>
          <div className="relative group">
            <div className="flex">
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-3 bg-white border-2 border-r-0 border-gray-200 rounded-l-lg hover:border-gray-300 transition-all duration-200"
              >
                <img
                  data-testid="circle-country-flag"
                  className="w-4 h-4 rounded-full"
                  title="sn"
                  height="100"
                  src="https://react-circle-flags.pages.dev/sn.svg"
                  alt="Sénégal"
                />
                <span className="text-sm font-medium text-gray-900">+221</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-3 h-3 text-gray-400" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="7xxxxxxxx"
                required
                disabled={status === 'loading'}
                className="flex-1 rounded-r-lg border-2 border-l-0 border-gray-200 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-green-600 font-medium">Numéro pré-rempli depuis le checkout</span>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-xs text-purple-600 font-medium">Format : 7xxxxxxxx (numéro Wizall Sénégal)</span>
              </div>
            </div>
          </div>
        </div>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <p className="text-sm text-red-700 mt-1">{message}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {status === 'loading' ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </div>
          ) : (
            'Payer avec Wizall'
          )}
        </button>
      </form>
    </div>
  );
};

export default WizallSenegalForm; 