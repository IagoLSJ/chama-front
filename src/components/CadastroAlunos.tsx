import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

interface Aluno {
  id: string;
  nome: string;
  faculdade: string;
  telefone: string;
  endereco: string;
}

export default function CadastroAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    faculdade: '',
    telefone: '',
    endereco: '',
  });

  const handleOpenModal = (aluno?: Aluno) => {
    if (aluno) {
      setEditingAluno(aluno);
      setFormData({
        nome: aluno.nome,
        faculdade: aluno.faculdade,
        telefone: aluno.telefone,
        endereco: aluno.endereco,
      });
    } else {
      setEditingAluno(null);
      setFormData({ nome: '', faculdade: '', telefone: '', endereco: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAluno(null);
    setFormData({ nome: '', faculdade: '', telefone: '', endereco: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAluno) {
      // Atualizar aluno existente
      setAlunos(alunos.map((a) => (a.id === editingAluno.id ? { ...a, ...formData } : a)));
    } else {
      // Adicionar novo aluno
      const newAluno: Aluno = {
        id: Date.now().toString(),
        ...formData,
      };
      setAlunos([...alunos, newAluno]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover este aluno?')) {
      setAlunos(alunos.filter((a) => a.id !== id));
    }
  };

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.faculdade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 flex-wrap">
        <h2 className="text-gray-900">Cadastro de Alunos</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex-wrap"
        >
          <Plus className="w-5 h-5" />
          Novo Aluno
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou faculdade..."
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
                <th className="px-6 py-3 text-left text-gray-700">Faculdade</th>
                <th className="px-6 py-3 text-left text-gray-700">Telefone</th>
                <th className="px-6 py-3 text-left text-gray-700">Endereço</th>
                <th className="px-6 py-3 text-left text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAlunos.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{aluno.nome}</td>
                  <td className="px-6 py-4 text-gray-600">{aluno.faculdade}</td>
                  <td className="px-6 py-4 text-gray-600">{aluno.telefone}</td>
                  <td className="px-6 py-4 text-gray-600">{aluno.endereco}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleOpenModal(aluno)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(aluno.id)}
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
                {editingAluno ? 'Atualizar Aluno' : 'Novo Aluno'}
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
                  <label className="block text-gray-700 mb-2">Faculdade</label>
                  <input
                    type="text"
                    value={formData.faculdade}
                    onChange={(e) => setFormData({ ...formData, faculdade: e.target.value })}
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
                  <label className="block text-gray-700 mb-2">Endereço</label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
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
                    {editingAluno ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}