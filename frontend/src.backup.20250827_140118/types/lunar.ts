// Types pour l'intégration avec Lunar E-commerce

export interface LunarProduct {
  id: string;
  product_type_id: number;
  status: 'published' | 'draft' | 'archived';
  attribute_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  brand_id?: number;
  store_id?: number;
}

export interface LunarProductVariant {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  compare_price?: number;
  stock_quantity: number;
  weight?: number;
  height?: number;
  width?: number;
  depth?: number;
  attribute_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LunarCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  company_name?: string;
  vat_no?: string;
  meta?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LunarOrder {
  id: string;
  customer_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  currency_code: string;
  created_at: string;
  updated_at: string;
}

export interface LunarOrderLine {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface LunarCollection {
  id: string;
  name: string;
  handle: string;
  description?: string;
  attribute_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LunarBrand {
  id: string;
  name: string;
  handle: string;
  description?: string;
  logo?: string;
  created_at: string;
  updated_at: string;
}

export interface LunarCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface LunarCart {
  id: string;
  customer_id?: string;
  status: 'active' | 'expired' | 'converted';
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  currency_code: string;
  created_at: string;
  updated_at: string;
}

export interface LunarCartLine {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
  updated_at: string;
}

// Types pour les réponses API
export interface LunarApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LunarPaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message?: string;
  success: boolean;
}

// Types pour les filtres et recherche
export interface ProductFilters {
  category?: string;
  brand?: string;
  price_min?: number;
  price_max?: number;
  status?: string;
  search?: string;
  sort_by?: 'name' | 'price' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// Types pour les formulaires
export interface CreateProductForm {
  name: string;
  description?: string;
  sku: string;
  price: number;
  compare_price?: number;
  stock_quantity: number;
  category_id?: string;
  brand_id?: string;
  status: 'active' | 'inactive' | 'pending';
  is_featured: boolean;
  images?: File[];
}

export interface CreateCustomerForm {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password?: string;
  company_name?: string;
  vat_no?: string;
}

export interface CreateOrderForm {
  customer_id: string;
  products: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
  }>;
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
}

export interface Address {
  first_name: string;
  last_name: string;
  company_name?: string;
  line_one: string;
  line_two?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
}
