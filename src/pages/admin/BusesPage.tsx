
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { busesApi, Bus, BusCreate } from '../../api/buses';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Plus, Edit, Trash2, ArrowLeft, Bus as BusIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function BusesPage() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [busToDelete, setBusToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<BusCreate>({
    plate: '',
    capacity: 0,
  });

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      setLoading(true);
      const data = await busesApi.list();
      setBuses(data);
    } catch (error: any) {
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await busesApi.update(editingBus.id, formData);
        toast.success('Veículo atualizado!');
      } else {
        await busesApi.create(formData);
        toast.success('Veículo cadastrado!');
      }
      setIsFormOpen(false);
      resetForm();
      loadBuses();
    } catch (error: any) {
      toast.error('Erro ao salvar.');
    }
  };

  const confirmDelete = async () => {
    if (!busToDelete) return;
    try {
      await busesApi.delete(busToDelete);
      toast.success('Excluído com sucesso!');
      setIsDeleteOpen(false);
      loadBuses();
    } catch (error: any) {
      toast.error('Erro ao excluir.');
    }
  };

  const handleEdit = (bus: Bus) => {
    setEditingBus(bus);
    setFormData({ plate: bus.plate, capacity: bus.capacity });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingBus(null);
    setFormData({ plate: '', capacity: 0 });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Frota de Ônibus</h1>
              <p className="text-slate-500 text-sm italic">Gerencie os veículos disponíveis na sua frota</p>
            </div>
          </div>

          {/* BOTÃO CORRIGIDO */}
          <Button 
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Ônibus
          </Button>
        </div>

        {/* Tabela */}
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-10 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : buses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <BusIcon className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum ônibus cadastrado</h3>
                <p className="text-slate-500 mb-6">Comece adicionando o primeiro veículo à sua frota</p>
                <Button 
                  onClick={() => { resetForm(); setIsFormOpen(true); }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Ônibus
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="py-4 px-6 font-bold">Veículo / Placa</TableHead>
                    <TableHead className="py-4 px-6 font-bold text-center">Capacidade</TableHead>
                    <TableHead className="py-4 px-6 font-bold text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buses.map((bus) => (
                    <TableRow key={bus.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <BusIcon className="text-blue-600 w-5 h-5" />
                          <span className="font-mono font-bold border-2 border-slate-800 px-2 py-1 rounded bg-white shadow-sm">
                            {bus.plate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Badge variant="secondary" className="text-sm px-4 py-1">
                          {bus.capacity} Lugares
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEdit(bus)}
                            className="h-11 w-11 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => { setBusToDelete(bus.id); setIsDeleteOpen(true); }}
                            className="h-11 w-11 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* MODAL DE FORMULÁRIO */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBus ? 'Editar Ônibus' : 'Novo Ônibus'}</DialogTitle>
              <DialogDescription>Preencha os dados técnicos do veículo.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="plate">Placa</Label>
                <Input 
                  id="plate" 
                  value={formData.plate} 
                  onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})} 
                  placeholder="ABC-1234" 
                  maxLength={8}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacidade</Label>
                <Input 
                  id="capacity" 
                  type="number" 
                  min="1"
                  value={formData.capacity} 
                  onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} 
                  placeholder="Ex: 40"
                  required 
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Salvar Dados</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL DE EXCLUSÃO */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[400px] text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            <DialogTitle className="text-xl">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="py-4">
              Tem certeza que deseja remover este ônibus? Esta ação não pode ser desfeita.
            </DialogDescription>
            <DialogFooter className="flex gap-3">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1">Não, cancelar</Button>
              <Button variant="destructive" onClick={confirmDelete} className="flex-1">Sim, confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}