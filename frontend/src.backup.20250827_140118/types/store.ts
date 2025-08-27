export interface Store {
  id: string
  name: string
  description: string
  slug: string
  logo?: string
  status: "active" | "pending" | "suspended" | "inactive"
  plan: "starter" | "professional" | "enterprise"
  createdAt: string
  updatedAt: string
  settings: StoreSettings
  stats: StoreStats
  contact: StoreContact
}

export interface StoreSettings {
  currency: string
  language: string
  timezone: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  features: {
    inventory: boolean
    analytics: boolean
    multiChannel: boolean
    customDomain: boolean
  }
}

export interface StoreStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  conversionRate: number
  averageOrderValue: number
}

export interface StoreContact {
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
}

export interface StoreContextType {
  stores: Store[]
  currentStore: Store | null
  isLoading: boolean
  error: string | null
  setCurrentStore: (store: Store) => void
  refreshStores: () => Promise<void>
}
