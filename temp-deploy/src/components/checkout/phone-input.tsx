'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

interface PhoneCountry {
  name: string;
  code: string;
  flag: string;
  phoneCode: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
}

const phoneCountries: PhoneCountry[] = [
  { name: 'Côte d\'Ivoire', code: 'CI', flag: 'ci', phoneCode: '225' },
  { name: 'Sénégal', code: 'SN', flag: 'sn', phoneCode: '221' },
  { name: 'Mali', code: 'ML', flag: 'ml', phoneCode: '223' },
  { name: 'Burkina Faso', code: 'BF', flag: 'bf', phoneCode: '226' },
  { name: 'Bénin', code: 'BJ', flag: 'bj', phoneCode: '229' },
  { name: 'Togo', code: 'TG', flag: 'tg', phoneCode: '228' },
  { name: 'Cameroun', code: 'CM', flag: 'cm', phoneCode: '237' },
  { name: 'République Démocratique du Congo', code: 'CD', flag: 'cd', phoneCode: '243' },
  { name: 'Congo', code: 'CG', flag: 'cg', phoneCode: '242' },
  { name: 'Gabon', code: 'GA', flag: 'ga', phoneCode: '241' },
  { name: 'Rwanda', code: 'RW', flag: 'rw', phoneCode: '250' },
  { name: 'Zambie', code: 'ZMB', flag: 'zm', phoneCode: '260' },
  { name: 'Ouganda', code: 'UG', flag: 'ug', phoneCode: '256' },
  { name: 'Tanzanie', code: 'TZ', flag: 'tz', phoneCode: '255' },
  { name: 'Kenya', code: 'KE', flag: 'ke', phoneCode: '254' },
  { name: 'Nigeria', code: 'NG', flag: 'ng', phoneCode: '234' }
];

export function PhoneInput({ value, onChange, selectedCountry, onCountrySelect }: PhoneInputProps) {
  const [isPhoneCountryOpen, setIsPhoneCountryOpen] = useState(false);
  const selectedPhoneCountry = phoneCountries.find(c => c.code === selectedCountry) || phoneCountries[0];

  return (
    <div className="relative">
      <div className="flex">
        <button
          type="button"
          onClick={() => setIsPhoneCountryOpen(!isPhoneCountryOpen)}
          className="flex items-center space-x-2 px-4 py-3 bg-background border border-r-0 border-border rounded-l-lg hover:border-input transition-all duration-200"
        >
          <img 
            data-testid="circle-country-flag" 
            title={selectedPhoneCountry.flag} 
            height="100" 
            src={`https://react-circle-flags.pages.dev/${selectedPhoneCountry.flag}.svg`}
            className="w-4 h-4 rounded-full"
            alt={`${selectedPhoneCountry.name} flag`}
          />
          <span className="text-sm font-medium text-foreground">+{selectedPhoneCountry.phoneCode}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0123456789"
          className="flex-1 rounded-r-lg border border-l-0 border-border px-4 py-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 bg-background"
        />
      </div>

      {isPhoneCountryOpen && createPortal(
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsPhoneCountryOpen(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-background border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {phoneCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  onCountrySelect(country.code);
                  setIsPhoneCountryOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-muted transition-colors"
              >
                <img 
                  data-testid="circle-country-flag" 
                  title={country.flag} 
                  height="100" 
                  src={`https://react-circle-flags.pages.dev/${country.flag}.svg`}
                  className="w-4 h-4 rounded-full"
                  alt={`${country.name} flag`}
                />
                <span className="text-sm text-foreground flex-1">{country.name}</span>
                <span className="text-xs text-muted-foreground">+{country.phoneCode}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

