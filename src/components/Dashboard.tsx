import React, { useState } from 'react';
import { Users, Car, ClipboardList, UserCheck, LogOut, Menu, X } from 'lucide-react';
import CadastroAlunos from './CadastroAlunos';
import CadastroMotoristas from './CadastroMotoristas';
import ListaPassageiros from './ListaPassageiros';
import RealizarChamada from './RealizarChamada';

interface DashboardProps {
  onLogout: () => void;
}

type Screen = 'home' | 'alunos' | 'motoristas' | 'lista' | 'chamada';

export default function Dashboard({ onLogout }: DashboardProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'alunos':
        return <CadastroAlunos />;
      case 'motoristas':
        return <CadastroMotoristas />;
      case 'lista':
        return <ListaPassageiros />;
      case 'chamada':
        return <RealizarChamada />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  const menuItems = [
    { id: 'home' as Screen, label: 'Início', icon: Menu },
    { id: 'alunos' as Screen, label: 'Alunos', icon: Users },
    { id: 'motoristas' as Screen, label: 'Motoristas', icon: Car },
    { id: 'lista' as Screen, label: 'Lista Diária', icon: ClipboardList },
    { id: 'chamada' as Screen, label: 'Chamada', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-wrap">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-indigo-900 text-white flex-wrap">
        <div className="p-6">
          <h1 className="text-white">Sistema de Transporte</h1>
        </div>
        <nav className="flex-1 px-4 flex-wrap">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                  currentScreen === item.id
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-200 hover:bg-indigo-800 hover:text-white transition flex-wrap"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col flex-wrap">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-wrap">
          <h1 className="text-gray-900">Sistema de Transporte</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-indigo-900 text-white">
            <nav className="px-4 py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentScreen(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                      currentScreen === item.id
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-200 hover:bg-indigo-800 hover:text-white transition flex-wrap"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </nav>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 flex-wrap">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const cards = [
    {
      title: 'Cadastro de Alunos',
      description: 'Cadastre e gerencie alunos do transporte escolar',
      icon: Users,
      color: 'bg-blue-500',
      screen: 'alunos' as Screen,
    },
    {
      title: 'Cadastro de Motoristas',
      description: 'Cadastre e gerencie os motoristas',
      icon: Car,
      color: 'bg-green-500',
      screen: 'motoristas' as Screen,
    },
    {
      title: 'Lista Diária',
      description: 'Gere e visualize a lista de passageiros do dia',
      icon: ClipboardList,
      color: 'bg-purple-500',
      screen: 'lista' as Screen,
    },
    {
      title: 'Realizar Chamada',
      description: 'Realize a chamada dos passageiros',
      icon: UserCheck,
      color: 'bg-orange-500',
      screen: 'chamada' as Screen,
    },
  ];

  return (
    <div>
      <h2 className="text-gray-900 mb-8">Bem-vindo ao Sistema de Transporte</h2>
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.screen}
              onClick={() => onNavigate(card.screen)}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition text-left"
            >
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
