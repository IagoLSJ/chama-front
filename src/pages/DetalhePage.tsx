import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Phone, Car } from 'lucide-react';

export default function DetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data - em produção, buscaria os dados da API
  const detalhes = {
    '1': {
      titulo: 'Viagem para UFMG - Campus Pampulha',
      descricao: 'Transporte escolar matutino com saída às 7h da manhã. Rota otimizada passando pelos principais pontos de embarque da região.',
      data: '2025-12-06',
      horario: '07:00',
      local: 'Rua Central, 100',
      destino: 'UFMG - Campus Pampulha',
      participantes: 15,
      categoria: 'viagem',
      imagem: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
      motorista: 'Carlos Oliveira',
      telefone: '(31) 97777-7777',
      veiculo: 'Van Branca - ABC-1234',
      capacidade: 20,
      pontos: [
        { horario: '07:00', local: 'Rua Central, 100' },
        { horario: '07:15', local: 'Av. Principal, 500' },
        { horario: '07:30', local: 'Praça da Estação' },
        { horario: '08:00', local: 'UFMG - Portaria Principal' },
      ],
    },
    '2': {
      titulo: 'Rota PUC Minas - Coração Eucarístico',
      descricao: 'Transporte vespertino com retorno às 18h. Conforto e segurança para os estudantes.',
      data: '2025-12-06',
      horario: '18:00',
      local: 'Praça da Liberdade',
      destino: 'PUC Minas - Coração Eucarístico',
      participantes: 12,
      categoria: 'viagem',
      imagem: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
      motorista: 'Ana Paula',
      telefone: '(31) 96666-6666',
      veiculo: 'Micro-ônibus - XYZ-5678',
      capacidade: 25,
      pontos: [
        { horario: '18:00', local: 'PUC Minas - Portaria' },
        { horario: '18:20', local: 'Av. Brasil, 200' },
        { horario: '18:40', local: 'Shopping Center' },
        { horario: '19:00', local: 'Terminal Rodoviário' },
      ],
    },
  };

  const item = detalhes[id as keyof typeof detalhes] || detalhes['1'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div
        className="h-64 md:h-96 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${item.imagem})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate('/feed')}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Title Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 -mt-16 relative z-10">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full inline-block mb-3">
            {item.categoria}
          </span>
          <h1 className="text-gray-900 mb-4">{item.titulo}</h1>
          <p className="text-gray-600">{item.descricao}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-900 mb-4">Informações Gerais</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 flex-wrap">
                <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-gray-600">Data</p>
                  <p className="text-gray-900">{new Date(item.data).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-wrap">
                <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-gray-600">Horário</p>
                  <p className="text-gray-900">{item.horario}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-wrap">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-gray-600">Destino</p>
                  <p className="text-gray-900">{item.destino}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-wrap">
                <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-gray-600">Participantes</p>
                  <p className="text-gray-900">
                    {item.participantes}/{item.capacidade} vagas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-900 mb-4">Motorista e Veículo</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 flex-wrap">
                <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-gray-600">Motorista</p>
                  <p className="text-gray-900">{item.motorista}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-wrap">
                <Phone className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-gray-600">Telefone</p>
                  <p className="text-gray-900">{item.telefone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-wrap">
                <Car className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-gray-600">Veículo</p>
                  <p className="text-gray-900">{item.veiculo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pontos de Parada */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-gray-900 mb-4">Pontos de Parada</h3>
          <div className="space-y-4">
            {item.pontos.map((ponto, index) => (
              <div key={index} className="flex items-start gap-4 flex-wrap">
                <div className="flex-shrink-0 flex-wrap">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-wrap">
                    <span className="text-indigo-700">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 pt-2 flex-wrap">
                  <p className="text-gray-900">{ponto.local}</p>
                  <p className="text-gray-600">{ponto.horario}</p>
                </div>
                {index < item.pontos.length - 1 && (
                  <div className="absolute left-9 mt-12 w-0.5 h-8 bg-indigo-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl flex-wrap">
            Confirmar Presença
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}
