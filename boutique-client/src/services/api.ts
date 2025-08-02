import axios from 'axios';

// Configuration de base pour l'API
const API_BASE_URL = 'http://localhost:8000/api';

// Créer l'instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types pour les données
export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive';
  domain?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  category: string;
  tags: string[];
  in_stock: boolean;
  rating: number;
  review_count: number;
  store_id: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Services API
export const storeService = {
  // Récupérer les informations d'une boutique par son slug
  getStoreBySlug: async (slug: string): Promise<Store> => {
    console.log('🔍 Fetching store with slug:', slug);
    console.log('🌐 API URL:', `${API_BASE_URL}/boutique/${slug}`);
    try {
      const response = await api.get(`/boutique/${slug}`);
      console.log('✅ Store data received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching store:', error);
      console.error('❌ Error details:', error.response?.data);
      throw error;
    }
  },

  // Récupérer les produits d'une boutique par son slug
  getStoreProducts: async (slug: string): Promise<Product[]> => {
    console.log('🔍 Fetching products for store slug:', slug);
    console.log('🌐 API URL:', `${API_BASE_URL}/boutique/${slug}/products`);
    try {
      const response = await api.get(`/boutique/${slug}/products`);
      console.log('✅ Products data received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching products:', error);
      console.error('❌ Error details:', error.response?.data);
      throw error;
    }
  },

  // Récupérer un produit spécifique
  getProduct: async (slug: string, productId: string): Promise<Product> => {
    const response = await api.get(`/boutique/${slug}/products/${productId}`);
    return response.data;
  },

  // Récupérer les catégories d'une boutique
  getStoreCategories: async (slug: string): Promise<any[]> => {
    const response = await api.get(`/boutique/${slug}/categories`);
    return response.data;
  },
};

export const cartService = {
  // Sauvegarder le panier dans le localStorage
  saveCart: (cartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  },

  // Récupérer le panier du localStorage
  getCart: (): CartItem[] => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  // Vider le panier
  clearCart: () => {
    localStorage.removeItem('cart');
  },
};

export default api; 