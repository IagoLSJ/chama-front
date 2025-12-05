import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular autenticação
    if (login && senha) {
      onLogin();
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
            <h1 className="text-gray-900 mb-2">Sistema de Transporte</h1>
            <p className="text-gray-600">Entre com suas credenciais</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Field */}
            <div>
              <label htmlFor="login" className="block text-gray-700 mb-2">
                Login
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none flex-wrap">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="Digite seu login"
                  required
                />
              </div>
            </div>

            {/* Senha Field */}
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
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
