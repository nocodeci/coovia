import React, { useEffect } from 'react';
import { Smartphone, Zap, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

interface PaymentWaitingPageProps {
  paymentMethod: string;
  phoneNumber: string;
  amount: number;
  currency: string;
  onPaymentSuccess: () => void;
  statusMessage: string;
}

export function PaymentWaitingPage({
  paymentMethod,
  phoneNumber,
  amount,
  currency,
  onPaymentSuccess,
  statusMessage
}: PaymentWaitingPageProps) {
  
  // Vérification automatique du statut du paiement
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const paymentId = sessionStorage.getItem('payment_id');
        if (!paymentId) {
          console.error('Payment ID not found');
          return;
        }

        // Vérifier le statut toutes les 3 secondes
        const interval = setInterval(async () => {
          try {
            const response = await fetch('/api/payment/status', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                payment_id: paymentId,
                payment_method: paymentMethod,
                phone_number: phoneNumber
              })
            });

            if (response.ok) {
              const result = await response.json();
              
              if (result.success && result.status === 'completed') {
                console.log('✅ Paiement confirmé automatiquement');
                clearInterval(interval);
                onPaymentSuccess();
              } else if (result.success && result.status === 'failed') {
                console.log('❌ Paiement échoué');
                clearInterval(interval);
                // Gérer l'échec du paiement
              }
            }
          } catch (error) {
            console.error('Erreur lors de la vérification du statut:', error);
          }
        }, 3000);

        // Nettoyer l'intervalle après 5 minutes (300 secondes)
        setTimeout(() => {
          clearInterval(interval);
        }, 300000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la vérification:', error);
      }
    };

    checkPaymentStatus();
  }, [paymentMethod, phoneNumber, onPaymentSuccess]);
  
  const getMethodInfo = () => {
    switch (paymentMethod) {
      case 'mtn-ci':
        return {
          name: 'MTN MoMo CI',
          color: 'from-yellow-500 to-orange-500',
          icon: 'M',
          description: 'Vérifiez votre téléphone pour confirmer la transaction MTN'
        };
      case 'orange-money-ci':
        return {
          name: 'Orange Money CI',
          color: 'from-orange-500 to-amber-500',
          icon: 'O',
          description: 'Vérifiez votre téléphone pour confirmer la transaction Orange'
        };
      case 'wave-ci':
        return {
          name: 'Wave CI',
          color: 'from-blue-500 to-purple-500',
          icon: 'W',
          description: 'Vérifiez votre téléphone pour confirmer la transaction Wave'
        };
      default:
        return {
          name: 'Paiement Mobile',
          color: 'from-purple-500 to-blue-500',
          icon: 'P',
          description: 'Vérifiez votre téléphone pour confirmer la transaction'
        };
    }
  };

  const methodInfo = getMethodInfo();

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md mx-auto relative overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
          
          {/* Main Animation Container */}
          <div className="flex justify-center mb-8 relative">
            {/* Outer Rotating Rings */}
            <div className="relative w-40 h-40">
              {/* Ring 1 */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 border-r-purple-300 animate-spin"></div>
              
              {/* Ring 2 */}
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-400 border-l-blue-300 animate-spin" style={{animationDirection: 'reverse', animationDuration: '3s'}}></div>
              
              {/* Ring 3 */}
              <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-emerald-400 border-b-emerald-300 animate-spin" style={{animationDuration: '2s'}}></div>
              
              {/* Central Hub */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulsing Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${methodInfo.color} rounded-full animate-ping opacity-20`}></div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${methodInfo.color} rounded-full animate-pulse`}></div>
                  
                  {/* Phone Icon */}
                  <div className={`relative bg-gradient-to-r ${methodInfo.color} p-4 rounded-full`}>
                    <Smartphone className="w-8 h-8 text-white animate-bounce" />
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-400 to-green-500 p-3 rounded-full animate-float shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full animate-float shadow-lg" style={{animationDelay: '1s'}}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              
              <div className="absolute top-1/2 -left-6 bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-full animate-float shadow-lg" style={{animationDelay: '2s'}}>
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent animate-fadeInUp">
                {methodInfo.name}
              </h1>
              
              <p className="text-gray-600 leading-relaxed animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                {methodInfo.description}
              </p>

              {/* Payment Details */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Montant:</span>
                    <span className="font-bold text-gray-900">{amount.toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Téléphone:</span>
                    <span className="font-medium text-gray-900">+225 {phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <div className={`h-full bg-gradient-to-r ${methodInfo.color} rounded-full animate-progress`}></div>
            </div>
            
            {/* Status Indicator */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 animate-fadeInUp backdrop-blur-sm" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center justify-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-gray-700 font-medium">
                  Vérification automatique en cours...
                </span>
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
                <p className="text-sm text-blue-800">{statusMessage}</p>
              </div>
            )}

            {/* Auto-detection Message */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-800 font-medium">
                  Détection automatique du paiement activée
                </p>
              </div>
              <p className="text-xs text-green-600 mt-2 text-center">
                La page se mettra à jour automatiquement une fois le paiement confirmé
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <a 
            href="https://moneroo.io" 
            className="flex items-center space-x-3 text-gray-500 hover:text-gray-700 transition-all duration-300 group"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span className="text-sm font-medium">Propulsé par</span>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span className="font-bold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">moneroo</span>
            </div>
          </a>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          @keyframes progress {
            0% {
              width: 0%;
            }
            50% {
              width: 70%;
            }
            100% {
              width: 100%;
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          
          .animate-progress {
            animation: progress 3s ease-in-out infinite;
          }
          
          /* Glassmorphism effect */
          .backdrop-blur-xl {
            backdrop-filter: blur(20px);
          }
        `
      }} />
    </div>
  );
}
