export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface Store {
  stats: any
  id: string
  name: string
  description: string
  logo?: string
  banner?: string
  status: "active" | "inactive" | "suspended"
  is_active: boolean
  category: string
  slug: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface CreateStoreData {
  name: string
  description: string
  category: string
  logo?: string
  banner?: string
}

export interface UpdateStoreData {
  name?: string
  description?: string
  category?: string
  logo?: string
  banner?: string
  status?: "active" | "inactive" | "suspended"
  is_active?: boolean
}

export interface StoreStats {
  total_products: number
  total_orders: number
  total_customers: number
  total_revenue: number
  monthly_revenue: Array<{
    month: string
    revenue: number
  }>
  top_products: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  recent_orders: Array<{
    id: string
    customer_name: string
    total: number
    status: string
    created_at: string
  }>
  growth_percentage: {
    products: number
    orders: number
    customers: number
    revenue: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface StoreFilters {
  status?: string
  category?: string
  search?: string
}
