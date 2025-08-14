export interface BoutiquePageProps {
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  slug: string;
  logo?: string;
  banner?: string;
  theme?: {
    primary_color?: string;
    secondary_color?: string;
  };
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  type?: string;
  image?: string;
  images?: string[];
  tags?: string[];
  is_featured?: boolean;
  is_available?: boolean;
  rating?: number;
  store_id?: string;
  created_at?: string;
  updated_at?: string;
}

