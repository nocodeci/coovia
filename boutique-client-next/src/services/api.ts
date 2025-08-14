import axios from 'axios';
import { Store, Product } from '@/types/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.wozif.store/api';

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
      const response = await api.get(`/stores/${slug}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération de la boutique');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la boutique:', error);
      throw new Error(`Impossible de récupérer la boutique ${slug}`);
    }
  },

  // Récupérer les produits d'une boutique
  async getStoreProducts(storeId: string): Promise<Product[]> {
    try {
      const response = await api.get(`/stores/${storeId}/products`);
      if (response.data.success) {
        return response.data.data.data || response.data.data; // Gérer la pagination
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des produits');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw new Error(`Impossible de récupérer les produits de la boutique ${storeId}`);
    }
  },

  // Récupérer les catégories d'une boutique
  async getStoreCategories(storeId: string): Promise<string[]> {
    try {
      const response = await api.get(`/stores/${storeId}/products`);
      if (response.data.success) {
        const products = response.data.data.data || response.data.data;
        const categories = [...new Set(products.map((product: Product) => product.category))];
        return categories.filter((cat): cat is string => Boolean(cat));
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des catégories');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw new Error(`Impossible de récupérer les catégories de la boutique ${storeId}`);
    }
  },

  // Récupérer un produit par son ID
  async getProductById(productId: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${productId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération du produit');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw new Error(`Impossible de récupérer le produit ${productId}`);
    }
  },
};

export default api;
