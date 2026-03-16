export interface PaymentPayload {
  order_id: number;
  amount: number;
  demo_last4?: string;
  demo_brand?: string;
}

export interface PaymentResponse {
  success: boolean;
  transaction_id: string;
  message: string;
}
