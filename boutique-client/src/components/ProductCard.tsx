import React from 'react';
import { Heart, ShoppingBag, Star, Zap, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  category: string;
  tags: string[];
  in_stock: boolean;
  rating: number;
  review_count: number;
  store_id: string;
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  formatPrice: (price: number) => string;
  storeId?: string;
}

function ProductCard({ product, isFavorite, onToggleFavorite, formatPrice, storeId }: ProductCardProps) {
  const calculateDiscount = () => {
    if (product.original_price && product.original_price > product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  const handleViewDetails = () => {
    if (storeId) {
      window.location.href = `/${storeId}/products/${product.id}`;
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/30 transition-all duration-500 hover:-translate-y-2 hover:border-slate-300/60 min-w-0">
      {/* Image Container */}
      <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <img 
          src={product.images?.[0] || 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=500'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out cursor-pointer"
          onClick={handleViewDetails}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <div className="relative">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>-{discount}%</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur-md opacity-40 animate-pulse"></div>
            </div>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group/fav border border-white/20"
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${
              isFavorite 
                ? 'text-rose-500 fill-rose-500 scale-110' 
                : 'text-slate-400 group-hover/fav:text-rose-500 group-hover/fav:scale-110'
            }`} 
          />
        </button>

        {/* Quick Action Overlay */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleViewDetails();
              }}
              className="flex-1 bg-white/95 backdrop-blur-md text-slate-900 font-semibold py-3 px-4 rounded-xl hover:bg-white transition-all duration-200 shadow-lg border border-white/20 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Voir détails</span>
            </button>
            <button className="flex-1 bg-emerald-500/95 backdrop-blur-md text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-500 transition-all duration-200 shadow-lg border border-emerald-500/20 flex items-center justify-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Acheter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 
          className="font-bold text-slate-900 text-base leading-tight mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300 min-h-[2.5rem] cursor-pointer"
          onClick={handleViewDetails}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description.replace(/<[^>]*>/g, '')}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-slate-500 line-through font-medium">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            {product.original_price && product.original_price > product.price && (
              <div className="text-xs text-emerald-600 font-medium mt-1">
                Prix en promo
              </div>
            )}
          </div>
          
          {discount > 0 && (
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-600">
                -{discount}%
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleViewDetails}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-slate-200 shadow-lg hover:shadow-slate-200/50 relative overflow-hidden group/btn"
          >
            <div className="relative flex items-center justify-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Voir détails</span>
            </div>
          </button>
          
          <button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-emerald-200 shadow-lg hover:shadow-emerald-200/50 relative overflow-hidden group/btn">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Acheter</span>
            </div>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Instantané</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Support</span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}

export default ProductCard; 