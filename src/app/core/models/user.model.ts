export interface User {
  id: number;
  email: string;
  name: string | null;
  role: 'buyer' | 'admin';
  bio?: string;
  profile_picture_url?: string;
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
