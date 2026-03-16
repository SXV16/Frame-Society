export interface User {
  id: number;
  email: string;
  name: string | null;
  role: 'buyer' | 'admin';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  name?: string;
  password: string;
  role?: 'buyer' | 'admin';
}
