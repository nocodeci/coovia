import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BoutiquePage from './components/BoutiquePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Récupérer le slug de la boutique depuis l'URL
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const storeSlug = pathSegments[0] || 'store-123'; // Fallback par défaut

  console.log('🔍 Store slug from URL:', storeSlug);
  console.log('🌐 Current URL:', window.location.href);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <BoutiquePage storeId={storeSlug} />
      </div>
    </QueryClientProvider>
  );
}

export default App; 