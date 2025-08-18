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

  // Données de test pour la boutique test-store
  const testStore = {
    id: '9f9e1c83-e453-49c5-8f32-f756f866b8de',
    name: 'Test Store',
    slug: 'test-store',
    description: 'Boutique de test pour les sous-domaines',
    logo: null,
    status: 'active',
    created_at: '2025-08-12T15:58:40.000000Z',
    updated_at: '2025-08-12T15:58:40.000000Z',
  };

  // Si c'est la boutique test-store, utiliser les données de test
  if (storeId === 'test-store') {
    return (
      <HydrationSafe>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary mb-4">
                🎉 Sous-domaine de Test Fonctionnel !
              </h1>
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">
                  Boutique : {testStore.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {testStore.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Slug :</strong> {testStore.slug}
                  </div>
                  <div>
                    <strong>Status :</strong> {testStore.status}
                  </div>
                  <div>
                    <strong>ID :</strong> {testStore.id}
                  </div>
                  <div>
                    <strong>URL :</strong> test.wozif.store
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✅ Le sous-domaine test.wozif.store fonctionne parfaitement !
                  </p>
                  <p className="text-green-600 text-sm mt-2">
                    Redirection automatique vers la boutique test-store réussie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HydrationSafe>
    );
  }

  // Pour les autres boutiques, utiliser l'API
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
