import React, { useState } from 'react';
import axios from 'axios';

interface OrangeMoneySenegalFormProps {
  paymentToken: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

type PaymentMethod = 'qr' | 'otp';

const OrangeMoneySenegalForm: React.FC<OrangeMoneySenegalFormProps> = ({
  paymentToken,
  customerName,
  customerEmail,
  amount,
  currency,
  onSuccess,
  onError
}) => {
  const [phone, setPhone] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const endpoint = paymentMethod === 'qr' 
        ? '/api/process-orange-money-senegal-qr-payment'
        : '/api/process-orange-money-senegal-otp-payment';

      const laravelApiUrl = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}${endpoint}`;

      const requestData = {
        phone_number: phone,
        payment_token: paymentToken,
        customer_name: customerName,
        customer_email: customerEmail,
        ...(paymentMethod === 'otp' && { authorization_code: authorizationCode })
      };

      const response = await axios.post(laravelApiUrl, requestData);

      if (paymentMethod === 'qr') {
        // QR CODE retourne une URL de redirection
        if (response.data.success && response.data.redirect_url) {
          setStatus('success');
          setMessage('Redirection vers Orange Money Sénégal...');
          // Rediriger l'utilisateur vers l'URL de paiement
          window.location.href = response.data.redirect_url;
          onSuccess?.(response.data);
        } else {
          setStatus('error');
          const errorMessage = response.data.message || 'Une erreur est survenue lors de l\'initiation du paiement Orange Money Sénégal QR.';
          setMessage(errorMessage);
          
          const errorObject = {
            message: errorMessage,
            paydunya_response: response.data.paydunya_response,
            status: response.status,
            data: response.data
          };
          onError?.(errorObject);
        }
      } else {
        // OTP CODE finalise directement le paiement
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          onSuccess?.(response.data);
        } else {
          setStatus('error');
          const errorMessage = response.data.message || 'Une erreur est survenue lors du paiement Orange Money Sénégal OTP.';
          setMessage(errorMessage);
          
          const errorObject = {
            message: errorMessage,
            paydunya_response: response.data.paydunya_response,
            status: response.status,
            data: response.data
          };
          onError?.(errorObject);
        }
      }
    } catch (error: any) {
      setStatus('error');
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur critique est survenue.';
      setMessage(errorMessage);
      
      const errorObject = {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
        networkError: true
      };
      onError?.(errorObject);
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
            <h3 className="text-sm font-medium text-green-800">Paiement Orange Money Sénégal Réussi !</h3>
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
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Paiement par Orange Money
            </h3>
            <p className="text-sm text-gray-600">Sénégal</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Montant à payer : <span className="font-semibold text-orange-600">{formatAmount(amount, currency)}</span>
        </p>

        {/* Sélection de la méthode de paiement */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choisissez votre méthode de paiement :
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="qr"
                checked={paymentMethod === 'qr'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mr-2 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm">QR Code</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="otp"
                checked={paymentMethod === 'otp'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mr-2 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm">Code USSD</span>
            </label>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                Instructions Orange Money Sénégal - {paymentMethod === 'qr' ? 'QR Code' : 'Code USSD'}
              </h3>
              <div className="mt-2 text-sm text-orange-700 space-y-1">
                {paymentMethod === 'qr' ? (
                  <>
                    <p>1. Assurez-vous d'avoir l'application Orange Money installée</p>
                    <p>2. Vérifiez que votre compte Orange Money a suffisamment de fonds</p>
                    <p>3. Entrez votre numéro de téléphone Orange ci-dessous</p>
                    <p>4. Vous serez redirigé vers une page avec un QR Code</p>
                    <p>5. Scannez le QR Code avec votre application Orange Money</p>
                  </>
                ) : (
                  <>
                    <p>1. Assurez-vous d'avoir un compte Orange Money actif</p>
                    <p>2. Vérifiez que votre compte a suffisamment de fonds</p>
                    <p>3. Entrez votre numéro de téléphone Orange ci-dessous</p>
                    <p>4. Composez le code USSD : <strong>#144#391*VOTRE_CODE_PIN#</strong></p>
                    <p>5. Entrez le code d'autorisation reçu par SMS</p>
                  </>
                )}
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
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">+221</span>
            </div>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="7xxxxxxxx"
              required
              disabled={status === 'loading'}
              className="w-full pl-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {paymentMethod === 'otp' && (
          <div>
            <label htmlFor="authorization_code" className="block text-sm font-medium text-gray-700 mb-1">
              Code d'Autorisation
            </label>
            <input
              id="authorization_code"
              type="text"
              value={authorizationCode}
              onChange={(e) => setAuthorizationCode(e.target.value)}
              placeholder="152347"
              required
              minLength={6}
              maxLength={6}
              disabled={status === 'loading'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Entrez le code d'autorisation reçu par SMS après avoir composé #144#391*VOTRE_CODE_PIN#
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out disabled:cursor-not-allowed flex items-center justify-center"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              Payer avec Orange Money {formatAmount(amount, currency)}
            </>
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

export default OrangeMoneySenegalForm; 