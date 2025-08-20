import axios from 'axios';
import { Store, Product } from '@/types/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const storeService = {
  // Récupérer une boutique par son slug
  async getStoreBySlug(slug: string): Promise<Store> {
    try {
      const response = await api.get(`/boutique/${slug}`);
      // L'endpoint public retourne directement les données de la boutique
      if (response.data && response.data.id) {
        return response.data;
      } else if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération de la boutique');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la boutique:', error);
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
      const response = await api.get(`/boutique/${storeSlug}/products`);
      // L'endpoint public retourne directement un tableau de produits
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.success) {
        return response.data.data.data || response.data.data; // Gérer la pagination
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des produits');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
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
      const response = await api.get(`/boutique/${storeSlug}/products/${productId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération du produit');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
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
