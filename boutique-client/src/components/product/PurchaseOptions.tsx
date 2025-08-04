import React from 'react';
import { Download, CreditCard, Shield } from 'lucide-react';
import { Product } from '../../services/api';
import { useCurrency } from '../../contexts/CurrencyContext';

interface PurchaseOptionsProps {
  product: Product;
  onPurchase: () => void;
  onAddToCart: () => void;
}

export const PurchaseOptions = ({ product, onPurchase, onAddToCart }: PurchaseOptionsProps) => {
  const { formatPrice } = useCurrency();

  // Calculer la remise
  const calculateDiscount = () => {
    if (product.original_price && product.original_price > product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className="space-y-6">
      {/* Garanties */}
      <div className="space-y-3">
        {product.files && product.files.length > 0 && (
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Download className="w-4 h-4" />
            <span>Téléchargement instantané après achat</span>
          </div>
        )}
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Garantie de remboursement de 30 jours</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <CreditCard className="w-4 h-4" />
          <span>Paiement sécurisé</span>
        </div>
      </div>

      {/* Informations supplémentaires */}
      {discount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              Économisez {discount}% avec cette offre spéciale !
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 