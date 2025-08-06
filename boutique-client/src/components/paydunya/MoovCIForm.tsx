import React, { useState } from 'react';
import axios from 'axios';


interface MoovCIFormProps {
  paymentToken: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const MoovCIForm: React.FC<MoovCIFormProps> = ({
  paymentToken,
  customerName,
  customerEmail,
  customerPhone,
  amount,
  currency,
  onSuccess,
  onError
}) => {

  // Extraire le numéro sans le préfixe +225 pour l'affichage
  const phoneWithoutPrefix = customerPhone.replace('+225', '');
  const [phone, setPhone] = useState(phoneWithoutPrefix);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const laravelApiUrl = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/process-moov-ci-payment`;

      const response = await axios.post(laravelApiUrl, {
        phone_number: `+225${phone}`,
        payment_token: paymentToken,
        customer_name: customerName,
        customer_email: customerEmail
      });

      // Moov CI finalise directement le paiement (pas de redirection)
      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        alert('Paiement Moov CI réussi ! ' + response.data.message);
        onSuccess?.(response.data);
      } else {
        setStatus('error');
        const errorMessage = response.data.message || 'Une erreur est survenue lors du paiement Moov CI.';
        setMessage(errorMessage);
        
        alert('Erreur de paiement Moov CI: ' + errorMessage);
        
        // Créer un objet d'erreur plus informatif
        const errorObject = {
          message: errorMessage,
          paydunya_response: response.data.paydunya_response,
          status: response.status,
          data: response.data
        };
        onError?.(errorObject);
      }
    } catch (error: any) {
      setStatus('error');
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur critique est survenue.';
      setMessage(errorMessage);
      
      alert('Erreur de paiement Moov CI: ' + errorMessage);
      
      // Créer un objet d'erreur plus informatif pour les erreurs réseau
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
            <h3 className="text-sm font-medium text-green-800">Paiement Moov CI Réussi !</h3>
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
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Paiement par Moov Money
            </h3>
            <p className="text-sm text-gray-600">Côte d'Ivoire</p>
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
              <h3 className="text-sm font-medium text-purple-800">Instructions Moov Money</h3>
              <div className="mt-2 text-sm text-purple-700 space-y-1">
                <p>1. Assurez-vous d'avoir l'application Moov Money installée</p>
                <p>2. Vérifiez que votre compte Moov Money a suffisamment de fonds</p>
                <p>3. Entrez votre numéro de téléphone Moov ci-dessous</p>
                <p>4. Le paiement sera débité directement de votre compte</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de téléphone Moov
          </label>
          <div className="relative">
            <div className="flex">
              {/* Bouton préfixe pays */}
              <button 
                type="button" 
                className="flex items-center space-x-2 px-4 py-3 bg-white border-2 border-r-0 border-gray-200 rounded-l-lg hover:border-gray-300 transition-all duration-200"
              >
                <img 
                  data-testid="circle-country-flag" 
                  className="w-4 h-4 rounded-full" 
                  title="ci" 
                  height="100" 
                  src="https://react-circle-flags.pages.dev/ci.svg"
                  alt="Côte d'Ivoire"
                />
                <span className="text-sm font-medium text-gray-900">+225</span>
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
                  className="lucide lucide-chevron-down w-3 h-3 text-gray-400" 
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              
              {/* Champ de saisie */}
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxx"
                required
                disabled={status === 'loading'}
                className="flex-1 rounded-r-lg border-2 border-l-0 border-gray-200 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            
            {/* Message informatif avec design amélioré */}
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-green-600 font-medium">
                  Numéro pré-rempli depuis le checkout
                </span>
              </div>
            </div>
          </div>
          
          {/* Format avec design amélioré */}
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-xs text-purple-600 font-medium">
                Format : 01xxxxxxxx (numéro Moov Côte d'Ivoire)
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out disabled:cursor-not-allowed flex items-center justify-center"
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
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Payer avec Moov Money {formatAmount(amount, currency)}
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

export default MoovCIForm; 