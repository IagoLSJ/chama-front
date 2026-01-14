import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; senha?: string }>({});
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: { email?: string; senha?: string } = {};
    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Email inválido. Digite um email válido.';
      isValid = false;
    }

    if (!formData.senha.trim()) {
      errors.senha = 'Senha é obrigatória';
      isValid = false;
    } else if (formData.senha.length < 6) {
      errors.senha = 'Senha deve ter no mínimo 6 caracteres';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (isRegistering) {
      toast.info('Use a área de administração para criar novos usuários');
      return;
    }

    // Validação no frontend
    if (!validateForm()) {
      setError('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(formData.email, formData.senha);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      // Log detalhado do erro
      console.error('Erro completo:', error);
      
      // Tratar diferentes tipos de erro com mensagens específicas
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error.response?.status === 422) {
        // Erro de validação - mostrar detalhes
        const details = error.response.data?.detail;
        if (Array.isArray(details)) {
          const validationErrors: { email?: string; senha?: string } = {};
          details.forEach((d: any) => {
            const field = d.loc?.[d.loc.length - 1];
            const msg = d.msg || d.message || 'inválido';
            if (field === 'email' || field === 'password') {
              validationErrors[field === 'email' ? 'email' : 'senha'] = msg;
            }
          });
          
          if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            errorMessage = 'Dados inválidos. Verifique os campos destacados.';
          } else {
            errorMessage = `Dados inválidos: ${details.map((d: any) => d.msg || d.message).join(', ')}`;
          }
        } else if (typeof details === 'string') {
          errorMessage = details;
        } else {
          errorMessage = 'Dados inválidos. Verifique se o email e senha estão corretos.';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
        setFieldErrors({
          email: 'Email ou senha incorretos',
          senha: 'Email ou senha incorretos',
        });
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('CORS')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e se o servidor está online.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 flex-wrap">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 flex-wrap">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-gray-900 mb-2">
              {isRegistering ? 'Criar Conta' : 'Bem-vindo'}
            </h1>
            <p className="text-gray-600">
              {isRegistering ? 'Preencha os dados para se cadastrar' : 'Entre com suas credenciais'}
            </p>
          </div>

          {/* Mensagem de Erro Geral */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div>
                <label htmlFor="nome" className="block text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none flex-wrap">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Digite seu nome"
                    required={isRegistering}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none flex-wrap">
                  <Mail className={`h-5 w-5 ${fieldErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) {
                      setFieldErrors({ ...fieldErrors, email: undefined });
                    }
                    setError(null);
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    fieldErrors.email 
                      ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Digite seu email"
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="senha" className="block text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none flex-wrap">
                  <Lock className={`h-5 w-5 ${fieldErrors.senha ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  id="senha"
                  value={formData.senha}
                  onChange={(e) => {
                    setFormData({ ...formData, senha: e.target.value });
                    if (fieldErrors.senha) {
                      setFieldErrors({ ...fieldErrors, senha: undefined });
                    }
                    setError(null);
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    fieldErrors.senha 
                      ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              {fieldErrors.senha && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.senha}
                </p>
              )}
            </div>

            {!isRegistering && (
              <div className="flex items-center flex-wrap">
                <label className="flex items-center flex-wrap">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-600">Lembrar-me</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : isRegistering ? 'Criar Conta' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-indigo-600 hover:text-indigo-700 transition"
              >
                {isRegistering ? 'Faça login' : 'Cadastre-se'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
