'use client';

import { useParams } from 'next/navigation';
import { CheckoutPage } from '@/components/checkout-page';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { HydrationSafe } from '@/components/hydration-safe';
import { useQuery } from '@tanstack/react-query';
import { storeService } from '@/services/api';

export default function CheckoutPageRoute() {
  const params = useParams();
  const storeId = params.storeId as string;

  const { data: store } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreBySlug(storeId),
  });

  return (
    <HydrationSafe>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <CheckoutPage storeId={storeId} />
        <Footer />
      </div>
    </HydrationSafe>
  );
}

