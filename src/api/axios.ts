import axios from 'axios';

// Configuração do Axios
// Usa variável de ambiente VITE_API_URL ou fallback para localhost
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para adicionar o token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Garantir que os headers estão corretos
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação e CORS
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log do erro para debug
    if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
      console.error('❌ Erro de CORS ou conexão:', error.message);
      console.error('Verifique se o backend está rodando em http://localhost:8000');
    }
    
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Só redireciona se não estiver na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
