import api from './axios';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'RESPONSIBLE' | 'STUDENT';
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'ADMIN' | 'RESPONSIBLE' | 'STUDENT';
}

export interface UserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'ADMIN' | 'RESPONSIBLE' | 'STUDENT';
  is_active?: boolean;
  password?: string;
}

export const usersApi = {
  list: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users/');
    return response.data;
  },

  create: async (data: UserCreate): Promise<User> => {
    // Usar o endpoint de signup para criar usuários
    const response = await api.post<User>('/auth/signup', data);
    return response.data;
  },

  update: async (userId: number, data: UserUpdate): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, data);
    return response.data;
  },

  delete: async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};
