import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Download, AlertTriangle } from 'lucide-react';
import { usePassageiros } from '../contexts/PassageirosContext';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

export default function ListaPassageiros() {
  const { passageiros, addPassageiro, removePassageiro } = usePassageiros();
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [passageiroToDelete, setPassageiroToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nome: '', faculdade: '' });

  const handleAddPassageiro = (e: React.FormEvent) => {
    e.preventDefault();
    addPassageiro(formData);
    setFormData({ nome: '', faculdade: '' });
    setIsModalOpen(false);
  };

  const handleRemovePassageiro = (id: string) => {
    if (confirm('Deseja remover este passageiro da lista?')) {
      removePassageiro(id);
    }
  };

  const handleExportList = () => {
    const content = `Lista de Passageiros - ${new Date(data).toLocaleDateString('pt-BR')}\n\n${passageiros
      .map((p, i) => `${i + 1}. ${p.nome} - ${p.faculdade}`)
      .join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-passageiros-${data}.txt`;
    a.click();
  };

  return (
    <div>
      <h2 className="text-gray-900 mb-6">Lista Diária de Passageiros</h2>

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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex-wrap"
          >
            <Plus className="w-5 h-5" />
            Adicionar Passageiro
          </button>
          <button
            onClick={handleExportList}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex-wrap"
          >
            <Download className="w-5 h-5" />
            Exportar Lista
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">
            Passageiros do dia {new Date(data).toLocaleDateString('pt-BR')}
          </h3>
          <p className="text-gray-600">Total: {passageiros.length} passageiros</p>
        </div>
        <div className="divide-y divide-gray-200">
          {passageiros.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum passageiro cadastrado para esta data
            </div>
          ) : (
            passageiros.map((passageiro, index) => (
              <div key={passageiro.id} className="p-4 hover:bg-gray-50 flex items-center justify-between flex-wrap">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-wrap">
                    <span className="text-indigo-700">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-gray-900">{passageiro.nome}</p>
                    <p className="text-gray-600">{passageiro.faculdade}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemovePassageiroClick(passageiro.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 flex-wrap">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-gray-900 mb-6">Adicionar Passageiro</h3>
              <form onSubmit={handleAddPassageiro} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Faculdade</label>
                  <input
                    type="text"
                    value={formData.faculdade}
                    onChange={(e) => setFormData({ ...formData, faculdade: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({ nome: '', faculdade: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex-wrap"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex-wrap"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
          <DialogTitle className="text-xl">Remover Passageiro</DialogTitle>
          <DialogDescription className="py-4">
            Tem certeza que deseja remover este passageiro da lista?
          </DialogDescription>
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="flex-1">
              Não, cancelar
            </Button>
            <Button variant="destructive" onClick={handleRemovePassageiro} className="flex-1">
              Sim, remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}