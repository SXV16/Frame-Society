export interface Product {
  id: number;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  category_id: number | null;
  sizes: string[] | null;
  stock_status: boolean;
  rating: number | null;
  reviews_count: number;
  tags: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListParams {
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest';
}
