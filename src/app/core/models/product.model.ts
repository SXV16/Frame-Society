export interface Product {
  id: number;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  category_id: number | null;
  sizes: string[] | null;
  stock_status: boolean;
  stock_count: number;
  rating: number | null;
  reviews_count: number;
  tags: string[] | null;
  posted_by_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListParams {
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'title_asc' | 'title_desc' | 'category_asc';
  size?: string;
  search?: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}
