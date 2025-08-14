'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';

interface Country {
  name: string;
  code: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

interface CountrySelectorProps {
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
}

const countries: Country[] = [
  { name: 'Côte d\'Ivoire', code: 'CI', flag: 'ci', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Sénégal', code: 'SN', flag: 'sn', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Mali', code: 'ML', flag: 'ml', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Burkina Faso', code: 'BF', flag: 'bf', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Bénin', code: 'BJ', flag: 'bj', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Togo', code: 'TG', flag: 'tg', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Cameroun', code: 'CM', flag: 'cm', currency: 'XAF', currencySymbol: 'FCFA' },
  { name: 'République Démocratique du Congo', code: 'CD', flag: 'cd', currency: 'CDF', currencySymbol: 'FC' },
  { name: 'Congo', code: 'CG', flag: 'cg', currency: 'XAF', currencySymbol: 'FCFA' },
  { name: 'Gabon', code: 'GA', flag: 'ga', currency: 'XAF', currencySymbol: 'FCFA' },
  { name: 'Rwanda', code: 'RW', flag: 'rw', currency: 'RWF', currencySymbol: 'R₣' },
  { name: 'Zambie', code: 'ZMB', flag: 'zm', currency: 'ZMW', currencySymbol: 'K' },
  { name: 'Ouganda', code: 'UG', flag: 'ug', currency: 'UGX', currencySymbol: 'USh' },
  { name: 'Tanzanie', code: 'TZ', flag: 'tz', currency: 'TZS', currencySymbol: 'TSh' },
  { name: 'Kenya', code: 'KE', flag: 'ke', currency: 'KES', currencySymbol: 'KSh' },
  { name: 'Nigeria', code: 'NG', flag: 'ng', currency: 'NGN', currencySymbol: '₦' }
];

export function CountrySelector({ selectedCountry, onCountrySelect }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCountryData = countries.find(c => c.code === selectedCountry) || countries[0];

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-3 w-full justify-between"
      >
        <div className="flex items-center space-x-3">
          <img 
            data-testid="circle-country-flag" 
            title={selectedCountryData.flag} 
            height="100" 
            src={`https://react-circle-flags.pages.dev/${selectedCountryData.flag}.svg`}
            className="w-5 h-5 rounded-full"
            alt={`${selectedCountryData.name} flag`}
          />
          <span className="text-sm font-medium text-foreground">{selectedCountryData.name}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50">
          <div className="bg-background border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  onCountrySelect(country.code);
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-muted transition-colors"
              >
                <img 
                  data-testid="circle-country-flag" 
                  title={country.flag} 
                  height="100" 
                  src={`https://react-circle-flags.pages.dev/${country.flag}.svg`}
                  className="w-5 h-5 rounded-full"
                  alt={`${country.name} flag`}
                />
                <span className="text-sm text-foreground flex-1">{country.name}</span>
                <span className="text-xs text-muted-foreground">{country.currencySymbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

