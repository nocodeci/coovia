'use client';

import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { BoutiquePage } from '@/components/boutique-page';
import { Footer } from '@/components/footer';
import { HydrationSafe } from '@/components/hydration-safe';
import { storeService } from '@/services/api';
import { Store } from '@/types/store';
import { use, useState, useEffect } from 'react';

interface StorePageProps {
  params: Promise<{
    storeId: string;
  }>;
}

export default function StorePage({ params }: StorePageProps) {
  // Utiliser React.use() pour déballer les params (Next.js 15)
  const { storeId } = use(params);

  console.log('🔍 [COMPONENT] Composant StorePage rendu avec storeId:', storeId);

  // États pour gérer les données de la boutique
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changé à false
  const [error, setError] = useState<string | null>(null);

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

  // Données pour la boutique yohan-eric-koffi (solution temporaire)
  const yohanStore: Store = {
    id: '9fc12874-b85f-42a7-972a-f1d22554d464',
    name: 'YOHaN ERIC KOFFI',
    slug: 'yohan-eric-koffi',
    description: 'xcv',
    logo: undefined,
    status: 'active',
    created_at: '2025-08-30T02:06:02.000000Z',
    updated_at: '2025-08-30T02:06:02.000000Z',
  };

  // Charger les données de la boutique
  useEffect(() => {
    console.log('🔍 [EFFECT] useEffect déclenché pour storeId:', storeId);
    
    const loadStore = async () => {
      if (storeId === 'test-store') {
        console.log('🔍 [EFFECT] Utilisation des données de test pour test-store');
        setStore(testStore);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 [EFFECT] Appel de l\'API pour storeId:', storeId);
        console.log('🔍 [EFFECT] URL de l\'API:', process.env.NEXT_PUBLIC_API_URL);
        setIsLoading(true);
        setError(null);
        
        const result = await storeService.getStoreBySlug(storeId);
        console.log('🔍 [EFFECT] Résultat de l\'API:', result);
        
        setStore(result);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ [EFFECT] Erreur lors du chargement de la boutique:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setIsLoading(false);
      }
    };

    loadStore();
  }, [storeId]);

  // Test direct de l'API
  useEffect(() => {
    console.log('🔍 [TEST] Test direct de l\'API');
    const testAPI = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/stores');
        const data = await response.json();
        console.log('🔍 [TEST] Réponse directe de l\'API:', data);
      } catch (err) {
        console.error('❌ [TEST] Erreur test API:', err);
      }
    };
    testAPI();
  }, []);

  // Utiliser les bonnes données selon le storeId
  const finalStore = storeId === 'test-store' ? testStore : 
                    storeId === 'yohan-eric-koffi' ? yohanStore : 
                    store;

  console.log('🔍 [PAGE] storeId:', storeId);
  console.log('🔍 [PAGE] isLoading:', isLoading);
  console.log('🔍 [PAGE] error:', error);
  console.log('🔍 [PAGE] store:', store);
  console.log('🔍 [PAGE] finalStore:', finalStore);

  // Test direct de l'API dans le composant
  if (storeId === 'yohan-eric-koffi' && !store) {
    console.log('🔍 [DIRECT] Test direct de l\'API pour yohan-eric-koffi');
    fetch('http://localhost:8000/api/stores')
      .then(response => response.json())
      .then(data => {
        console.log('🔍 [DIRECT] Réponse directe de l\'API:', data);
        const foundStore = data.data.find((s: Store) => s.slug === 'yohan-eric-koffi');
        console.log('🔍 [DIRECT] Boutique trouvée:', foundStore);
        if (foundStore) {
          setStore(foundStore);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('❌ [DIRECT] Erreur test API:', err);
      });
  }

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

  // Si finalStore est undefined, afficher un message d'erreur
  if (!finalStore) {
    return (
      <HydrationSafe>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur de chargement
            </h1>
            <p className="text-gray-600 mb-4">
              Impossible de charger les données de la boutique.
            </p>
            <p className="text-sm text-gray-500">
              Veuillez réessayer plus tard.
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
          <BoutiquePage storeId={storeId} store={finalStore} />
        </main>
        <Footer />
      </div>
    </HydrationSafe>
  );
}
