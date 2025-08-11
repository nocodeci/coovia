import axios from 'axios';
import {
  LunarProduct,
  LunarProductVariant,
  LunarCustomer,
  LunarOrder,
  LunarCollection,
  LunarBrand,
  LunarCategory,
  LunarCart,
  LunarCartLine,
  LunarApiResponse,
  LunarPaginatedResponse,
  ProductFilters,
  CreateProductForm,
  CreateCustomerForm,
  CreateOrderForm,
} from '../types/lunar';

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const LUNAR_API_URL = `${API_BASE_URL}/lunar`;

// Instance axios avec configuration par défaut
const lunarApi = axios.create({
  baseURL: LUNAR_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
lunarApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
lunarApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service des produits
export const productService = {
  // Récupérer tous les produits
  async getAll(filters?: ProductFilters): Promise<LunarPaginatedResponse<LunarProduct>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await lunarApi.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Récupérer un produit par ID
  async getById(id: string): Promise<LunarApiResponse<LunarProduct>> {
    const response = await lunarApi.get(`/products/${id}`);
    return response.data;
  },

  // Rechercher des produits
  async search(query: string, filters?: Omit<ProductFilters, 'search'>): Promise<LunarPaginatedResponse<LunarProduct>> {
    const params = new URLSearchParams({ search: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await lunarApi.get(`/products/search?${params.toString()}`);
    return response.data;
  },

  // Récupérer les produits en vedette
  async getFeatured(): Promise<LunarApiResponse<LunarProduct[]>> {
    const response = await lunarApi.get('/products/featured');
    return response.data;
  },

  // Récupérer les produits par catégorie
  async getByCategory(categorySlug: string, filters?: Omit<ProductFilters, 'category'>): Promise<LunarPaginatedResponse<LunarProduct>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await lunarApi.get(`/products/category/${categorySlug}?${params.toString()}`);
    return response.data;
  },

  // Récupérer les produits par marque
  async getByBrand(brandSlug: string, filters?: Omit<ProductFilters, 'brand'>): Promise<LunarPaginatedResponse<LunarProduct>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await lunarApi.get(`/products/brand/${brandSlug}?${params.toString()}`);
    return response.data;
  },

  // Créer un nouveau produit
  async create(productData: CreateProductForm): Promise<LunarApiResponse<LunarProduct>> {
    const formData = new FormData();
    
    // Ajouter les données du produit
    Object.entries(productData).forEach(([key, value]) => {
      if (key === 'images' && value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formData.append('images[]', file);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await lunarApi.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour un produit
  async update(id: string, productData: Partial<CreateProductForm>): Promise<LunarApiResponse<LunarProduct>> {
    const formData = new FormData();
    
    Object.entries(productData).forEach(([key, value]) => {
      if (key === 'images' && value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formData.append('images[]', file);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await lunarApi.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer un produit
  async delete(id: string): Promise<LunarApiResponse<{ message: string }>> {
    const response = await lunarApi.delete(`/products/${id}`);
    return response.data;
  },
};

// Service des clients
export const customerService = {
  // Récupérer tous les clients
  async getAll(): Promise<LunarPaginatedResponse<LunarCustomer>> {
    const response = await lunarApi.get('/customers');
    return response.data;
  },

  // Récupérer un client par ID
  async getById(id: string): Promise<LunarApiResponse<LunarCustomer>> {
    const response = await lunarApi.get(`/customers/${id}`);
    return response.data;
  },

  // Créer un nouveau client
  async create(customerData: CreateCustomerForm): Promise<LunarApiResponse<LunarCustomer>> {
    const response = await lunarApi.post('/customers', customerData);
    return response.data;
  },

  // Mettre à jour un client
  async update(id: string, customerData: Partial<CreateCustomerForm>): Promise<LunarApiResponse<LunarCustomer>> {
    const response = await lunarApi.put(`/customers/${id}`, customerData);
    return response.data;
  },

  // Supprimer un client
  async delete(id: string): Promise<LunarApiResponse<{ message: string }>> {
    const response = await lunarApi.delete(`/customers/${id}`);
    return response.data;
  },
};

// Service des commandes
export const orderService = {
  // Récupérer toutes les commandes
  async getAll(): Promise<LunarPaginatedResponse<LunarOrder>> {
    const response = await lunarApi.get('/orders');
    return response.data;
  },

  // Récupérer une commande par ID
  async getById(id: string): Promise<LunarApiResponse<LunarOrder>> {
    const response = await lunarApi.get(`/orders/${id}`);
    return response.data;
  },

  // Créer une nouvelle commande
  async create(orderData: CreateOrderForm): Promise<LunarApiResponse<LunarOrder>> {
    const response = await lunarApi.post('/orders', orderData);
    return response.data;
  },

  // Mettre à jour le statut d'une commande
  async updateStatus(id: string, status: LunarOrder['status']): Promise<LunarApiResponse<LunarOrder>> {
    const response = await lunarApi.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

// Service des catégories
export const categoryService = {
  // Récupérer toutes les catégories
  async getAll(): Promise<LunarApiResponse<LunarCategory[]>> {
    const response = await lunarApi.get('/categories');
    return response.data;
  },

  // Récupérer une catégorie par slug
  async getBySlug(slug: string): Promise<LunarApiResponse<LunarCategory>> {
    const response = await lunarApi.get(`/categories/${slug}`);
    return response.data;
  },
};

// Service des marques
export const brandService = {
  // Récupérer toutes les marques
  async getAll(): Promise<LunarApiResponse<LunarBrand[]>> {
    const response = await lunarApi.get('/brands');
    return response.data;
  },

  // Récupérer une marque par handle
  async getByHandle(handle: string): Promise<LunarApiResponse<LunarBrand>> {
    const response = await lunarApi.get(`/brands/${handle}`);
    return response.data;
  },
};

// Service des collections
export const collectionService = {
  // Récupérer toutes les collections
  async getAll(): Promise<LunarApiResponse<LunarCollection[]>> {
    const response = await lunarApi.get('/collections');
    return response.data;
  },

  // Récupérer une collection par handle
  async getByHandle(handle: string): Promise<LunarApiResponse<LunarCollection>> {
    const response = await lunarApi.get(`/collections/${handle}`);
    return response.data;
  },
};

// Service du panier
export const cartService = {
  // Récupérer le panier actuel
  async getCurrent(): Promise<LunarApiResponse<LunarCart>> {
    const response = await lunarApi.get('/cart');
    return response.data;
  },

  // Ajouter un produit au panier
  async addItem(productId: string, variantId: string, quantity: number): Promise<LunarApiResponse<LunarCart>> {
    const response = await lunarApi.post('/cart/items', {
      product_id: productId,
      variant_id: variantId,
      quantity,
    });
    return response.data;
  },

  // Mettre à jour la quantité d'un article
  async updateItem(itemId: string, quantity: number): Promise<LunarApiResponse<LunarCart>> {
    const response = await lunarApi.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  // Supprimer un article du panier
  async removeItem(itemId: string): Promise<LunarApiResponse<LunarCart>> {
    const response = await lunarApi.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Vider le panier
  async clear(): Promise<LunarApiResponse<{ message: string }>> {
    const response = await lunarApi.delete('/cart');
    return response.data;
  },
};

// Export du service principal
export default {
  products: productService,
  customers: customerService,
  orders: orderService,
  categories: categoryService,
  brands: brandService,
  collections: collectionService,
  cart: cartService,
};
