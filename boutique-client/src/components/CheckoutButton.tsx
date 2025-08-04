import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';

interface CheckoutButtonProps {
  storeSlug: string;
  productId?: string;
  productName?: string;
  price?: number;
  className?: string;
  children?: React.ReactNode;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ 
  storeSlug, 
  productId,
  productName,
  price,
  className = '',
  children 
}) => {
  const handleCheckout = () => {
    // Stocker les informations du produit si fournies
    if (productId && productName && price) {
      const checkoutData = {
        productId,
        productName,
        price,
        storeId: storeSlug
      };
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    }
    
    // Rediriger vers la page de checkout
    window.location.href = `/${storeSlug}/checkout`;
  };

  return (
    <button
      onClick={handleCheckout}
      className={`
        inline-flex items-center justify-center gap-2
        bg-gradient-to-r from-[#12372a] to-[#1a4d35]
        hover:from-[#1a4d35] hover:to-[#12372a]
        text-white font-semibold py-3 px-6 rounded-lg
        shadow-lg hover:shadow-xl transform transition-all duration-300
        hover:scale-105 active:scale-95
        ${className}
      `}
    >
      {children || (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Procéder au paiement</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
};

export default CheckoutButton; 