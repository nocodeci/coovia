import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, AlertCircle, Phone, Mail, User, ShoppingBag, Sparkles, Shield, Star } from 'lucide-react';
import { Button, Card, Input, Badge } from '@/components/ui';
import { 
  CountrySelector, 
  PhoneInput, 
  PaymentMethodSelector, 
  LoadingSpinner,
  OTPInput,
  PaymentWaitingPage
} from '@/components/checkout';
import { paymentService } from '@/services/payment-api';

interface CheckoutPageProps {
  storeId: string;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface FormErrors {
  [key: string]: string;
}

interface SavedCustomerData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  lastUsed: Date;
}

export function CheckoutPage({ storeId }: CheckoutPageProps) {
  const [selectedCountry, setSelectedCountry] = useState('CI');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpStatus, setOtpStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [otpMessage, setOtpMessage] = useState('');
  const [savedCustomers, setSavedCustomers] = useState<SavedCustomerData[]>([]);
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState<number | null>(null);

  // Mock data for demo
  const store = { id: storeId, name: 'Boutique Demo', logo: 'BD' };
  const checkoutData = { 
    productName: 'Produit Premium', 
    price: 25000,
    storeId: storeId,
    productId: 'PROD-001'
  };

  useEffect(() => {
    // Load saved customers from localStorage
    const saved = localStorage.getItem('savedCustomers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedCustomers(parsed.map((customer: any) => ({
          ...customer,
          lastUsed: new Date(customer.lastUsed)
        })));
      } catch (error) {
        console.error('Error loading saved customers:', error);
      }
    }
  }, []);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'email':
        return !value ? 'Email requis' : !validateEmail(value) ? 'Email invalide' : null;
      case 'firstName':
        return !value ? 'Prénom requis' : value.length < 2 ? 'Prénom trop court' : null;
      case 'lastName':
        return !value ? 'Nom requis' : value.length < 2 ? 'Nom trop court' : null;
      case 'phone':
        if (!value) return 'Téléphone requis';
        if (value.length < 8) return 'Téléphone invalide';
        
        // Validation spécifique pour MTN CI
        if (selectedCountry === 'CI' && selectedPaymentMethod === 'mtn-ci') {
          if (!value.startsWith('05')) {
            return 'Le numéro MTN CI doit commencer par 05 (ex: 0554038858)';
          }
          if (value.length !== 10) {
            return 'Le numéro MTN CI doit contenir 10 chiffres';
          }
        }
        
        return null;
      default:
        return null;
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error || '' }));
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCustomerData = (customerData: SavedCustomerData) => {
    try {
      const existing = savedCustomers.filter(c => 
        c.email !== customerData.email || c.phone !== customerData.phone
      );
      const updated = [customerData, ...existing].slice(0, 5);
      setSavedCustomers(updated);
      localStorage.setItem('savedCustomers', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving customer data:', error);
    }
  };

  const handleUseSavedCustomer = (customer: SavedCustomerData, index: number) => {
    if (selectedCustomerIndex === index) {
      setSelectedCustomerIndex(null);
      setFormData({ email: '', firstName: '', lastName: '', phone: '' });
      setSelectedCountry('CI');
    } else {
      setSelectedCustomerIndex(index);
      setFormData({
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone
      });
      setSelectedCountry(customer.country);
    }
  };

  const maskPhoneNumber = (phone: string) => {
    if (phone.length < 4) return phone;
    const visible = phone.slice(-2);
    const hidden = '*'.repeat(phone.length - 4);
    return `${phone.slice(0, 2)}${hidden}${visible}`;
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) return;
    if (!selectedPaymentMethod) {
      alert('Veuillez sélectionner une méthode de paiement');
      return;
    }

    setIsProcessing(true);

    try {
      // Préparer les données de paiement
      const paymentData = {
        amount: checkoutData.price,
        currency: 'XOF',
        phone_number: formData.phone,
        country: selectedCountry,
        payment_method: selectedPaymentMethod,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        order_id: `ORDER-${Date.now()}`,
        customer_message: `Paiement pour ${checkoutData.productName}`,
        store_id: store.id,
        product_id: checkoutData.productId,
        product_name: checkoutData.productName
      };

      console.log('🚀 Initialisation du paiement:', paymentData);

      // Appeler l'API de paiement intelligent
      const response = await paymentService.initializePayment(paymentData);

      console.log('✅ Réponse du paiement:', response);

      if (response.success) {
        // Sauvegarder les données client
        const customerData: SavedCustomerData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: selectedCountry,
          lastUsed: new Date()
        };
        saveCustomerData(customerData);

        // Sauvegarder les données de paiement pour l'OTP
        if (response.data?.payment_id) {
          sessionStorage.setItem('payment_id', response.data.payment_id);
          sessionStorage.setItem('payment_provider', response.data.provider);
        }

        // Afficher l'étape OTP pour Orange Money
        console.log('🔍 Méthode de paiement sélectionnée:', selectedPaymentMethod);
        
        if (selectedPaymentMethod === 'orange-money-ci') {
          console.log('🍊 Affichage étape Orange Money');
          setShowOtpStep(true);
        } else if (selectedPaymentMethod === 'mtn-ci') {
          console.log('📱 Affichage étape MTN CI');
          // Pour MTN CI, afficher une page d'attente de confirmation
          setShowOtpStep(true);
          
          // Vérifier si le SMS a été envoyé selon la réponse du backend
          const smsSent = (response.data as any)?.sms_sent;
          const fallbackUsed = response.data?.fallback_used;
          
          if (smsSent === true) {
            setOtpMessage('Paiement MTN CI initialisé avec succès. Veuillez vérifier votre téléphone et confirmer le paiement via SMS.');
          } else if (fallbackUsed === true) {
            setOtpMessage('Paiement MTN CI initialisé. Veuillez vérifier votre téléphone pour le SMS de confirmation ou utiliser le lien de paiement.');
          } else {
            setOtpMessage('Paiement MTN CI initialisé. Veuillez vérifier votre téléphone et confirmer le paiement via SMS.');
          }
        } else {
          console.log('🌐 Redirection vers URL externe');
          // Pour les autres méthodes, rediriger vers l'URL de paiement
          if (response.data?.url) {
            window.open(response.data.url, '_blank');
          }
          setIsSubmitted(true);
        }
      } else {
        throw new Error(response.message || 'Erreur lors de l\'initialisation du paiement');
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('❌ Erreur de paiement:', error);
      alert(`Erreur lors du paiement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsProcessing(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpCode || otpCode.length < 4) {
      setOtpMessage('Veuillez entrer un code OTP valide');
      return;
    }

    setOtpStatus('loading');
    setOtpMessage('');

    try {
      const paymentId = sessionStorage.getItem('payment_id');
      const paymentProvider = sessionStorage.getItem('payment_provider');

      if (!paymentId || !paymentProvider) {
        throw new Error('Données de paiement manquantes');
      }

      // Traiter le paiement OTP
      const otpData = {
        phone_number: formData.phone,
        otp: otpCode,
        payment_token: paymentId,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email
      };

      console.log('📱 Traitement OTP:', otpData);

      const response = await paymentService.processOTPPayment(otpData);

      console.log('✅ Réponse OTP:', response);

      if (response.success) {
        setOtpStatus('success');
        setOtpMessage('Paiement validé avec succès !');
        setTimeout(() => setIsSubmitted(true), 2000);
      } else {
        throw new Error(response.message || 'Erreur lors de la validation OTP');
      }
    } catch (error) {
      console.error('❌ Erreur OTP:', error);
      setOtpStatus('error');
      setOtpMessage(`Erreur lors de la validation OTP: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleMTNConfirmation = async () => {
    setOtpStatus('loading');
    setOtpMessage('Vérification du statut du paiement MTN CI...');

    try {
      const paymentId = sessionStorage.getItem('payment_id');
      
      if (!paymentId) {
        throw new Error('Données de paiement manquantes');
      }

      // Vérifier le statut du paiement MTN CI
      const statusData = {
        payment_token: paymentId,
        phone_number: formData.phone,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email
      };

      console.log('📱 Vérification statut MTN CI:', statusData);

      // Pour l'instant, on simule une vérification réussie
      // En production, on appellerait l'API de vérification du statut
      setTimeout(() => {
        setOtpStatus('success');
        setOtpMessage('Paiement MTN CI confirmé avec succès !');
        setTimeout(() => setIsSubmitted(true), 2000);
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur vérification MTN CI:', error);
      setOtpStatus('error');
      setOtpMessage(`Erreur lors de la vérification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Success page
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Card className="relative bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-8 max-w-md w-full transform scale-100 animate-in zoom-in-95 duration-500">
          <div className="text-center relative">
            {/* Success animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg animate-in zoom-in-95 duration-700 delay-200">
                <CheckCircle className="w-10 h-10 text-white animate-in zoom-in-95 duration-500 delay-700" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto bg-green-400/20 rounded-full animate-ping"></div>
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
              Paiement Réussi !
            </h2>
            <p className="text-gray-600 mb-8 text-lg animate-in slide-in-from-bottom-4 duration-500 delay-400">
              Votre transaction a été traitée avec succès
            </p>
            
            {/* Success details */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-8 border border-green-100 animate-in slide-in-from-bottom-4 duration-500 delay-500">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Transaction sécurisée</span>
              </div>
            </div>
            
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-4 delay-600"
              size="lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Retour à la Boutique</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // OTP validation step
  console.log('🔍 showOtpStep:', showOtpStep);
  if (showOtpStep) {
    // Pour Orange Money, utiliser l'ancienne interface avec OTP
    if (selectedPaymentMethod === 'orange-money-ci') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pt-8 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative">
                      <div className="max-w-md mx-auto">
            <Card className="overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl py-0">
              <div className="grid grid-cols-1">
                {/* OTP Form */}
                <div className="p-8 lg:p-12 bg-white relative">
                  <div className="max-w-sm mx-auto">
                    {/* Branding selon la méthode */}
                    <div className="text-center mb-8">
                      {selectedPaymentMethod === 'orange-money-ci' ? (
                        <>
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <span className="text-orange-500 font-bold text-sm">O</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Orange Money CI</h3>
                          <p className="text-gray-600">Validation sécurisée</p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <span className="text-yellow-500 font-bold text-sm">M</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">MTN Money CI</h3>
                          <p className="text-gray-600">Confirmation de paiement</p>
                        </>
                      )}
                    </div>

                    {/* Instructions selon la méthode */}
                    {selectedPaymentMethod === 'orange-money-ci' ? (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-8 border border-orange-100">
                        <div className="text-center">
                          <div className="text-sm text-gray-700 mb-3">
                            Entrez le code de vérification reçu par SMS
                          </div>
                          <div className="bg-orange-500 text-white rounded-xl p-4 font-mono text-lg font-bold">
                            #144*82#
                          </div>
                          <p className="text-xs text-orange-600 mt-2">
                            Composez ce code sur votre téléphone pour confirmer
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 border border-yellow-100">
                        <div className="text-center">
                          <div className="text-sm text-gray-700 mb-3">
                            Vérifiez votre téléphone pour le SMS de confirmation
                          </div>
                          <div className="bg-yellow-500 text-white rounded-xl p-4 font-mono text-lg font-bold">
                            Confirmez le paiement
                          </div>
                          <p className="text-xs text-yellow-600 mt-2">
                            MTN vous a envoyé un SMS pour confirmer le paiement
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Phone number used */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-8">
                      <div className="flex items-center justify-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Numéro : <span className="font-semibold text-gray-900">+225 {formData.phone}</span>
                        </span>
                      </div>
                    </div>

                    {/* OTP Input - Seulement pour Orange Money */}
                    {selectedPaymentMethod === 'orange-money-ci' && (
                      <>
                        <div className="mb-8">
                          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            Code de vérification
                          </label>
                          <OTPInput
                            length={4}
                            onComplete={(code: string) => setOtpCode(code)}
                            disabled={otpStatus === 'loading'}
                            className="mb-4"
                          />
                        </div>

                        {/* Validation button pour Orange Money */}
                        <Button
                          onClick={handleOtpSubmit}
                          disabled={otpStatus === 'loading' || !otpCode || otpCode.length < 4}
                          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          size="lg"
                        >
                          {otpStatus === 'loading' ? (
                            <div className="flex items-center space-x-3">
                              <LoadingSpinner size="sm" />
                              <span>Validation en cours...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <span>Valider le paiement</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                        </Button>
                      </>
                    )}

                    {/* Bouton de vérification pour MTN CI */}
                    {(selectedPaymentMethod as string) === 'mtn-ci' && (
                      <div className="space-y-4">
                        <Button
                          onClick={handleMTNConfirmation}
                          disabled={otpStatus === 'loading'}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          size="lg"
                        >
                          {otpStatus === 'loading' ? (
                            <div className="flex items-center space-x-3">
                              <LoadingSpinner size="sm" />
                              <span>Vérification en cours...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <span>Vérifier le statut du paiement</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                        </Button>

                        <Button
                          onClick={() => setIsSubmitted(true)}
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-4 rounded-xl"
                          size="lg"
                        >
                          Continuer sans vérification
                        </Button>
                      </div>
                    )}

                    {/* Error/success messages */}
                    {otpMessage && (
                      <div className={`mt-6 p-4 rounded-xl animate-in slide-in-from-bottom-4 duration-300 ${
                        otpStatus === 'success' 
                          ? 'bg-green-50 border border-green-200 text-green-800' 
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}>
                        <div className="flex items-center justify-center space-x-2">
                          {otpStatus === 'success' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          <p className="text-sm font-medium">{otpMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
    }

    // Pour les autres méthodes (MTN CI, Wave CI, etc.), utiliser le nouveau design moderne
    return (
      <PaymentWaitingPage
        paymentMethod={selectedPaymentMethod}
        phoneNumber={formData.phone}
        amount={checkoutData.price}
        currency="F CFA"
        onPaymentSuccess={() => setIsSubmitted(true)}
        statusMessage={otpMessage}
      />
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-4 relative">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl py-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Order Summary */}
              <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 text-white p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                        <span className="text-2xl font-bold text-white">{store.logo}</span>
                      </div>
                      <div>
                        <span className="text-2xl font-bold block">{store.name}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <Shield className="w-4 h-4 text-blue-300" />
                          <span className="text-blue-200 text-sm">Paiement sécurisé</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-3">
                      Bonjour {formData.firstName ? (
                        <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                          {formData.firstName}
                        </span>
                      ) : (
                        <span className="text-blue-200">!</span>
                      )}
                    </h1>
                    <p className="text-slate-200 text-base leading-relaxed">
                      Complétez vos informations pour finaliser votre commande en toute sécurité.
                    </p>
                  </div>

                  {/* Product display */}
                  <div className="mb-6">
                    <div className="text-sm text-slate-300 mb-4 font-medium uppercase tracking-wide">Votre commande</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                      <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-2xl flex items-center justify-center border border-white/20">
                          <ShoppingBag className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-xl mb-1">{checkoutData.productName}</div>
                          <div className="text-slate-300 text-sm flex items-center space-x-3">
                            <span className="bg-white/10 px-2 py-1 rounded-lg">Quantité: 1</span>
                            <span className="text-slate-400">•</span>
                            <span>{store.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-2xl">
                            {checkoutData.price}
                          </div>
                          <div className="text-slate-300 text-sm">F CFA</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-slate-300 text-sm mb-2 uppercase tracking-wide">Total à payer</div>
                        <div className="text-4xl font-bold text-white">
                          {checkoutData.price}
                          <span className="text-xl font-medium text-slate-300 ml-2">F CFA</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-slate-300 text-sm">Paiement instantané</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Form */}
              <div className="p-6 lg:p-8 bg-white relative">
                <div className="max-w-md mx-auto">
                  {/* Country Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Votre pays de résidence
                    </label>
                    <CountrySelector
                      selectedCountry={selectedCountry}
                      onCountrySelect={setSelectedCountry}
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <PaymentMethodSelector
                      selectedCountry={selectedCountry}
                      onMethodSelect={setSelectedPaymentMethod}
                      selectedMethod={selectedPaymentMethod}
                    />
                  </div>

                  {/* Saved Customers */}
                  {savedCustomers.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Informations récentes ({Math.min(savedCustomers.length, 2)})
                      </label>
                      <div className="space-y-2">
                        {savedCustomers.slice(0, 2).map((customer, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleUseSavedCustomer(customer, index)}
                            className={`w-full p-3 rounded-xl border-2 transition-all duration-300 hover:shadow-lg group ${
                              selectedCustomerIndex === index
                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                                selectedCustomerIndex === index
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                              }`}>
                                <User className="w-4 h-4" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900 text-sm">
                                  {maskPhoneNumber(customer.phone)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {customer.firstName} {customer.lastName}
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                selectedCustomerIndex === index
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300 group-hover:border-gray-400'
                              }`}>
                                {selectedCustomerIndex === index && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Prénom <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            icon={<User className="w-4 h-4" />}
                            value={formData.firstName}
                            onChange={(e) => handleFieldChange('firstName', e.target.value)}
                            placeholder="Prénom"
                            className={`rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                              errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                            }`}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-2 flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.firstName}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            icon={<User className="w-4 h-4" />}
                            value={formData.lastName}
                            onChange={(e) => handleFieldChange('lastName', e.target.value)}
                            placeholder="Nom"
                            className={`rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                              errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                            }`}
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-2 flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.lastName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adresse email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          icon={<Mail className="w-4 h-4" />}
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          placeholder="votre@email.com"
                          className={`rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
                            errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-2 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Numéro de téléphone <span className="text-red-500">*</span>
                      </label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(value) => handleFieldChange('phone', value)}
                        selectedCountry={selectedCountry}
                        onCountrySelect={setSelectedCountry}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-2 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                      
                      {/* Message d'aide pour MTN CI */}
                      {selectedPaymentMethod === 'mtn-ci' && !errors.phone && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">i</span>
                            </div>
                            <div className="text-xs text-blue-800">
                              <p className="font-medium mb-1">Numéro MTN CI requis</p>
                              <p>Votre numéro doit commencer par <strong>05</strong> et contenir 10 chiffres</p>
                              <p className="text-blue-600 mt-1">Exemple : 0554038858</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing || !selectedPaymentMethod}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-3">
                          <LoadingSpinner size="sm" />
                          <span>Initialisation du paiement...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-3">
                          <Shield className="w-5 h-5" />
                          <span>Payer maintenant</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <div className="flex items-center justify-center mt-8">
            <a href="https://moneroo.io" className="flex items-center space-x-3 text-gray-500 hover:text-gray-700 transition-colors duration-300 group">
              <span className="text-sm">Sécurisé par</span>
              <div className="h-8 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
                <span className="text-white text-xs font-bold">Moneroo</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
