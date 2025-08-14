'use client';

import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { BoutiquePage } from '@/components/boutique-page';
import { Footer } from '@/components/footer';
import { HydrationSafe } from '@/components/hydration-safe';
import { storeService } from '@/services/api';
import { use } from 'react';

interface StorePageProps {
  params: Promise<{
    storeId: string;
  }>;
}

export default function StorePage({ params }: StorePageProps) {
  // Utiliser React.use() pour déballer les params (Next.js 15)
  const { storeId } = use(params);

  // Récupérer les données de la boutique
  const { data: store, isLoading, error } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreBySlug(storeId),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <HydrationSafe>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de votre boutique...</p>
          </div>
        </div>
      </HydrationSafe>
    );
  }

  // Afficher une erreur si la boutique n'est pas trouvée
  if (error || !store) {
    return (
      <HydrationSafe>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Boutique non trouvée
            </h1>
            <p className="text-gray-600 mb-4">
              La boutique &quot;{storeId}&quot; n&apos;existe pas ou n&apos;est pas accessible.
            </p>
            <p className="text-sm text-gray-500">
              Vérifiez l&apos;URL ou contactez le support.
            </p>
          </div>
        </div>
      </HydrationSafe>
    );
  }

  // Afficher la boutique avec la nouvelle bannière
  return (
    <HydrationSafe>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <Navigation store={store} />
        <main className="pt-16">
          <BoutiquePage storeId={storeId} />
        </main>
        <Footer />
      </div>
    </HydrationSafe>
  );
}
