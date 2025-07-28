import type {
    User,
    LoginCredentials,
    RegisterData,
    AuthResponse,
    MfaSetupResponse,
    MfaVerificationData,
  } from "@/types/auth"
  import type { Category } from "@/types/categorie"
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
  
  interface ApiResponse<T> {
    data?: T
    message?: string
    errors?: Record<string, string[]>
    success?: boolean
  }
  
  class ApiClient {
    private baseURL: string
    private token: string | null = null
  
    constructor(baseURL: string) {
      this.baseURL = baseURL
      this.token = localStorage.getItem("auth_token")
    }
  
    setToken(token: string) {
      this.token = token
      localStorage.setItem("auth_token", token)
    }
  
    removeToken() {
      this.token = null
      localStorage.removeItem("auth_token")
    }
  
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${this.baseURL}${endpoint}`
  
      const headers = new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      })
  
      if (options.headers) {
        if (options.headers instanceof Headers) {
          options.headers.forEach((value, key) => {
            headers.set(key, value)
          })
        } else if (typeof options.headers === "object") {
          Object.entries(options.headers).forEach(([key, value]) => {
            headers.set(key, value)
          })
        }
      }
  
      if (this.token) {
        headers.set("Authorization", `Bearer ${this.token}`)
      }
  
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        })
  
        const data = await response.json()
  
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }
  
        return data
      } catch (error) {
        console.error("API Error:", error)
        throw error
      }
    }
  
    // Auth endpoints
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      return this.request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })
    }
  
    async register(userData: RegisterData): Promise<AuthResponse> {
      return this.request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })
    }
  
    async verifyMfa(data: MfaVerificationData): Promise<AuthResponse> {
      return this.request<AuthResponse>("/auth/verify-mfa", {
        method: "POST",
        body: JSON.stringify(data),
      })
    }
  
    async setupMfa(): Promise<MfaSetupResponse> {
      return this.request<MfaSetupResponse>("/auth/mfa/setup", {
        method: "POST",
      })
    }
  
    async enableMfa(code: string): Promise<{ message: string; backup_codes: string[] }> {
      return this.request<{ message: string; backup_codes: string[] }>("/auth/mfa/enable", {
        method: "POST",
        body: JSON.stringify({ code }),
      })
    }
  
    async disableMfa(password: string): Promise<{ message: string }> {
      return this.request<{ message: string }>("/auth/mfa/disable", {
        method: "POST",
        body: JSON.stringify({ password }),
      })
    }
  
    async regenerateBackupCodes(): Promise<{ backup_codes: string[]; message: string }> {
      return this.request<{ backup_codes: string[]; message: string }>("/auth/mfa/backup-codes", {
        method: "POST",
      })
    }
  
    async logout(): Promise<{ message: string }> {
      return this.request<{ message: string }>("/auth/logout", {
        method: "POST",
      })
    }
  
    async logoutAll(): Promise<{ message: string }> {
      return this.request<{ message: string }>("/auth/logout-all", {
        method: "POST",
      })
    }
  
    async getProfile(): Promise<User> {
      return this.request<User>("/auth/me")
    }
  
    // Test endpoints
    async testConnection(): Promise<any> {
      return this.request<any>("/test")
    }
  
    async healthCheck(): Promise<any> {
      return this.request<any>("/health")
    }
  
    // Stores endpoints
    async getStores(): Promise<any[]> {
      return this.request<any[]>("/stores")
    }
  
    async createStore(storeData: any): Promise<any> {
      return this.request<any>("/stores", {
        method: "POST",
        body: JSON.stringify(storeData),
      })
    }
  
    async getStore(storeId: string): Promise<any> {
      return this.request<any>(`/stores/${storeId}`)
    }
  
    async updateStore(storeId: string, storeData: any): Promise<any> {
      return this.request<any>(`/stores/${storeId}`, {
        method: "PUT",
        body: JSON.stringify(storeData),
      })
    }
  
    async deleteStore(storeId: string): Promise<void> {
      return this.request<void>(`/stores/${storeId}`, {
        method: "DELETE",
      })
    }
  
    // Products endpoints
    async getProducts(storeId: string, params?: Record<string, string>): Promise<any[]> {
      const queryString = params ? "?" + new URLSearchParams(params).toString() : ""
      return this.request<any[]>(`/stores/${storeId}/products${queryString}`)
    }
  
    async createProduct(storeId: string, productData: any): Promise<any> {
      return this.request<any>(`/stores/${storeId}/products`, {
        method: "POST",
        body: JSON.stringify(productData),
      })
    }
  
    async getProduct(storeId: string, productId: string): Promise<any> {
      return this.request<any>(`/stores/${storeId}/products/${productId}`)
    }
  
    async updateProduct(storeId: string, productId: string, productData: any): Promise<any> {
      return this.request<any>(`/stores/${storeId}/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      })
    }
  
    async deleteProduct(storeId: string, productId: string): Promise<void> {
      return this.request<void>(`/stores/${storeId}/products/${productId}`, {
        method: "DELETE",
      })
    }
  
    async uploadProductImage(storeId: string, productId: string, file: File): Promise<{ url: string }> {
      const formData = new FormData()
      formData.append("image", file)
  
      return this.request<{ url: string }>(`/stores/${storeId}/products/${productId}/upload-image`, {
        method: "POST",
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        body: formData,
      })
    }
  
    // Orders endpoints
    async getOrders(storeId: string, params?: Record<string, string>): Promise<any[]> {
      const queryString = params ? "?" + new URLSearchParams(params).toString() : ""
      return this.request<any[]>(`/stores/${storeId}/orders${queryString}`)
    }
  
    async getOrder(storeId: string, orderId: string): Promise<any> {
      return this.request<any>(`/stores/${storeId}/orders/${orderId}`)
    }
  
    async updateOrderStatus(storeId: string, orderId: string, status: string): Promise<any> {
      return this.request<any>(`/stores/${storeId}/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      })
    }
  
    // Customers endpoints
    async getCustomers(storeId: string, params?: Record<string, string>): Promise<any[]> {
      const queryString = params ? "?" + new URLSearchParams(params).toString() : ""
      return this.request<any[]>(`/stores/${storeId}/customers${queryString}`)
    }
  
    async createCustomer(storeId: string, customerData: any): Promise<any> {
      return this.request<any>(`/stores/${storeId}/customers`, {
        method: "POST",
        body: JSON.stringify(customerData),
      })
    }
  
    // Payment endpoints
    async getPaymentGateways(): Promise<any[]> {
      return this.request<any[]>("/payments/gateways")
    }
  
    async getPaymentMethods(gatewayId: string): Promise<any[]> {
      return this.request<any[]>(`/payments/gateways/${gatewayId}/methods`)
    }
  
    async getTransactions(params?: Record<string, string>): Promise<any[]> {
      const queryString = params ? "?" + new URLSearchParams(params).toString() : ""
      return this.request<any[]>(`/payments/transactions${queryString}`)
    }
  
    async getTransaction(transactionId: string): Promise<any> {
      return this.request<any>(`/payments/transactions/${transactionId}`)
    }
  
    // Dashboard stats
    async getDashboardStats(storeId: string): Promise<any> {
      return this.request<any>(`/stores/${storeId}/stats`)
    }
  
    // Categories endpoints
    async getCategories(): Promise<Category[]> {
      return this.request<Category[]>("/categories")
    }
  
    async createCategory(categoryData: { name: string; description?: string }): Promise<Category> {
      return this.request<Category>("/categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
      })
    }
  
    async updateCategory(categoryId: string, categoryData: Partial<Category>): Promise<Category> {
      return this.request<Category>(`/categories/${categoryId}`, {
        method: "PUT",
        body: JSON.stringify(categoryData),
      })
    }
  
    async deleteCategory(categoryId: string): Promise<void> {
      return this.request<void>(`/categories/${categoryId}`, {
        method: "DELETE",
      })
    }
  }
  
  export const apiClient = new ApiClient(API_BASE_URL)
  