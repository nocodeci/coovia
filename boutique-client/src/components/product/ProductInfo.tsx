import React from 'react';
import { Star, Heart, Share2, ShoppingCart } from 'lucide-react';
import { Product } from '../../services/api';
import { useCurrency } from '../../contexts/CurrencyContext';
import CurrencySelector from '../CurrencySelector';

interface ProductInfoProps {
  product: Product;
  onShare?: () => void;
  onWishlist?: () => void;
  onAddToCart?: () => void;
}

export const ProductInfo = ({ product, onShare, onWishlist, onAddToCart }: ProductInfoProps) => {
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
      {/* Titre et catégorie */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm text-indigo-600 font-medium">{product.category}</span>
          {product.tags && product.tags.length > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">{product.tags[0]}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
      </div>



      {/* Prix avec sélecteur de devise */}
      <div className="flex items-baseline space-x-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          <CurrencySelector />
        </div>
        {product.original_price && product.original_price > product.price && (
          <span className="text-xl text-gray-500 line-through">{formatPrice(product.original_price)}</span>
        )}
        {discount > 0 && (
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
            -{discount}%
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onWishlist}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm">Wishlist</span>
          </button>
          <button 
            onClick={onShare}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Partager</span>
          </button>
        </div>
        
        {/* Bouton Acheter maintenant */}
        {onAddToCart && (
          <button 
            onClick={onAddToCart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Acheter maintenant</span>
          </button>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.files && product.files.length > 0 && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Téléchargement instantané
          </span>
        )}
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Mises à jour gratuites
        </span>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          Licence commerciale
        </span>
        {product.in_stock ? (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            En stock
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            Rupture de stock
          </span>
        )}
      </div>
    </div>
  );
}; 