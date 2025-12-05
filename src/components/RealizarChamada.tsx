import React, { useState } from 'react';
import { Check, X, Calendar, Download } from 'lucide-react';
import { usePassageiros } from '../contexts/PassageirosContext';

export default function RealizarChamada() {
  const { getPassageirosComPresenca, updatePresenca, resetChamada } = usePassageiros();
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const passageiros = getPassageirosComPresenca();

  const handlePresenca = (id: string, presente: boolean) => {
    updatePresenca(id, presente);
  };

  const handleResetChamada = () => {
    if (confirm('Deseja resetar a chamada?')) {
      resetChamada();
    }
  };

  const handleExportChamada = () => {
    const presentes = passageiros.filter((p) => p.presente === true).length;
    const ausentes = passageiros.filter((p) => p.presente === false).length;
    const pendentes = passageiros.filter((p) => p.presente === null).length;

    const content = `Chamada - ${new Date(data).toLocaleDateString('pt-BR')}\n\nResumo:\nPresentes: ${presentes}\nAusentes: ${ausentes}\nPendentes: ${pendentes}\n\nDetalhes:\n${passageiros
      .map((p) => {
        let status = 'Pendente';
        if (p.presente === true) status = 'Presente';
        if (p.presente === false) status = 'Ausente';
        return `${p.nome} - ${p.faculdade} - ${status}`;
      })
      .join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chamada-${data}.txt`;
    a.click();
  };

  const presentes = passageiros.filter((p) => p.presente === true).length;
  const ausentes = passageiros.filter((p) => p.presente === false).length;
  const pendentes = passageiros.filter((p) => p.presente === null).length;

  return (
    <div>
      <h2 className="text-gray-900 mb-6">Realizar Chamada</h2>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end flex-wrap">
          <div className="flex-1 flex-wrap">
            <label className="block text-gray-700 mb-2">Data</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleResetChamada}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Resetar Chamada
          </button>
          <button
            onClick={handleExportChamada}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex-wrap"
          >
            <Download className="w-5 h-5" />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">Presentes</p>
          <p className="text-green-900">{presentes}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Ausentes</p>
          <p className="text-red-900">{ausentes}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700">Pendentes</p>
          <p className="text-gray-900">{pendentes}</p>
        </div>
      </div>

      {/* Lista de Chamada */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">
            Chamada do dia {new Date(data).toLocaleDateString('pt-BR')}
          </h3>
          <p className="text-gray-600">Total: {passageiros.length} passageiros</p>
        </div>
        <div className="divide-y divide-gray-200">
          {passageiros.map((passageiro, index) => (
            <div key={passageiro.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 flex-1 flex-wrap">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 flex-wrap">
                    <span className="text-indigo-700">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 flex-wrap">
                    <p className="text-gray-900 truncate">{passageiro.nome}</p>
                    <p className="text-gray-600 truncate">{passageiro.faculdade}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  <button
                    onClick={() => handlePresenca(passageiro.id, true)}
                    className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                      passageiro.presente === true
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Presente</span>
                  </button>
                  <button
                    onClick={() => handlePresenca(passageiro.id, false)}
                    className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                      passageiro.presente === false
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Ausente</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}