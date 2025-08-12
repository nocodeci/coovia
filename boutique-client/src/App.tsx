import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BoutiquePage from './components/BoutiquePage';
import ProductDetail from './components/ProductDetail';
import { ProductPage } from './components/product/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductPageTest from './pages/ProductPageTest';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { useSubdomain } from './hooks/useSubdomain';
import { storeService, Store } from './services/storeService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { subdomain, isSubdomain } = useSubdomain();
  const [storeData, setStoreData] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les segments de l'URL
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  
  // Déterminer le storeSlug : priorité au sous-domaine, puis à l'URL
  const storeSlug = isSubdomain && subdomain ? subdomain : (pathSegments[0] || 'store-123');
  
  // Vérifier si c'est une page de détail de produit
  const isProductDetail = pathSegments.length >= 3 && pathSegments[1] === 'products';
  const productId = isProductDetail ? pathSegments[2] : null;

  // Vérifier si c'est la page de checkout
  const isCheckout = pathSegments.length >= 2 && pathSegments[1] === 'checkout';

  // Vérifier si c'est la page de test du nouveau design
  const isProductPageTest = pathSegments.length >= 2 && pathSegments[1] === 'product-test';

  // Vérifier si c'est la nouvelle page produit avec le nouveau design
  const isNewProductPage = pathSegments.length >= 3 && pathSegments[1] === 'product';
  const newProductId = isNewProductPage ? pathSegments[2] : null;

  // Charger les données de la boutique si c'est un sous-domaine
  useEffect(() => {
    const loadStoreData = async () => {
      if (isSubdomain && subdomain) {
        setLoading(true);
        try {
          const store = await storeService.getStoreBySlug(subdomain);
          setStoreData(store);
        } catch (error) {
          console.error('Erreur lors du chargement de la boutique:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadStoreData();
  }, [isSubdomain, subdomain]);

  console.log('🔍 Store slug from URL:', storeSlug);
  console.log('🌐 Current URL:', window.location.href);
  console.log('🏪 Is subdomain:', isSubdomain);
  console.log('📝 Subdomain:', subdomain);
  console.log('📦 Is product detail:', isProductDetail);
  console.log('🆔 Product ID:', productId);
  console.log('💳 Is checkout:', isCheckout);
  console.log('🧪 Is product page test:', isProductPageTest);
  console.log('🆕 Is new product page:', isNewProductPage);
  console.log('🆔 New Product ID:', newProductId);
  console.log('🏪 Store data:', storeData);

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  // Si c'est un sous-domaine mais que la boutique n'existe pas
  if (isSubdomain && !storeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Boutique introuvable</h1>
          <p className="text-gray-600 mb-4">La boutique "{subdomain}" n'existe pas.</p>
          <a 
            href="https://wozif.store" 
            className="text-green-600 hover:text-green-700 underline"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
          {isProductPageTest ? (
            <ProductPageTest />
          ) : isNewProductPage && newProductId ? (
            <ProductPage storeId={storeSlug} productId={newProductId} />
          ) : isCheckout ? (
            <CheckoutPage />
          ) : isProductDetail && productId ? (
            <ProductDetail storeId={storeSlug} productId={productId} />
          ) : (
            <BoutiquePage storeId={storeSlug} />
          )}
        </div>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App; 