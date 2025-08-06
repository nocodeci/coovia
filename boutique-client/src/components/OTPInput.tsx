import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  className?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  onComplete,
  disabled = false,
  className = ''
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Ne permettre que les chiffres
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Passer au champ suivant si une valeur est entrée
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Vérifier si l'OTP est complet
    const otpString = newOtp.join('');
    if (otpString.length === length) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Aller au champ précédent sur Backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Aller au champ suivant sur ArrowRight
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Aller au champ précédent sur ArrowLeft
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    
    if (pastedData.length === length) {
      const newOtp = pastedData.split('').slice(0, length);
      setOtp(newOtp);
      onComplete?.(newOtp.join(''));
      
      // Focus sur le dernier champ
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      {otp.map((digit, index) => (
        <div key={index} className="relative">
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{1}"
            min="0"
            max="9"
            maxLength={1}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Caractère ${index + 1}`}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-12 text-center text-lg font-semibold
              border-2 border-gray-200 rounded-lg
              focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition-all duration-200
              ${digit ? 'border-orange-500 bg-orange-50' : ''}
            `}
          />
        </div>
      ))}
    </div>
  );
};

export default OTPInput; 