// src/lib/api.ts
import type { Category } from "@/types/categorie"; // Importez depuis votre nouveau fichier de types

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    // Fusionner les en-têtes optionnels
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers.set(key, value);
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers.set(key, value);
        });
      } else if (typeof options.headers === 'object') {
        for (const key in options.headers) {
          if (Object.prototype.hasOwnProperty.call(options.headers, key)) {
            headers.set(key, options.headers[key]);
          }
        }
      }
    }

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers, // Utilisez l'objet Headers préparé
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) {
    return this.request<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async getProfile() {
    return this.request<any>("/auth/me");
  }

  // Stores endpoints
  async getStores() {
    return this.request<any[]>("/stores");
  }

  async createStore(storeData: any) {
    return this.request<any>("/stores", {
      method: "POST",
      body: JSON.stringify(storeData),
    });
  }

  async getStore(storeId: string) {
    return this.request<any>(`/stores/${storeId}`);
  }

  async updateStore(storeId: string, storeData: any) {
    return this.request<any>(`/stores/${storeId}`, {
      method: "PUT",
      body: JSON.stringify(storeData),
    });
  }

  async deleteStore(storeId: string) {
    return this.request(`/stores/${storeId}`, {
      method: "DELETE",
    });
  }

  // Products endpoints
  async getProducts(storeId: string, params?: Record<string, string>) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<any[]>(`/stores/${storeId}/products${queryString}`);
  }

  async createProduct(storeId: string, productData: any) {
    return this.request<any>(`/stores/${storeId}/products`, {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async getProduct(storeId: string, productId: string) {
    return this.request<any>(`/stores/${storeId}/products/${productId}`);
  }

  async updateProduct(storeId: string, productId: string, productData: any) {
    return this.request<any>(`/stores/${storeId}/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(storeId: string, productId: string) {
    return this.request(`/stores/${storeId}/products/${productId}`, {
      method: "DELETE",
    });
  }

  async uploadProductImage(storeId: string, productId: string, file: File) {
    const formData = new FormData();
    formData.append("image", file);

    // Pour FormData, ne pas définir 'Content-Type': 'application/json'.
    // Le navigateur gère automatiquement le bon 'Content-Type' avec la frontière.
    return this.request<{ url: string }>(`/stores/${storeId}/products/${productId}/upload-image`, {
      method: "POST",
      // Les headers ici ne doivent inclure que l'autorisation et non le Content-Type
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : undefined,
      body: formData,
    });
  }

  async uploadProductFiles(storeId: string, productId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    return this.request<{ files: Array<{ name: string; url: string; size: number }> }>(
      `/stores/${storeId}/products/${productId}/upload-files`,
      {
        method: "POST",
        headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : undefined,
        body: formData,
      },
    );
  }

  // Orders endpoints
  async getOrders(storeId: string, params?: Record<string, string>) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<any[]>(`/stores/${storeId}/orders${queryString}`);
  }

  async getOrder(storeId: string, orderId: string) {
    return this.request<any>(`/stores/${storeId}/orders/${orderId}`);
  }

  async updateOrderStatus(storeId: string, orderId: string, status: string) {
    return this.request<any>(`/stores/${storeId}/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Customers endpoints
  async getCustomers(storeId: string, params?: Record<string, string>) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<any[]>(`/stores/${storeId}/customers${queryString}`);
  }

  async createCustomer(storeId: string, customerData: any) {
    return this.request<any>(`/stores/${storeId}/customers`, {
      method: "POST",
      body: JSON.stringify(customerData),
    });
  }

  // Payment endpoints
  async getPaymentGateways() {
    return this.request<any[]>("/payments/gateways");
  }

  async getPaymentMethods(gatewayId: string) {
    return this.request<any[]>(`/payments/gateways/${gatewayId}/methods`);
  }

  async getTransactions(params?: Record<string, string>) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<any[]>(`/payments/transactions${queryString}`);
  }

  async getTransaction(transactionId: string) {
    return this.request<any>(`/payments/transactions/${transactionId}`);
  }

  // Dashboard stats
  async getDashboardStats(storeId: string) {
    return this.request<any>(`/stores/${storeId}/stats`);
  }

  // Categories endpoints
  async getCategories() {
    return this.request<Category[]>("/categories");
  }

  async createCategory(categoryData: { name: string; description?: string }) {
    return this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  // Méthodes corrigées pour la gestion des catégories
  async updateCategory(categoryId: string, categoryData: Partial<Category>) {
    return this.request<Category>(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(categoryId: string) {
    return this.request<void>(`/categories/${categoryId}`, { // Utilisez `void` si la réponse est vide
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);