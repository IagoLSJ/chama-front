import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'ADMIN' | 'RESPONSIBLE' | 'STUDENT';
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'RESPONSIBLE' | 'STUDENT';
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    try {
      // Log dos dados sendo enviados
      console.log('📤 Enviando login:', { email: credentials.email, password: '***' });
      
      const response = await api.post<TokenResponse>(
        '/auth/login',
        {
          email: credentials.email,
          password: credentials.password,
        }
      );
      
      console.log('✅ Login bem-sucedido:', response.data);
      return response.data;
    } catch (error: any) {
      // Log detalhado do erro para debug
      console.error('❌ Erro no login:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        detail: error.response?.data?.detail,
      });
      
      // Mostrar detalhes do erro 422
      if (error.response?.status === 422) {
        console.error('📋 Detalhes da validação:', error.response.data);
      }
      
      throw error;
    }
  },

  signup: async (data: SignupData): Promise<User> => {
    const response = await api.post<User>('/auth/signup', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};
