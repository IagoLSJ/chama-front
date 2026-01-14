import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

interface Motorista {
  id: string;
  nome: string;
  cnh: string;
  telefone: string;
  veiculo: string;
  placa: string;
}

export default function CadastroMotoristas() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [motoristaToDelete, setMotoristaToDelete] = useState<string | null>(null);
  const [editingMotorista, setEditingMotorista] = useState<Motorista | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    cnh: '',
    telefone: '',
    veiculo: '',
    placa: '',
  });

  const handleOpenModal = (motorista?: Motorista) => {
    if (motorista) {
      setEditingMotorista(motorista);
      setFormData({
        nome: motorista.nome,
        cnh: motorista.cnh,
        telefone: motorista.telefone,
        veiculo: motorista.veiculo,
        placa: motorista.placa,
      });
    } else {
      setEditingMotorista(null);
      setFormData({ nome: '', cnh: '', telefone: '', veiculo: '', placa: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMotorista(null);
    setFormData({ nome: '', cnh: '', telefone: '', veiculo: '', placa: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMotorista) {
      // Atualizar motorista existente
      setMotoristas(motoristas.map((m) => (m.id === editingMotorista.id ? { ...m, ...formData } : m)));
    } else {
      // Adicionar novo motorista
      const newMotorista: Motorista = {
        id: Date.now().toString(),
        ...formData,
      };
      setMotoristas([...motoristas, newMotorista]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover este motorista?')) {
      setMotoristas(motoristas.filter((m) => m.id !== id));
    }
  };

  const filteredMotoristas = motoristas.filter(
    (motorista) =>
      motorista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motorista.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 flex-wrap">
        <h2 className="text-gray-900">Cadastro de Motoristas</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex-wrap"
        >
          <Plus className="w-5 h-5" />
          Novo Motorista
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="overflow-x-auto">
<table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Nome</th>
                <th className="px-6 py-3 text-left text-gray-700">CNH</th>
                <th className="px-6 py-3 text-left text-gray-700">Telefone</th>
                <th className="px-6 py-3 text-left text-gray-700">Veículo</th>
                <th className="px-6 py-3 text-left text-gray-700">Placa</th>
                <th className="px-6 py-3 text-left text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMotoristas.map((motorista) => (
                <tr key={motorista.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{motorista.nome}</td>
                  <td className="px-6 py-4 text-gray-600">{motorista.cnh}</td>
                  <td className="px-6 py-4 text-gray-600">{motorista.telefone}</td>
                  <td className="px-6 py-4 text-gray-600">{motorista.veiculo}</td>
                  <td className="px-6 py-4 text-gray-600">{motorista.placa}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleOpenModal(motorista)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(motorista.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 flex-wrap">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-gray-900 mb-6">
                {editingMotorista ? 'Atualizar Motorista' : 'Novo Motorista'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="block text-gray-700 mb-2">CNH</label>
                  <input
                    type="text"
                    value={formData.cnh}
                    onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Veículo</label>
                  <input
                    type="text"
                    value={formData.veiculo}
                    onChange={(e) => setFormData({ ...formData, veiculo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Placa</label>
                  <input
                    type="text"
                    value={formData.placa}
                    onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex-wrap"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex-wrap"
                  >
                    {editingMotorista ? 'Atualizar' : 'Cadastrar'}
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
          <DialogTitle className="text-xl">Remover Motorista</DialogTitle>
          <DialogDescription className="py-4">
            Tem certeza que deseja remover este motorista? Esta ação não pode ser desfeita.
          </DialogDescription>
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="flex-1">
              Não, cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">
              Sim, remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}