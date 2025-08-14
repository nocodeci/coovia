'use client';

import { useParams } from 'next/navigation';
import { ProductPage } from '@/components/product-page';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { HydrationSafe } from '@/components/hydration-safe';
import { useQuery } from '@tanstack/react-query';
import { storeService } from '@/services/api';

export default function ProductPageRoute() {
  const params = useParams();
  const storeId = params.storeId as string;
  const productId = params.productId as string;

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

