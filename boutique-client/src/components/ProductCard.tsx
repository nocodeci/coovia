import React, { useState } from 'react';
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
  console.log('🏪 ProductCard - StoreId reçu:', storeId);
  console.log('📦 ProductCard - Produit:', product.name);
  console.log('💰 ProductCard - Prix actuel:', product.price);
  console.log('💰 ProductCard - Prix original:', product.original_price);
  console.log('💰 ProductCard - Type prix original:', typeof product.original_price);
  
  // État pour gérer les erreurs d'images
  const [imageError, setImageError] = useState(false);
  
  // Images de fallback fiables
  const fallbackImage = 'https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2536&q=80';
  
  // Obtenir l'image du produit ou l'image de fallback
  const getProductImage = () => {
    if (imageError || !product.images || product.images.length === 0) {
      return fallbackImage;
    }
    return product.images[0];
  };
  
  const calculateDiscount = () => {
    console.log('🧮 ProductCard - Calcul de réduction...');
    console.log('🧮 ProductCard - original_price existe:', !!product.original_price);
    console.log('🧮 ProductCard - original_price > price:', product.original_price && product.original_price > product.price);
    
    if (product.original_price && product.original_price > product.price) {
      const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
      console.log('🧮 ProductCard - Réduction calculée:', discount + '%');
      return discount;
    }
    console.log('🧮 ProductCard - Pas de réduction');
    return 0;
  };

  const discount = calculateDiscount();

  const handleViewDetails = () => {
    if (storeId) {
      // Utiliser le nouveau design de page produit
      window.location.href = `/${storeId}/product/${product.id}`;
    }
  };

  const handleBuy = () => {
    console.log('🛒 handleBuy appelé');
    console.log('🏪 StoreId dans handleBuy:', storeId);
    console.log('📦 Produit dans handleBuy:', product.name);
    
    if (storeId) {
      // Rediriger vers le checkout avec les informations du produit
      const checkoutData = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        storeId: storeId
      };
      
      console.log('🛒 Données de checkout à stocker:', checkoutData);
      
      // Stocker les données du produit pour le checkout
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      
      // Vérifier que les données ont été stockées
      const stored = sessionStorage.getItem('checkoutData');
      console.log('💾 Données stockées:', stored);
      
      // Rediriger vers le checkout avec le nom de la boutique
      const checkoutUrl = `/${storeId}/checkout`;
      console.log('🔗 Redirection vers:', checkoutUrl);
      
      // Utiliser window.location.href pour la redirection
      window.location.href = checkoutUrl;
    } else {
      console.error('❌ StoreId manquant pour le checkout');
      alert('Erreur: Impossible de déterminer la boutique');
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="w-full h-64 overflow-hidden flex-shrink-0">
        <img 
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          src={getProductImage()}
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBuy();
              }}
              className="w-full bg-white text-gray-900 font-medium py-2 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart" aria-hidden="true">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              <span>Acheter maintenant</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-gray-200" aria-hidden="true">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-gray-200" aria-hidden="true">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-gray-200" aria-hidden="true">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-gray-200" aria-hidden="true">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-gray-200" aria-hidden="true">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
          </div>
          <span className="ml-1 text-xs text-gray-500">{product.rating || 0}</span>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors flex-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.category}</p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
              {(() => {
                console.log('🎨 ProductCard - Affichage prix original:', product.original_price && product.original_price > product.price);
                return product.original_price && product.original_price > product.price ? (
                  <span className="text-xs text-gray-500 line-through">{formatPrice(product.original_price)}</span>
                ) : null;
              })()}
            </div>
            {(() => {
              console.log('🎨 ProductCard - Affichage pourcentage:', product.original_price && product.original_price > product.price);
              return product.original_price && product.original_price > product.price ? (
                <div className="text-xs text-green-600 font-medium mt-1">
                  -{discount}%
                </div>
              ) : null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard; 