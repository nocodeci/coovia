'use client';

import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { BoutiquePage } from '@/components/boutique-page';
import { Footer } from '@/components/footer';
import { HydrationSafe } from '@/components/hydration-safe';
import { storeService } from '@/services/api';
import { Store } from '@/types/store';
import { use } from 'react';

interface StorePageProps {
  params: Promise<{
    storeId: string;
  }>;
}

export default function StorePage({ params }: StorePageProps) {
  // Utiliser React.use() pour déballer les params (Next.js 15)
  const { storeId } = use(params);

  // Données de test pour la boutique test-store
  const testStore: Store = {
    id: '9f9e1c83-e453-49c5-8f32-f756f866b8de',
    name: 'Test Store',
    slug: 'test-store',
    description: 'Boutique de test pour les sous-domaines',
    logo: undefined,
    status: 'active',
    created_at: '2025-08-12T15:58:40.000000Z',
    updated_at: '2025-08-12T15:58:40.000000Z',
  };



  // Pour toutes les boutiques, utiliser l'API (sauf test-store qui utilise les données de test)
  const { data: store, isLoading, error } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreBySlug(storeId),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: storeId !== 'test-store', // Désactiver l'API pour test-store
  });

  // Utiliser les données de test pour test-store, sinon utiliser l'API
  const finalStore = storeId === 'test-store' ? testStore : store;

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
  if (error || (!store && storeId !== 'test-store')) {
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
        <Navigation store={finalStore} />
        <main className="pt-16">
          <BoutiquePage storeId={storeId} />
        </main>
        <Footer />
      </div>
    </HydrationSafe>
  );
}
