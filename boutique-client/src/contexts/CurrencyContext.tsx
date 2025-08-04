import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Taux de conversion par rapport à XOF
}

interface CurrencyContextType {
  currency: Currency;
  currencies: Currency[];
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number, fromCurrency?: string) => number;
  formatPrice: (price: number) => string;
}

const defaultCurrencies: Currency[] = [
  {
    code: 'XOF',
    name: 'Franc CFA (XOF)',
    symbol: 'CFA',
    rate: 1
  },
  {
    code: 'USD',
    name: 'Dollar US (USD)',
    symbol: '$',
    rate: 0.0017 // 1 XOF = 0.0017 USD
  },
  {
    code: 'EUR',
    name: 'Euro (EUR)',
    symbol: '€',
    rate: 0.0015 // 1 XOF = 0.0015 EUR
  },
  {
    code: 'GBP',
    name: 'Livre Sterling (GBP)',
    symbol: '£',
    rate: 0.0013 // 1 XOF = 0.0013 GBP
  },
  {
    code: 'XAF',
    name: 'Franc CFA (XAF)',
    symbol: 'FCFA',
    rate: 1 // Même valeur que XOF
  },
  {
    code: 'CDF',
    name: 'Franc Congolais (CDF)',
    symbol: 'FC',
    rate: 2.85 // 1 XOF = 2.85 CDF
  },
  {
    code: 'NGN',
    name: 'Naira Nigérian (NGN)',
    symbol: '₦',
    rate: 0.85 // 1 XOF = 0.85 NGN
  },
  {
    code: 'GHS',
    name: 'Cedi Ghanéen (GHS)',
    symbol: '₵',
    rate: 0.012 // 1 XOF = 0.012 GHS
  }
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(defaultCurrencies[0]); // XOF par défaut

  const convertPrice = (price: number, fromCurrency: string = 'XOF'): number => {
    // Si la devise source est XOF, convertir vers la devise sélectionnée
    if (fromCurrency === 'XOF') {
      return price * currency.rate;
    }
    
    // Sinon, convertir d'abord vers XOF puis vers la devise sélectionnée
    const xofRate = defaultCurrencies.find(c => c.code === fromCurrency)?.rate || 1;
    const xofPrice = price / xofRate;
    return xofPrice * currency.rate;
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    
    // Formatage spécifique selon la devise
    switch (currency.code) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(convertedPrice);
      
      case 'EUR':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
        }).format(convertedPrice);
      
      case 'GBP':
        return new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
          minimumFractionDigits: 2,
        }).format(convertedPrice);
      
      case 'NGN':
        return new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(convertedPrice);
      
      case 'GHS':
        return new Intl.NumberFormat('en-GH', {
          style: 'currency',
          currency: 'GHS',
          minimumFractionDigits: 2,
        }).format(convertedPrice);
      
      case 'CDF':
        return new Intl.NumberFormat('fr-CD', {
          style: 'currency',
          currency: 'CDF',
          minimumFractionDigits: 0,
        }).format(convertedPrice);
      
      case 'XAF':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XAF',
          minimumFractionDigits: 0,
        }).format(convertedPrice);
      
      default: // XOF
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0,
        }).format(convertedPrice);
    }
  };

  const value: CurrencyContextType = {
    currency,
    currencies: defaultCurrencies,
    setCurrency,
    convertPrice,
    formatPrice
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}; 