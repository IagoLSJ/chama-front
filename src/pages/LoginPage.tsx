import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular autenticação/registro
    if (isRegistering) {
      console.log('Registrando:', formData);
    } else {
      console.log('Login:', formData);
    }
    navigate('/dashboard');
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
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="Digite seu email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none flex-wrap">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="senha"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between flex-wrap">
                <label className="flex items-center flex-wrap">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-indigo-600 hover:text-indigo-700 transition">
                  Esqueceu a senha?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              {isRegistering ? 'Criar Conta' : 'Entrar'}
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
