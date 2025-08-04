import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { StarIcon, ShoppingCartIcon } from 'lucide-react'
import { Product, storeService } from '../../services/api'
import { useCurrency } from '../../contexts/CurrencyContext'

interface RelatedProductsProps {
  category?: string;
  currentProductId?: string;
  storeId?: string;
}

export const RelatedProducts = ({ category, currentProductId, storeId }: RelatedProductsProps) => {
  // État pour gérer les erreurs d'images
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  
  // Images de fallback fiables
  const fallbackImage = 'https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2536&q=80';
  
  // Récupérer les vrais produits de la boutique
  const { data: storeProducts, isLoading } = useQuery({
    queryKey: ['store-products', storeId],
    queryFn: () => storeService.getStoreProducts(storeId || ''),
    enabled: !!storeId,
  });

  const { formatPrice } = useCurrency();
  
  // Fonction pour obtenir l'image d'un produit
  const getProductImage = (product: Product) => {
    if (imageErrors[product.id] || !product.images || product.images.length === 0) {
      return fallbackImage;
    }
    return product.images[0];
  };
  
  // Fonction pour gérer les erreurs d'images
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Filtrer les produits similaires (même catégorie, exclure le produit actuel)
  const getRelatedProducts = () => {
    if (!storeProducts) return [];
    
    let filteredProducts = storeProducts.filter(product => 
      product.id !== currentProductId
    );

    // Si on a une catégorie, filtrer par catégorie
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === category
      );
    }

    // Retourner les 4 premiers produits
    return filteredProducts.slice(0, 4);
  };

  const relatedProducts = getRelatedProducts();

  // Debug: Vérifier les données des produits
  relatedProducts.forEach((product, index) => {
    console.log(`🔍 RelatedProducts - Produit ${index + 1}:`, product.name);
    console.log(`💰 RelatedProducts - Prix actuel:`, product.price);
    console.log(`💰 RelatedProducts - Prix original:`, product.original_price);
    console.log(`💰 RelatedProducts - Type prix original:`, typeof product.original_price);
  });

  const handleAddToCart = (product: Product) => {
    // Rediriger vers le checkout avec les informations du produit
    console.log('🛒 RelatedProducts - Acheter maintenant:', product.name);
    
    if (storeId) {
      // Stocker les données du produit pour le checkout
      const checkoutData = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        storeId: storeId
      };
      
      console.log('🛒 RelatedProducts - Données de checkout à stocker:', checkoutData);
      
      // Stocker les données du produit pour le checkout
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      
      // Rediriger vers le checkout avec le nom de la boutique
      const checkoutUrl = `/${storeId}/checkout`;
      console.log('🔗 RelatedProducts - Redirection vers:', checkoutUrl);
      
      window.location.href = checkoutUrl;
    } else {
      console.error('❌ RelatedProducts - StoreId manquant pour le checkout');
      alert('Erreur: Impossible de déterminer la boutique');
    }
  }

  const handleProductClick = (product: Product) => {
    // Navigation vers la page produit
    console.log('Voir produit:', product.name);
    if (storeId) {
      window.location.href = `/${storeId}/product/${product.id}`;
    }
  }

  if (isLoading) {
    return (
      <div className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Produits similaires
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-64 mb-4"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null; // Ne pas afficher la section s'il n'y a pas de produits similaires
  }

  return (
    <div className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Produits similaires
        </h2>
        <a
          href="#"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
        >
          Voir plus
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            {/* Product Image with Overlay - Hauteur fixe */}
            <div className="w-full h-64 overflow-hidden flex-shrink-0">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={() => handleImageError(product.id)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="w-full bg-white text-gray-900 font-medium py-2 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <ShoppingCartIcon size={16} />
                    <span>Acheter maintenant</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      size={12}
                      className={
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                </div>
                <span className="ml-1 text-xs text-gray-500">
                  {product.rating || 0}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors flex-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{product.category}</p>
              <div className="flex justify-between items-center mt-auto">
                <div className="flex flex-col">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {(() => {
                      console.log('🎨 RelatedProducts - Affichage prix original:', product.original_price && product.original_price > product.price);
                      return product.original_price && product.original_price > product.price ? (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      ) : null;
                    })()}
                  </div>
                  {(() => {
                    console.log('🎨 RelatedProducts - Affichage pourcentage:', product.original_price && product.original_price > product.price);
                    return product.original_price && product.original_price > product.price ? (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                      </div>
                    ) : null;
                  })()}
                </div>
                {product.files && product.files.length > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Digital
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 