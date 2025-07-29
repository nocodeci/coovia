import axios, { type AxiosInstance } from "axios"
import type {
  Store,
  StoreStats,
  CreateStoreData,
  UpdateStoreData,
  ApiResponse,
  User,
  LoginCredentials,
  RegisterData,
} from "@/types/store"

export interface AuthResponse {
  user: User
  token: string
  token_type: string
}

class ApiClient {
  getUser() {
    throw new Error("Method not implemented.")
  }
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    // Intercepteur pour ajouter le token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")
          window.location.href = "/sign-in"
        }
        return Promise.reject(error)
      },
    )
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.client.post<ApiResponse<AuthResponse>>("/login", credentials)
    return response.data
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await this.client.post<ApiResponse<AuthResponse>>("/register", data)
    return response.data
  }

  async logout(): Promise<void> {
    await this.client.post("/logout")
  }

  async me(): Promise<ApiResponse<User>> {
    const response = await this.client.get<ApiResponse<User>>("/me")
    return response.data
  }

  // Store endpoints
  async getStores(): Promise<Store[]> {
    const response = await this.client.get<ApiResponse<Store[]>>("/stores")
    return response.data.data
  }

  async getStore(id: string): Promise<Store> {
    const response = await this.client.get<ApiResponse<Store>>(`/stores/${id}`)
    return response.data.data
  }

  async createStore(data: CreateStoreData): Promise<Store> {
    const response = await this.client.post<ApiResponse<Store>>("/stores", data)
    return response.data.data
  }

  async updateStore(id: string, data: UpdateStoreData): Promise<Store> {
    const response = await this.client.put<ApiResponse<Store>>(`/stores/${id}`, data)
    return response.data.data
  }

  async deleteStore(id: string): Promise<void> {
    await this.client.delete(`/stores/${id}`)
  }

  async toggleStoreStatus(id: string): Promise<Store> {
    const response = await this.client.post<ApiResponse<Store>>(`/stores/${id}/toggle-status`)
    return response.data.data
  }

  async getStoreDashboard(id: string): Promise<StoreStats> {
    const response = await this.client.get<ApiResponse<StoreStats>>(`/stores/${id}/dashboard`)
    return response.data.data
  }
}

export const apiClient = new ApiClient()

// Services d'authentification pour compatibilité
export const authService = {
  login: (credentials: LoginCredentials) => apiClient.login(credentials),
  register: (data: RegisterData) => apiClient.register(data),
  logout: () => apiClient.logout(),
  me: () => apiClient.me(),
}

// Services des boutiques pour compatibilité
export const storeService = {
  getStores: () => apiClient.getStores(),
  getStore: (id: string) => apiClient.getStore(id),
  createStore: (data: CreateStoreData) => apiClient.createStore(data),
  updateStore: (id: string, data: UpdateStoreData) => apiClient.updateStore(id, data),
  deleteStore: (id: string) => apiClient.deleteStore(id),
  toggleStoreStatus: (id: string) => apiClient.toggleStoreStatus(id),
  getStoreDashboard: (id: string) => apiClient.getStoreDashboard(id),
}

// Export pour compatibilité avec l'ancien nom
export const storeAPI = storeService

export default apiClient
