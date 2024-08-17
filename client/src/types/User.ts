export interface User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  password?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
