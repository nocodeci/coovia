import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BoutiquePage from './components/BoutiquePage';
import ProductDetail from './components/ProductDetail';
import { ProductPage } from './components/product/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductPageTest from './pages/ProductPageTest';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Récupérer les segments de l'URL
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const storeSlug = pathSegments[0] || 'store-123'; // Fallback par défaut
  
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

  console.log('🔍 Store slug from URL:', storeSlug);
  console.log('🌐 Current URL:', window.location.href);
  console.log('📦 Is product detail:', isProductDetail);
  console.log('🆔 Product ID:', productId);
  console.log('💳 Is checkout:', isCheckout);
  console.log('🧪 Is product page test:', isProductPageTest);
  console.log('🆕 Is new product page:', isNewProductPage);
  console.log('🆔 New Product ID:', newProductId);

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
        <Toaster />
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App; 