export interface CartItem {
  id: number;
  session_id: string;
  product_id: number;
  quantity: number;
  size: string | null;
  added_at: string;
  title: string;
  price: number;
  images: string | null;
}
