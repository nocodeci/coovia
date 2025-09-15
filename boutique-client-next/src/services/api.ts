import axios from 'axios';
import { Store, Product } from '@/types/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.wozif.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 secondes de timeout
});

export const storeService = {
  // Récupérer une boutique par son slug
  async getStoreBySlug(slug: string): Promise<Store> {
    try {
      console.log(`🔍 [API] Recherche de la boutique avec le slug: ${slug}`);
      console.log(`🌐 [API] URL de l'API: ${API_BASE_URL}/stores`);
      
      // Récupérer toutes les boutiques et filtrer par slug
      const response = await api.get(`/stores`);
      console.log('📡 [API] Réponse API boutiques:', response.data);
      
      if (response.data.success && response.data.data) {
        const stores = response.data.data;
        console.log(`🔍 [API] Nombre de boutiques trouvées: ${stores.length}`);
        console.log(`🔍 [API] Slugs disponibles:`, stores.map((s: Store) => s.slug));
        
        const store = stores.find((s: Store) => s.slug === slug);
        
        if (store) {
          console.log('✅ [API] Boutique trouvée:', store);
          return store;
        } else {
          console.log('❌ [API] Boutique non trouvée avec le slug:', slug);
          throw new Error(`Boutique avec le slug "${slug}" non trouvée`);
        }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des boutiques');
      }
    } catch (error) {
      console.error('❌ [API] Erreur lors de la récupération de la boutique:', error);
      console.log('🔄 [API] Retour de la boutique par défaut pour le slug:', slug);
      
      // Retourner une boutique par défaut au lieu de throw une erreur
      return {
        id: 'default-store',
        name: 'Boutique par défaut',
        slug: slug,
        description: 'Boutique temporairement indisponible',
        logo: undefined,
        status: 'inactive',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  // Récupérer les produits d'une boutique (endpoint public)
  async getStoreProducts(storeSlug: string): Promise<Product[]> {
    try {
      console.log(`🔍 [API] Recherche des produits pour la boutique: ${storeSlug}`);
      
      // D'abord, récupérer l'ID de la boutique à partir du slug
      const storesResponse = await api.get(`/stores`);
      if (storesResponse.data.success && storesResponse.data.data) {
        const stores = storesResponse.data.data;
        const store = stores.find((s: Store) => s.slug === storeSlug);
        
        if (store) {
          // Essayer l'endpoint public pour les produits
          try {
            console.log(`🌐 [API] URL de l'API: ${API_BASE_URL}/stores/${store.id}/products/public`);
            const response = await api.get(`/stores/${store.id}/products/public`);
            console.log('📡 [API] Réponse API produits publics:', response.data);
            
            if (response.data.success && response.data.data) {
              console.log('✅ [API] Produits trouvés (endpoint public):', response.data.data.length);
              return response.data.data;
            }
          } catch (publicError) {
            console.log('⚠️ [API] Endpoint public non disponible, essai avec l\'endpoint normal');
          }
          
          // Si l'endpoint public n'existe pas, essayer l'endpoint normal
          console.log(`🌐 [API] URL de l'API: ${API_BASE_URL}/stores/${store.id}/products`);
          const response = await api.get(`/stores/${store.id}/products`);
          console.log('📡 [API] Réponse API produits:', response.data);
          
          // L'endpoint public retourne directement un tableau de produits
          if (Array.isArray(response.data)) {
            console.log('✅ [API] Produits trouvés (format array):', response.data.length);
            return response.data;
          } else if (response.data.success) {
            const products = response.data.data.data || response.data.data; // Gérer la pagination
            console.log('✅ [API] Produits trouvés (format success):', products.length);
            return products;
          } else {
            throw new Error(response.data.message || 'Erreur lors de la récupération des produits');
          }
        } else {
          throw new Error(`Boutique avec le slug "${storeSlug}" non trouvée`);
        }
      } else {
        throw new Error('Erreur lors de la récupération des boutiques');
      }
    } catch (error) {
      console.error('❌ [API] Erreur lors de la récupération des produits:', error);
      // Retourner un tableau vide au lieu de throw une erreur
      return [];
    }
  },

  // Récupérer les catégories d'une boutique (endpoint public)
  async getStoreCategories(storeSlug: string): Promise<string[]> {
    try {
      const response = await api.get(`/boutique/${storeSlug}/categories`);
      if (response.data.success) {
        return response.data.data;
      } else {
        // Fallback: extraire les catégories des produits
        const productsResponse = await api.get(`/boutique/${storeSlug}/products`);
        if (Array.isArray(productsResponse.data)) {
          const products = productsResponse.data;
          const categories = [...new Set(products.map((product: Product) => product.category))];
          return categories.filter((cat): cat is string => Boolean(cat));
        } else {
          throw new Error(response.data.message || 'Erreur lors de la récupération des catégories');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      // Retourner un tableau vide au lieu de throw une erreur
      return [];
    }
  },

  // Récupérer un produit par son ID (endpoint public)
  async getProductById(storeSlug: string, productId: string): Promise<Product> {
    try {
      console.log(`🔍 [API] Recherche du produit ${productId} dans la boutique ${storeSlug}`);
      
      // Gérer les produits de test hardcodés
      if (storeSlug === 'yohan-eric-koffi') {
        const testProducts: Product[] = [
          {
            id: 'y1',
            name: 'Cisco',
            slug: 'cisco',
            description: 'Produit Cisco de qualité professionnelle',
            price: 2000,
            image: 'https://pub-f24a39478f6a41e7ab82e6f4291ed5ae.r2.dev/uploads/thumbnails/img-1228_1757000786_IOiHO7Vd_medium.JPG',
            category: 'Templates',
            store_id: '9fc12874-b85f-42a7-972a-f1d22554d464',
            created_at: '2025-08-30T02:06:02.000000Z',
            updated_at: '2025-08-30T02:06:02.000000Z',
          },
          {
            id: 'y2',
            name: 'dbfv',
            slug: 'dbfv',
            description: 'Produit dbfv de qualité professionnelle',
            price: 2000,
            image: 'https://pub-f24a39478f6a41e7ab82e6f4291ed5ae.r2.dev/uploads/thumbnails/img-1228_1757000786_IOiHO7Vd_medium.JPG',
            category: 'Documents',
            store_id: '9fc12874-b85f-42a7-972a-f1d22554d464',
            created_at: '2025-08-30T02:06:02.000000Z',
            updated_at: '2025-08-30T02:06:02.000000Z',
          },
          {
            id: 'y3',
            name: 'Cisco Audio',
            slug: 'cisco-audio',
            description: 'Produit Cisco Audio de qualité professionnelle',
            price: 2000,
            image: 'https://pub-f24a39478f6a41e7ab82e6f4291ed5ae.r2.dev/uploads/thumbnails/img-1228_1757000786_IOiHO7Vd_medium.JPG',
            category: 'Audio',
            store_id: '9fc12874-b85f-42a7-972a-f1d22554d464',
            created_at: '2025-08-30T02:06:02.000000Z',
            updated_at: '2025-08-30T02:06:02.000000Z',
          },
        ];
        
        // Chercher par slug d'abord, puis par ID
        const testProduct = testProducts.find(p => p.slug === productId) || testProducts.find(p => p.id === productId);
        if (testProduct) {
          console.log('✅ [API] Produit de test trouvé:', testProduct);
          return testProduct;
        }
      }
      
      // D'abord, récupérer l'ID de la boutique à partir du slug
      const storesResponse = await api.get(`/stores`);
      if (storesResponse.data.success && storesResponse.data.data) {
        const stores = storesResponse.data.data;
        const store = stores.find((s: Store) => s.slug === storeSlug);
        
        if (store) {
          // Récupérer tous les produits de la boutique
          const productsResponse = await api.get(`/stores/${store.id}/products`);
          console.log('📡 [API] Réponse API produits:', productsResponse.data);
          
          let products: Product[] = [];
          if (Array.isArray(productsResponse.data)) {
            products = productsResponse.data;
          } else if (productsResponse.data.success) {
            products = productsResponse.data.data.data || productsResponse.data.data;
          }
          
          // Trouver le produit spécifique
          const product = products.find((p: Product) => p.id === productId);
          if (product) {
            console.log('✅ [API] Produit trouvé:', product);
            return product;
          } else {
            throw new Error(`Produit avec l'ID "${productId}" non trouvé`);
          }
        } else {
          throw new Error(`Boutique avec le slug "${storeSlug}" non trouvée`);
        }
      } else {
        throw new Error('Erreur lors de la récupération des boutiques');
      }
    } catch (error) {
      console.error('❌ [API] Erreur lors de la récupération du produit:', error);
      // Retourner un produit par défaut au lieu de throw une erreur
      return {
        id: productId,
        name: 'Produit non disponible',
        description: 'Ce produit est temporairement indisponible',
        price: 0,
        image: undefined,
        category: 'Indisponible',
        store_id: storeSlug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },
};

export default api;
