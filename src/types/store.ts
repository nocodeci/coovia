export interface Store {
    id: string
    name: string
    slug: string
    description: string
    logo?: string
    banner?: string
    status: "active" | "inactive" | "pending"
    category: string
    address: {
      street: string
      city: string
      country: string
      postalCode: string
    }
    contact: {
      email: string
      phone: string
      website?: string
    }
    settings: {
      currency: string
      language: string
      timezone: string
      allowReviews: boolean
      autoApproveReviews: boolean
    }
    stats: {
      averageOrderValue: any
      monthlyGrowth: number
      totalProducts: number
      totalOrders: number
      totalRevenue: number
      totalCustomers: number
      rating: number
      reviewCount: number
    }
    createdAt: string
    updatedAt: string
    ownerId: string
  }
  
  export interface Product {
    id: string
    storeId: string
    name: string
    description: string
    price: number
    comparePrice?: number
    images: string[]
    category: string
    tags: string[]
    status: "active" | "inactive" | "draft"
    inventory: {
      quantity: number
      trackQuantity: boolean
      allowBackorder: boolean
    }
    seo: {
      title?: string
      description?: string
    }
    createdAt: string
    updatedAt: string
  }
  
  export interface Order {
    id: string
    storeId: string
    customerId: string
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
    paymentStatus: "pending" | "paid" | "failed" | "refunded"
    items: OrderItem[]
    subtotal: number
    tax: number
    shipping: number
    total: number
    shippingAddress: Address
    billingAddress: Address
    createdAt: string
    updatedAt: string
  }
  
  export interface OrderItem {
    id: string
    productId: string
    productName: string
    productImage: string
    quantity: number
    price: number
    total: number
  }
  
  export interface Address {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    province: string
    country: string
    zip: string
    phone?: string
  }
  
  export interface Customer {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    addresses: Address[]
    totalOrders: number
    totalSpent: number
    createdAt: string
    updatedAt: string
  }
  