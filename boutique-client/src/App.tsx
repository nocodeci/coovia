import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BoutiquePage from './components/BoutiquePage';
import ProductDetail from './components/ProductDetail';

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

  console.log('🔍 Store slug from URL:', storeSlug);
  console.log('🌐 Current URL:', window.location.href);
  console.log('📦 Is product detail:', isProductDetail);
  console.log('🆔 Product ID:', productId);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        {isProductDetail && productId ? (
          <ProductDetail storeId={storeSlug} productId={productId} />
        ) : (
          <BoutiquePage storeId={storeSlug} />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App; 