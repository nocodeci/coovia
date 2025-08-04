import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { ProductGallery } from './ProductGallery'
import { ProductInfo } from './ProductInfo'
import VendorInfo from './VendorInfo'
import { PurchaseOptions } from './PurchaseOptions'
import ReviewSection from './ReviewSection'
import { RelatedProducts } from './RelatedProducts'
import { ShoppingCartIcon, ArrowLeft } from 'lucide-react'
import { storeService, Product, Store } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';
import CurrencySelector from '../CurrencySelector';

interface ProductPageProps {
  storeId: string;
  productId: string;
}

export const ProductPage = ({ storeId, productId }: ProductPageProps) => {
  const [selectedTab, setSelectedTab] = useState('description')

  // Fonction pour nettoyer les balises HTML
  const cleanHtmlTags = (htmlString: string): string => {
    if (!htmlString) return '';
    return htmlString.replace(/<[^>]*>/g, '');
  }

  // Récupérer les données de la boutique
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreBySlug(storeId),
  });

  // Récupérer les détails du produit
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', storeId, productId],
    queryFn: () => storeService.getProduct(storeId, productId),
    enabled: !!storeId && !!productId,
  });

  // Gérer l'achat immédiat
  const handlePurchase = () => {
    if (!product) return;
    
    // Stocker les données du produit pour le checkout
    const checkoutData = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      storeId: storeId
    };
    
    console.log('🛒 ProductPage - Données de checkout à stocker:', checkoutData);
    
    // Stocker les données du produit pour le checkout
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Rediriger vers le checkout avec le nom de la boutique
    const checkoutUrl = `/${storeId}/checkout`;
    console.log('🔗 ProductPage - Redirection vers:', checkoutUrl);
    
    window.location.href = checkoutUrl;
  };

  // Gérer l'ajout au panier
  const handleAddToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        product,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
  };

  // Gérer le partage
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  // Gérer la wishlist
  const handleWishlist = () => {
    alert('Fonctionnalité wishlist à implémenter');
  };

  if (storeLoading || productLoading) {
    return <LoadingSpinner />;
  }

  if (!product || !store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Produit non trouvé</h1>
            <p className="text-slate-600 mb-8">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 z-[60] shadow-lg"></div>
      
      {/* Header */}
      <header className="fixed top-1 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => window.location.href = `/${storeId}`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag w-5 h-5 text-white" aria-hidden="true">
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                  <path d="M3.103 6.034h17.794"></path>
                  <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{store.name}</h1>
                <div className="text-xs text-slate-500 font-medium">Digital Store</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag w-4 h-4" aria-hidden="true">
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                  <path d="M3.103 6.034h17.794"></path>
                  <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
                </svg>
                <span>Mes achats</span>
              </a>
            </nav>
            <div className="md:hidden flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <img className="w-4 h-4 rounded-full" alt="CI" src="https://cdn.axazara.com/flags/svg/CI.svg" />
                <span className="text-xs font-medium text-slate-700">(F CFA)</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-3 h-3 text-slate-500" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu w-5 h-5" aria-hidden="true">
                  <path d="M4 12h16"></path>
                  <path d="M4 18h16"></path>
                  <path d="M4 6h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pt-20">

        {/* Product Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left Side - Scrollable Content */}
          <div className="w-full lg:w-3/5 lg:h-screen lg:overflow-y-auto lg:pr-4 product-details-scroll">
            <ProductGallery product={product} />
            
            {/* Product Details Tabs - Desktop */}
            <div className="hidden lg:block mt-8">
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  <button
                    className={`py-4 px-1 font-medium text-sm ${selectedTab === 'description' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setSelectedTab('description')}
                  >
                    Description
                  </button>
                  <button
                    className={`py-4 px-1 font-medium text-sm ${selectedTab === 'specifications' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setSelectedTab('specifications')}
                  >
                    Spécifications
                  </button>
                  <button
                    className={`py-4 px-1 font-medium text-sm ${selectedTab === 'reviews' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setSelectedTab('reviews')}
                  >
                    Avis
                  </button>
                </div>
              </div>
              <div className="py-6">
                {selectedTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-600">
                      {cleanHtmlTags(product.description)}
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                        <span>Produit de qualité premium</span>
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                        <span>Support client disponible</span>
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                        <span>Mises à jour gratuites</span>
                      </li>
                      {product.files && product.files.length > 0 && (
                        <li className="flex items-center">
                          <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                          <span>Téléchargement instantané</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {selectedTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <h3 className="font-medium text-gray-900">Catégorie</h3>
                      <p className="text-gray-600 mt-2">{product.category}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Tags</h3>
                      <p className="text-gray-600 mt-2">{product.tags?.join(', ') || 'Aucun tag'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Statut</h3>
                      <p className="text-gray-600 mt-2">{product.in_stock ? 'En stock' : 'Rupture de stock'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Note</h3>
                      <p className="text-gray-600 mt-2">{product.rating || 0}/5 ({product.review_count || 0} avis)</p>
                    </div>
                    {product.files && product.files.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900">Fichiers inclus</h3>
                        <p className="text-gray-600 mt-2">{product.files.length} fichier{product.files.length > 1 ? 's' : ''}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">Prix</h3>
                      <p className="text-gray-600 mt-2">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF',
                          minimumFractionDigits: 0,
                        }).format(product.price)}
                      </p>
                    </div>
                  </div>
                )}
                {selectedTab === 'reviews' && <ReviewSection />}
              </div>
            </div>
          </div>
          
          {/* Right Side - Fixed Product Info */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-8 lg:self-start">
            <ProductInfo 
              product={product} 
              onShare={handleShare}
              onWishlist={handleWishlist}
              onAddToCart={handlePurchase}
            />
            
            {/* Product Details Tabs - Mobile */}
            <div className="lg:hidden mt-6">
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  <button
                    className={`py-4 px-1 font-medium text-sm ${selectedTab === 'description' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setSelectedTab('description')}
                  >
                    Description
                  </button>
                  <button
                    className={`py-4 px-1 font-medium text-sm ${selectedTab === 'specifications' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setSelectedTab('specifications')}
                  >
                    Spécifications
                  </button>
                  <button
                    className={`py-4 px-1 font-medium text-sm ${selectedTab === 'reviews' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setSelectedTab('reviews')}
                  >
                    Avis
                  </button>
                </div>
              </div>
              <div className="py-6">
                {selectedTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-600">
                      {cleanHtmlTags(product.description)}
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                        <span>Produit de qualité premium</span>
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                        <span>Support client disponible</span>
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                        <span>Mises à jour gratuites</span>
                      </li>
                      {product.files && product.files.length > 0 && (
                        <li className="flex items-center">
                          <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                          <span>Téléchargement instantané</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {selectedTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <h3 className="font-medium text-gray-900">Catégorie</h3>
                      <p className="text-gray-600 mt-2">{product.category}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Tags</h3>
                      <p className="text-gray-600 mt-2">{product.tags?.join(', ') || 'Aucun tag'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Statut</h3>
                      <p className="text-gray-600 mt-2">{product.in_stock ? 'En stock' : 'Rupture de stock'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Note</h3>
                      <p className="text-gray-600 mt-2">{product.rating || 0}/5 ({product.review_count || 0} avis)</p>
                    </div>
                    {product.files && product.files.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900">Fichiers inclus</h3>
                        <p className="text-gray-600 mt-2">{product.files.length} fichier{product.files.length > 1 ? 's' : ''}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">Prix</h3>
                      <p className="text-gray-600 mt-2">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF',
                          minimumFractionDigits: 0,
                        }).format(product.price)}
                      </p>
                    </div>
                  </div>
                )}
                {selectedTab === 'reviews' && <ReviewSection />}
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-6"></div>
            <VendorInfo store={store} />
            <div className="border-t border-gray-200 my-6"></div>
            <PurchaseOptions 
              product={product}
              onPurchase={handlePurchase}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>



        {/* Related Products */}
        <RelatedProducts 
          category={product.category}
          currentProductId={product.id}
          storeId={storeId}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{store.name}</h3>
              <p className="text-gray-300 text-sm">
                {store.description || 'Boutique en ligne de produits numériques de qualité.'}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Catégories</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    {product.category}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Produits numériques
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Formations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Templates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Boutique</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Conditions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Conditions de vente
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Remboursements
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 {store.name}. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 