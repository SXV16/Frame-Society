export interface Order {
  id: number;
  user_id: number | null;
  session_id: string;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export interface CreateOrderResponse {
  id: number;
  total: number;
  status: string;
}
