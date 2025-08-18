import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Store {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  theme?: string;
  settings?: any;
}

export const storeService = {
  // Récupérer les données d'une boutique par son slug (sous-domaine)
  async getStoreBySlug(slug: string): Promise<Store | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/boutique/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la boutique:', error);
      return null;
    }
  },

  // Récupérer les produits d'une boutique (endpoint public)
  async getStoreProducts(storeSlug: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/boutique/${storeSlug}/products`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return [];
    }
  },

  // Vérifier si un sous-domaine existe
  async checkSubdomainExists(subdomain: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/boutique/${subdomain}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  // Générer un slug unique pour une nouvelle boutique
  async generateUniqueSlug(storeName: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/stores/generate-slug`, {
        name: storeName
      });
      return response.data.slug;
    } catch (error) {
      // Fallback: générer un slug basique
      return storeName.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
  }
};
