'use client';

import { ProductPage } from '@/components/product-page';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { HydrationSafe } from '@/components/hydration-safe';
import { useQuery } from '@tanstack/react-query';
import { storeService } from '@/services/api';
import { use } from 'react';

interface ProductPageRouteProps {
  params: Promise<{
    storeId: string;
    productId: string;
  }>;
}

export default function ProductPageRoute({ params }: ProductPageRouteProps) {
  // Utiliser React.use() pour déballer les params (Next.js 15)
  const { storeId, productId } = use(params);

  // Récupérer les données de la boutique pour la navigation
  const { data: store } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreBySlug(storeId),
  });

  return (
    <HydrationSafe>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <Navigation store={store} />
        <ProductPage storeId={storeId} productId={productId} />
        <Footer />
      </div>
    </HydrationSafe>
  );
}

