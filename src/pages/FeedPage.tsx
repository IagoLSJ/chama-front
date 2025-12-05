import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Car, ClipboardList, UserCheck, ArrowLeft } from 'lucide-react';

export default function FeedPage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Cadastro de Alunos',
      description: 'Cadastre e gerencie alunos do transporte escolar',
      icon: Users,
      color: 'bg-blue-500',
      route: '/dashboard',
    },
    {
      title: 'Cadastro de Motoristas',
      description: 'Cadastre e gerencie os motoristas',
      icon: Car,
      color: 'bg-green-500',
      route: '/dashboard',
    },
    {
      title: 'Lista Diária',
      description: 'Gere e visualize a lista de passageiros do dia',
      icon: ClipboardList,
      color: 'bg-purple-500',
      route: '/dashboard',
    },
    {
      title: 'Realizar Chamada',
      description: 'Realize a chamada dos passageiros',
      icon: UserCheck,
      color: 'bg-orange-500',
      route: '/dashboard',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/login')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-gray-900">Sistema de Transporte</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-gray-900 mb-8">Bem-vindo ao Sistema de Transporte</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => navigate(card.route)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition text-left"
              >
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900">{card.title}</h3>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}