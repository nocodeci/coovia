'use client';

import React from 'react';
import { Button } from '@/components/ui';

interface PaymentFormRendererProps {
  selectedMethod: string;
  paymentToken: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export const PaymentFormRenderer: React.FC<PaymentFormRendererProps> = ({
  selectedMethod,
  paymentToken,
  customerName,
  customerEmail,
  customerPhone,
  amount,
  currency,
  onSuccess,
  onError
}) => {
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePaydunyaSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // Simulation d'un appel API Paydunya
      console.log('Soumission Paydunya:', {
        method: selectedMethod,
        token: paymentToken,
        customer: { name: customerName, email: customerEmail, phone: customerPhone },
        amount,
        currency
      });

      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simuler une réponse réussie
      const mockResponse = {
        success: true,
        message: 'Paiement initié avec succès',
        data: {
          transaction_id: 'paydunya_' + Date.now(),
          status: 'pending',
          redirect_url: 'https://paydunya.com/payment'
        }
      };

      onSuccess(mockResponse);
    } catch (error) {
      onError(error);
    }
  };

  const handlePawapaySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // Simulation d'un appel API Pawapay
      console.log('Soumission Pawapay:', {
        method: selectedMethod,
        token: paymentToken,
        customer: { name: customerName, email: customerEmail, phone: customerPhone },
        amount,
        currency
      });

      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simuler une réponse réussie
      const mockResponse = {
        success: true,
        message: 'Paiement initié avec succès',
        data: {
          deposit_id: 'pawapay_' + Date.now(),
          status: 'ACCEPTED',
          redirect_url: 'https://pawapay.com/payment'
        }
      };

      onSuccess(mockResponse);
    } catch (error) {
      onError(error);
    }
  };

  // Déterminer le type de formulaire basé sur la méthode sélectionnée
  const getFormType = (method: string) => {
    if (method.includes('orange-money')) return 'orange-money';
    if (method.includes('wave') || method.includes('mtn') || method.includes('moov')) return 'mobile-money';
    if (method.includes('paydunya')) return 'paydunya';
    if (method.includes('pawapay')) return 'pawapay';
    return 'generic';
  };

  const formType = getFormType(selectedMethod);

  switch (formType) {
    case 'orange-money':
      return (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">O</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Orange Money</h3>
            <p className="text-muted-foreground">Paiement via Orange Money</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Montant à payer : <span className="font-bold text-foreground">{formatAmount(amount, currency)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Numéro : <span className="font-medium">{customerPhone}</span>
            </p>
          </div>

          <Button
            onClick={() => {
              // Simuler la redirection vers Orange Money
              onSuccess({
                success: true,
                message: 'Redirection vers Orange Money',
                data: { provider: 'orange-money', status: 'redirecting' }
              });
            }}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Payer avec Orange Money
          </Button>
        </div>
      );

    case 'mobile-money':
      return (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">M</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Mobile Money</h3>
            <p className="text-muted-foreground">Paiement via {selectedMethod}</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Montant à payer : <span className="font-bold text-foreground">{formatAmount(amount, currency)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Numéro : <span className="font-medium">{customerPhone}</span>
            </p>
          </div>

          <Button
            onClick={() => {
              // Simuler la redirection vers le provider mobile money
              onSuccess({
                success: true,
                message: 'Redirection vers le provider',
                data: { provider: selectedMethod, status: 'redirecting' }
              });
            }}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Payer avec {selectedMethod}
          </Button>
        </div>
      );

    case 'paydunya':
      return (
        <form onSubmit={handlePaydunyaSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Paydunya</h3>
            <p className="text-muted-foreground">Paiement sécurisé via Paydunya</p>
          </div>

          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant :</span>
                <span className="font-bold">{formatAmount(amount, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client :</span>
                <span>{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email :</span>
                <span>{customerEmail}</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Procéder au paiement Paydunya
          </Button>
        </form>
      );

    case 'pawapay':
      return (
        <form onSubmit={handlePawapaySubmit} className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Pawapay</h3>
            <p className="text-muted-foreground">Paiement via Pawapay</p>
          </div>

          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant :</span>
                <span className="font-bold">{formatAmount(amount, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client :</span>
                <span>{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Téléphone :</span>
                <span>{customerPhone}</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Procéder au paiement Pawapay
          </Button>
        </form>
      );

    default:
      return (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">?</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Méthode de paiement</h3>
            <p className="text-muted-foreground">{selectedMethod}</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Montant : <span className="font-bold text-foreground">{formatAmount(amount, currency)}</span>
            </p>
          </div>

          <Button
            onClick={() => {
              onSuccess({
                success: true,
                message: 'Paiement simulé avec succès',
                data: { provider: selectedMethod, status: 'completed' }
              });
            }}
            className="w-full"
          >
            Simuler le paiement
          </Button>
        </div>
      );
  }
};
